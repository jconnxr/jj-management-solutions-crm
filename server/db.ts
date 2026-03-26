import { eq, desc, asc, and, sql, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  leads, InsertLead, Lead,
  callHistory, InsertCallHistory,
  notes, InsertNote,
  clientIntake, InsertClientIntake,
  projects, InsertProject,
  scrapeJobs, InsertScrapeJob,
  generatedWebsites, InsertGeneratedWebsite,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// User helpers
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Lead helpers
// ============================================================================

export async function getLeads(filters?: {
  disposition?: string;
  source?: string;
  search?: string;
  painPoint?: string;
  industry?: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { leads: [], total: 0 };

  const conditions = [];
  if (filters?.disposition && filters.disposition !== "all") {
    conditions.push(eq(leads.disposition, filters.disposition as any));
  }
  if (filters?.source && filters.source !== "all") {
    conditions.push(eq(leads.source, filters.source as any));
  }
  if (filters?.painPoint) {
    if (filters.painPoint === "no_website") conditions.push(eq(leads.hasNoWebsite, true));
    if (filters.painPoint === "low_reviews") conditions.push(eq(leads.hasLowReviews, true));
    if (filters.painPoint === "poor_booking") conditions.push(eq(leads.hasPoorBooking, true));
    if (filters.painPoint === "weak_cta") conditions.push(eq(leads.hasWeakCta, true));
  }
  if (filters?.industry && filters.industry !== "all") {
    conditions.push(eq(leads.industry, filters.industry));
  }
  if (filters?.search) {
    conditions.push(
      or(
        like(leads.businessName, `%${filters.search}%`),
        like(leads.city, `%${filters.search}%`),
        like(leads.phone, `%${filters.search}%`)
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const sortCol = filters?.sortBy === "leadScore" ? leads.leadScore
    : filters?.sortBy === "businessName" ? leads.businessName
    : filters?.sortBy === "createdAt" ? leads.createdAt
    : filters?.sortBy === "industry" ? leads.industry
    : leads.leadScore;
  const sortDir = filters?.sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

  const [rows, countResult] = await Promise.all([
    db.select().from(leads).where(where).orderBy(sortDir)
      .limit(filters?.limit ?? 50)
      .offset(filters?.offset ?? 0),
    db.select({ count: sql<number>`count(*)` }).from(leads).where(where),
  ]);

  return { leads: rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function getDistinctIndustries() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.selectDistinct({ industry: leads.industry })
    .from(leads)
    .where(sql`${leads.industry} IS NOT NULL AND ${leads.industry} != ''`)
    .orderBy(asc(leads.industry));
  return result.map(r => r.industry).filter(Boolean) as string[];
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0];
}

export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const score = calculateLeadScore(lead);
  const result = await db.insert(leads).values({ ...lead, leadScore: score });
  return result[0].insertId;
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const score = calculateLeadScore(data as InsertLead);
  await db.update(leads).set({ ...data, leadScore: score }).where(eq(leads.id, id));
}

export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(callHistory).where(eq(callHistory.leadId, id));
  await db.delete(notes).where(eq(notes.leadId, id));
  await db.delete(leads).where(eq(leads.id, id));
}

export async function bulkCreateLeads(leadsData: InsertLead[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const withScores = leadsData.map(l => ({ ...l, leadScore: calculateLeadScore(l) }));
  if (withScores.length === 0) return 0;
  await db.insert(leads).values(withScores);
  return withScores.length;
}

export async function getExistingPlaceIds(placeIds: string[]): Promise<Set<string>> {
  const db = await getDb();
  if (!db) return new Set();
  if (placeIds.length === 0) return new Set();
  const rows = await db.select({ googlePlaceId: leads.googlePlaceId })
    .from(leads)
    .where(sql`${leads.googlePlaceId} IN (${sql.join(placeIds.map(id => sql`${id}`), sql`, `)})`);
  return new Set(rows.map(r => r.googlePlaceId).filter(Boolean) as string[]);
}

function calculateLeadScore(lead: Partial<InsertLead>): number {
  let score = 0;
  if (lead.hasNoWebsite) score += 40;
  if (lead.hasLowReviews) score += 20;
  if (lead.hasPoorBooking) score += 15;
  if (lead.hasWeakCta) score += 10;
  if (lead.phone) score += 10;
  if (lead.email) score += 5;
  return score;
}

// ============================================================================
// Call history helpers
// ============================================================================

export async function getCallHistory(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(callHistory).where(eq(callHistory.leadId, leadId)).orderBy(desc(callHistory.callDate));
}

export async function createCallRecord(record: InsertCallHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(callHistory).values(record);
  return result[0].insertId;
}

// ============================================================================
// Notes helpers
// ============================================================================

export async function getNotes(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(eq(notes.leadId, leadId)).orderBy(desc(notes.createdAt));
}

export async function createNote(note: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notes).values(note);
  return result[0].insertId;
}

// ============================================================================
// Client intake helpers
// ============================================================================

export async function getIntakes(filters?: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { intakes: [], total: 0 };
  const conditions = [];
  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(clientIntake.status, filters.status as any));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [rows, countResult] = await Promise.all([
    db.select().from(clientIntake).where(where).orderBy(desc(clientIntake.createdAt))
      .limit(filters?.limit ?? 50).offset(filters?.offset ?? 0),
    db.select({ count: sql<number>`count(*)` }).from(clientIntake).where(where),
  ]);
  return { intakes: rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function getIntakeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientIntake).where(eq(clientIntake.id, id)).limit(1);
  return result[0];
}

export async function createIntake(intake: InsertClientIntake) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clientIntake).values(intake);
  return result[0].insertId;
}

