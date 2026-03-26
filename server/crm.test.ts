import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@jjmanagement.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

function createUnauthContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("CRM Routers", () => {
  describe("auth.me", () => {
    it("returns user when authenticated", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toBeTruthy();
      expect(result?.openId).toBe("test-user-001");
      expect(result?.name).toBe("Test User");
    });

    it("returns null when not authenticated", async () => {
      const { ctx } = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toBeNull();
    });
  });

  describe("dashboard.stats (protected)", () => {
    it("rejects unauthenticated requests", async () => {
      const { ctx } = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.dashboard.stats()).rejects.toThrow();
    });

    it("returns stats object for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const stats = await caller.dashboard.stats();
      expect(stats).toHaveProperty("totalLeads");
      expect(stats).toHaveProperty("newLeads");
      expect(stats).toHaveProperty("contacted");
      expect(stats).toHaveProperty("qualified");
      expect(stats).toHaveProperty("proposals");
      expect(stats).toHaveProperty("won");
      expect(stats).toHaveProperty("lost");
      expect(stats).toHaveProperty("activeProjects");
      expect(stats).toHaveProperty("pendingIntakes");
      expect(typeof stats.totalLeads).toBe("number");
    });
  });

  describe("leads CRUD (protected)", () => {
    it("rejects unauthenticated lead list request", async () => {
      const { ctx } = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.leads.list()).rejects.toThrow();
    });

    it("creates, retrieves, updates, and deletes a lead", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create
      const { id } = await caller.leads.create({
        businessName: "Test Plumbing Co",
        phone: "555-1234",
        city: "Dallas",
        state: "TX",
        industry: "Plumbing",
        source: "manual",
        hasNoWebsite: true,
      });
      expect(id).toBeGreaterThan(0);

      // Retrieve
      const lead = await caller.leads.getById({ id });
      expect(lead.businessName).toBe("Test Plumbing Co");
      expect(lead.hasNoWebsite).toBe(true);
      expect(lead.leadScore).toBeGreaterThan(0); // should have score from hasNoWebsite + phone

      // Update disposition
      await caller.leads.update({ id, disposition: "contacted" });
      const updated = await caller.leads.getById({ id });
      expect(updated.disposition).toBe("contacted");

      // List with filter
      const filtered = await caller.leads.list({ disposition: "contacted" });
      expect(filtered.leads.some((l) => l.id === id)).toBe(true);

      // Delete
      await caller.leads.delete({ id });
      await expect(caller.leads.getById({ id })).rejects.toThrow();
    });

    it("validates lead creation requires businessName", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(
        caller.leads.create({ businessName: "" })
      ).rejects.toThrow();
    });
  });

  describe("calls CRUD (protected)", () => {
    it("creates and lists call records for a lead", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a lead first
      const { id: leadId } = await caller.leads.create({
        businessName: "Call Test Biz",
        source: "manual",
      });

      // Log a call
      const { id: callId } = await caller.calls.create({
        leadId,
        calledBy: "Jordan",
        outcome: "interested",
        summary: "They want a quote for a website",
      });
      expect(callId).toBeGreaterThan(0);

      // List calls
      const calls = await caller.calls.list({ leadId });
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls.some((c) => c.calledBy === "Jordan")).toBe(true);

      // Cleanup
      await caller.leads.delete({ id: leadId });
    });
  });

  describe("notes CRUD (protected)", () => {
    it("creates and lists notes for a lead", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const { id: leadId } = await caller.leads.create({
        businessName: "Note Test Biz",
        source: "manual",
      });

      const { id: noteId } = await caller.notes.create({
        leadId,
        authorName: "Jesse",
        content: "Spoke with owner, very interested in a website",
      });
      expect(noteId).toBeGreaterThan(0);

      const notesList = await caller.notes.list({ leadId });
      expect(notesList.length).toBeGreaterThanOrEqual(1);
      expect(notesList.some((n) => n.authorName === "Jesse")).toBe(true);

      await caller.leads.delete({ id: leadId });
    });
  });

  describe("intake CRUD (protected)", () => {
    it("creates, retrieves, and updates intake status", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const { id } = await caller.intake.create({
        contactName: "John Smith",
        businessName: "Smith's HVAC",
        businessType: "HVAC",
        budget: "$2,500 - $5,000",
        timeline: "2-4 weeks",
        desiredFeatures: "Contact form, service pages, booking",
      });
      expect(id).toBeGreaterThan(0);

      const intake = await caller.intake.getById({ id });
      expect(intake.contactName).toBe("John Smith");
      expect(intake.status).toBe("pending");

      await caller.intake.updateStatus({ id, status: "reviewed" });
      const updated = await caller.intake.getById({ id });
      expect(updated.status).toBe("reviewed");
    });
  });

  describe("projects CRUD (protected)", () => {
    it("creates, retrieves, and updates project status", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const { id } = await caller.projects.create({
        projectName: "Smith's HVAC Website",
        clientName: "John Smith",
        description: "5-page service website with booking",
        priority: "high",
        quotedPrice: 3500,
      });
      expect(id).toBeGreaterThan(0);

      const project = await caller.projects.getById({ id });
      expect(project.projectName).toBe("Smith's HVAC Website");
      expect(project.status).toBe("planning");
      expect(project.priority).toBe("high");

      await caller.projects.update({ id, status: "design" });
      const updated = await caller.projects.getById({ id });
      expect(updated.status).toBe("design");
    });
  });

  describe("scraper.jobs (protected)", () => {
    it("returns scrape job history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const jobs = await caller.scraper.jobs();
      expect(Array.isArray(jobs)).toBe(true);
    });
  });
});
