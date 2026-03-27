import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, float, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table - stores scraped and manually added business leads
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  // Business info
  businessName: varchar("businessName", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 128 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  zipCode: varchar("zipCode", { length: 20 }),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  // Google Maps data
  googlePlaceId: varchar("googlePlaceId", { length: 255 }),
  googleRating: float("googleRating"),
  googleReviewCount: int("googleReviewCount"),
  latitude: float("latitude"),
  longitude: float("longitude"),
  // Pain points
  hasNoWebsite: boolean("hasNoWebsite").default(false),
  hasLowReviews: boolean("hasLowReviews").default(false),
  hasPoorBooking: boolean("hasPoorBooking").default(false),
  hasWeakCta: boolean("hasWeakCta").default(false),
  // Lead scoring & status
  leadScore: int("leadScore").default(0),
  disposition: mysqlEnum("disposition", [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
  ]).default("new").notNull(),
  assignedTo: varchar("assignedTo", { length: 128 }),
  source: mysqlEnum("source", ["google_maps", "facebook", "referral", "manual", "cold_call"]).default("manual").notNull(),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Call history for tracking outreach attempts per lead
 */
export const callHistory = mysqlTable("call_history", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  calledBy: varchar("calledBy", { length: 128 }).notNull(),
  outcome: mysqlEnum("outcome", [
    "no_answer",
    "voicemail",
    "callback_scheduled",
    "interested",
    "not_interested",
    "wrong_number",
    "follow_up",
  ]).notNull(),
  duration: int("duration"), // seconds
  summary: text("summary"),
  callDate: timestamp("callDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CallHistory = typeof callHistory.$inferSelect;
export type InsertCallHistory = typeof callHistory.$inferInsert;

/**
 * Notes for collaboration between partners on leads
 */
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  authorName: varchar("authorName", { length: 128 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

/**
 * Client intake forms - captures project requirements from won leads
 */
export const clientIntake = mysqlTable("client_intake", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  // Client info
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 32 }),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessType: varchar("businessType", { length: 128 }),
  // Project requirements
  currentWebsite: varchar("currentWebsite", { length: 512 }),
  desiredFeatures: text("desiredFeatures"),
  targetAudience: text("targetAudience"),
  competitors: text("competitors"),
  budget: varchar("budget", { length: 64 }),
  timeline: varchar("timeline", { length: 128 }),
  additionalNotes: text("additionalNotes"),
  // Status
  status: mysqlEnum("intakeStatus", ["pending", "reviewed", "approved", "archived"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientIntake = typeof clientIntake.$inferSelect;
export type InsertClientIntake = typeof clientIntake.$inferInsert;

/**
 * Projects - tracks website development work for clients
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  intakeId: int("intakeId"),
  // Project info
  projectName: varchar("projectName", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  description: text("description"),
  // Status tracking
  status: mysqlEnum("projectStatus", [
    "planning",
    "design",
    "development",
    "review",
    "revision",
    "completed",
    "on_hold",
  ]).default("planning").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  // Dates
  startDate: timestamp("startDate"),
  dueDate: timestamp("dueDate"),
  completedDate: timestamp("completedDate"),
  // Financial
  quotedPrice: float("quotedPrice"),
  // URLs
  previewUrl: varchar("previewUrl", { length: 512 }),
  liveUrl: varchar("liveUrl", { length: 512 }),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Scrape jobs - tracks Google Maps scraping sessions
 */
export const scrapeJobs = mysqlTable("scrape_jobs", {
  id: int("id").autoincrement().primaryKey(),
  query: varchar("query", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  radius: int("radius").default(5000),
  status: mysqlEnum("scrapeStatus", ["pending", "running", "completed", "failed"]).default("pending").notNull(),
  totalFound: int("totalFound").default(0),
  leadsCreated: int("leadsCreated").default(0),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ScrapeJob = typeof scrapeJobs.$inferSelect;
export type InsertScrapeJob = typeof scrapeJobs.$inferInsert;

/**
 * Generated websites - stores LLM-generated website HTML for leads
 */
export const generatedWebsites = mysqlTable("generated_websites", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  // Business data used for generation
  businessName: varchar("businessName", { length: 255 }).notNull(),
  serviceType: varchar("serviceType", { length: 128 }),
  services: text("services"),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  aboutInfo: text("aboutInfo"),
  // Generated output
  templateId: varchar("templateId", { length: 64 }), // which template was used
  ctaStyle: varchar("ctaStyle", { length: 128 }), // CTA text used
  htmlUrl: varchar("htmlUrl", { length: 1024 }).notNull(), // S3 URL to the HTML file
  previewToken: varchar("previewToken", { length: 64 }).notNull().unique(), // public shareable token
  status: mysqlEnum("websiteStatus", ["generating", "ready", "sent", "approved", "rejected"]).default("generating").notNull(),
  sentAt: timestamp("sentAt"),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedWebsite = typeof generatedWebsites.$inferSelect;
export type InsertGeneratedWebsite = typeof generatedWebsites.$inferInsert;

/**
 * Public intake submissions — business owners submit via QR code landing page
 */
export const intakeSubmissions = mysqlTable("intake_submissions", {
  id: int("id").autoincrement().primaryKey(),
  // Business owner info
  ownerName: varchar("ownerName", { length: 255 }).notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 128 }),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }).default("OK"),
  // Pain points / bottleneck
  biggestChallenge: text("biggestChallenge").notNull(),
  currentOnlinePresence: mysqlEnum("currentOnlinePresence", [
    "no_website",
    "outdated_website",
    "no_google",
    "few_reviews",
    "no_social",
    "other",
  ]),
  monthlyBudget: varchar("monthlyBudget", { length: 64 }),
  urgency: mysqlEnum("urgency", ["asap", "this_month", "next_few_months", "just_exploring"]).default("just_exploring"),
  howHeard: varchar("howHeard", { length: 255 }),
  // Processing
  status: mysqlEnum("submissionStatus", ["new", "classified", "converted", "archived"]).default("new").notNull(),
  leadId: int("leadId"),  // set when converted to a lead
  classificationId: int("classificationId"),  // set when Alfred classifies
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IntakeSubmission = typeof intakeSubmissions.$inferSelect;
export type InsertIntakeSubmission = typeof intakeSubmissions.$inferInsert;

/**
 * AI Classifications (Alfred) — auto-analysis of intake submissions
 */
export const aiClassifications = mysqlTable("ai_classifications", {
  id: int("id").autoincrement().primaryKey(),
  intakeSubmissionId: int("intakeSubmissionId").notNull(),
  // Classification results
  bottleneckType: varchar("bottleneckType", { length: 128 }).notNull(),
  bottleneckSummary: text("bottleneckSummary").notNull(),
  suggestedInstallType: varchar("suggestedInstallType", { length: 128 }).notNull(),
  suggestedTemplateFamily: varchar("suggestedTemplateFamily", { length: 128 }),
  priorityScore: int("priorityScore").default(50),
  reasoning: text("reasoning"),
  // Raw LLM response for debugging
  rawResponse: text("rawResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiClassification = typeof aiClassifications.$inferSelect;
export type InsertAiClassification = typeof aiClassifications.$inferInsert;

/**
 * Install Packets — structured work orders created from leads
 */
export const installPackets = mysqlTable("install_packets", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  intakeSubmissionId: int("intakeSubmissionId"),
  // Business identity
  businessName: varchar("businessName", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 128 }),
  contactName: varchar("contactName", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 32 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  // Install spec
  installType: varchar("installType", { length: 128 }).notNull(),
  templateFamily: varchar("templateFamily", { length: 128 }),
  stylePreset: varchar("stylePreset", { length: 128 }),
  selectedSections: text("selectedSections"),  // JSON array of section block names
  contentSlots: text("contentSlots"),  // JSON object of content slot values
  missingSlots: text("missingSlots"),  // JSON array of required but empty slots
  ctaRecommendation: varchar("ctaRecommendation", { length: 255 }),
  operatorNotes: text("operatorNotes"),
  // Status workflow
  status: mysqlEnum("packetStatus", [
    "draft",
    "in_review",
    "approved",
    "in_progress",
    "delivered",
    "on_hold",
  ]).default("draft").notNull(),
  assignedTo: varchar("assignedTo", { length: 128 }),
  createdBy: varchar("createdBy", { length: 128 }),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InstallPacket = typeof installPackets.$inferSelect;
export type InsertInstallPacket = typeof installPackets.$inferInsert;

/**
 * Packet Activity Trail — logs status changes and actions on packets
 */
export const packetActivity = mysqlTable("packet_activity", {
  id: int("id").autoincrement().primaryKey(),
  packetId: int("packetId").notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  fromStatus: varchar("fromStatus", { length: 64 }),
  toStatus: varchar("toStatus", { length: 64 }),
  performedBy: varchar("performedBy", { length: 128 }).notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PacketActivity = typeof packetActivity.$inferSelect;
export type InsertPacketActivity = typeof packetActivity.$inferInsert;