export async function updateIntake(id: number, data: Partial<InsertClientIntake>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clientIntake).set(data).where(eq(clientIntake.id, id));
}

// ============================================================================
// Project helpers
// ============================================================================

export async function getProjects(filters?: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { projects: [], total: 0 };
  const conditions = [];
  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(projects.status, filters.status as any));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [rows, countResult] = await Promise.all([
    db.select().from(projects).where(where).orderBy(desc(projects.createdAt))
      .limit(filters?.limit ?? 50).offset(filters?.offset ?? 0),
    db.select({ count: sql<number>`count(*)` }).from(projects).where(where),
  ]);
  return { projects: rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(project);
  return result[0].insertId;
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set(data).where(eq(projects.id, id));
}

// ============================================================================
// Scrape job helpers
// ============================================================================

export async function getScrapeJobs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scrapeJobs).orderBy(desc(scrapeJobs.createdAt));
}

export async function createScrapeJob(job: InsertScrapeJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(scrapeJobs).values(job);
  return result[0].insertId;
}

export async function updateScrapeJob(id: number, data: Partial<InsertScrapeJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(scrapeJobs).set(data).where(eq(scrapeJobs.id, id));
}

// ============================================================================
// Generated Website helpers
// ============================================================================

export async function createGeneratedWebsite(data: InsertGeneratedWebsite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(generatedWebsites).values(data);
  return result[0].insertId;
}

export async function getGeneratedWebsitesByLead(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(generatedWebsites).where(eq(generatedWebsites.leadId, leadId)).orderBy(desc(generatedWebsites.createdAt));
}

export async function getGeneratedWebsiteByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(generatedWebsites).where(eq(generatedWebsites.previewToken, token)).limit(1);
  return result[0];
}

export async function updateGeneratedWebsite(id: number, data: Partial<InsertGeneratedWebsite>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(generatedWebsites).set(data).where(eq(generatedWebsites.id, id));
}

// ============================================================================
// Dashboard stats
// ============================================================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalLeads: 0, newLeads: 0, contacted: 0, qualified: 0, proposals: 0, won: 0, lost: 0, activeProjects: 0, pendingIntakes: 0 };

  const [leadStats, projectStats, intakeStats] = await Promise.all([
    db.select({
      total: sql<number>`count(*)`,
      newCount: sql<number>`SUM(CASE WHEN disposition = 'new' THEN 1 ELSE 0 END)`,
      contacted: sql<number>`SUM(CASE WHEN disposition = 'contacted' THEN 1 ELSE 0 END)`,
      qualified: sql<number>`SUM(CASE WHEN disposition = 'qualified' THEN 1 ELSE 0 END)`,
      proposals: sql<number>`SUM(CASE WHEN disposition = 'proposal' THEN 1 ELSE 0 END)`,
      won: sql<number>`SUM(CASE WHEN disposition = 'won' THEN 1 ELSE 0 END)`,
      lost: sql<number>`SUM(CASE WHEN disposition = 'lost' THEN 1 ELSE 0 END)`,
    }).from(leads),
    db.select({
      active: sql<number>`SUM(CASE WHEN projectStatus NOT IN ('completed', 'on_hold') THEN 1 ELSE 0 END)`,
    }).from(projects),
    db.select({
      pending: sql<number>`SUM(CASE WHEN intakeStatus = 'pending' THEN 1 ELSE 0 END)`,
    }).from(clientIntake),
  ]);

  const ls = leadStats[0];
  return {
    totalLeads: Number(ls?.total ?? 0),
    newLeads: Number(ls?.newCount ?? 0),
    contacted: Number(ls?.contacted ?? 0),
    qualified: Number(ls?.qualified ?? 0),
    proposals: Number(ls?.proposals ?? 0),
    won: Number(ls?.won ?? 0),
    lost: Number(ls?.lost ?? 0),
    activeProjects: Number(projectStats[0]?.active ?? 0),
    pendingIntakes: Number(intakeStats[0]?.pending ?? 0),
  };
}
