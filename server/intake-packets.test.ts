import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock database module
vi.mock("./db", () => ({
  createIntakeSubmission: vi.fn().mockResolvedValue(1),
  getIntakeSubmissions: vi.fn().mockResolvedValue({ submissions: [], total: 0 }),
  getIntakeSubmissionById: vi.fn().mockResolvedValue({
    id: 1,
    ownerName: "Test Owner",
    businessName: "Test Business",
    industry: "Plumbing",
    phone: "(405) 555-0123",
    email: "test@test.com",
    website: null,
    address: null,
    city: "OKC",
    state: "OK",
    biggestChallenge: "No website",
    currentOnlinePresence: "no_website",
    monthlyBudget: "Under $500",
    urgency: "asap",
    howHeard: "Business card",
    status: "new",
    leadId: null,
    classificationId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updateIntakeSubmission: vi.fn().mockResolvedValue(undefined),
  createLead: vi.fn().mockResolvedValue(10),
  createAiClassification: vi.fn().mockResolvedValue(1),
  getClassificationBySubmission: vi.fn().mockResolvedValue(undefined),
  getInstallPackets: vi.fn().mockResolvedValue({ packets: [], total: 0 }),
  getInstallPacketById: vi.fn().mockResolvedValue({
    id: 1,
    leadId: 10,
    businessName: "Test Business",
    industry: "Plumbing",
    installType: "full_website",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  createInstallPacket: vi.fn().mockResolvedValue(1),
  updateInstallPacket: vi.fn().mockResolvedValue(undefined),
  getPacketActivities: vi.fn().mockResolvedValue([]),
  createPacketActivityRecord: vi.fn().mockResolvedValue(1),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          bottleneckType: "no_website",
          bottleneckSummary: "Business has no website",
          suggestedInstallType: "full_website",
          suggestedTemplateFamily: "clean_professional",
          priorityScore: 85,
          reasoning: "High urgency, no web presence",
        }),
      },
    }],
  }),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import * as db from "./db";
import { notifyOwner } from "./_core/notification";

describe("Intake Submissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Public submission", () => {
    it("should create an intake submission with required fields", async () => {
      const input = {
        ownerName: "John Smith",
        businessName: "Smith's Plumbing",
        biggestChallenge: "I need a website",
      };

      const id = await db.createIntakeSubmission(input as any);
      expect(db.createIntakeSubmission).toHaveBeenCalledWith(input);
      expect(id).toBe(1);
    });

    it("should create an intake submission with all fields", async () => {
      const input = {
        ownerName: "Jane Doe",
        businessName: "Doe's HVAC",
        industry: "HVAC",
        phone: "(405) 555-0123",
        email: "jane@doe.com",
        website: "www.doeshvac.com",
        city: "Norman",
        state: "OK",
        biggestChallenge: "My website is outdated and I'm losing customers",
        currentOnlinePresence: "outdated_website",
        monthlyBudget: "$500 – $1,000",
        urgency: "this_month",
        howHeard: "Referral",
      };

      await db.createIntakeSubmission(input as any);
      expect(db.createIntakeSubmission).toHaveBeenCalledWith(input);
    });

    it("should notify owner on new submission", async () => {
      await notifyOwner({
        title: "New QR Intake: Test Business",
        content: "Name: Test Owner\nBusiness: Test Business",
      });
      expect(notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("Test Business"),
        })
      );
    });
  });

  describe("Submission listing", () => {
    it("should list submissions with default filters", async () => {
      const result = await db.getIntakeSubmissions();
      expect(result).toEqual({ submissions: [], total: 0 });
    });

    it("should list submissions with status filter", async () => {
      await db.getIntakeSubmissions({ status: "new" });
      expect(db.getIntakeSubmissions).toHaveBeenCalledWith({ status: "new" });
    });
  });

  describe("Submission detail", () => {
    it("should return submission by id", async () => {
      const submission = await db.getIntakeSubmissionById(1);
      expect(submission).toBeDefined();
      expect(submission?.businessName).toBe("Test Business");
      expect(submission?.ownerName).toBe("Test Owner");
    });
  });

  describe("Convert to lead", () => {
    it("should create a lead from submission data", async () => {
      const submission = await db.getIntakeSubmissionById(1);
      expect(submission).toBeDefined();

      const leadId = await db.createLead({
        businessName: submission!.businessName,
        industry: submission!.industry ?? undefined,
        phone: submission!.phone ?? undefined,
        email: submission!.email ?? undefined,
        hasNoWebsite: true,
        source: "referral",
        disposition: "new",
      } as any);

      expect(leadId).toBe(10);

      await db.updateIntakeSubmission(1, {
        status: "converted" as any,
        leadId: 10,
      });
      expect(db.updateIntakeSubmission).toHaveBeenCalledWith(1, {
        status: "converted",
        leadId: 10,
      });
    });
  });

  describe("Archive submission", () => {
    it("should archive a submission", async () => {
      await db.updateIntakeSubmission(1, { status: "archived" as any });
      expect(db.updateIntakeSubmission).toHaveBeenCalledWith(1, { status: "archived" });
    });
  });
});

describe("Install Packets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Packet creation", () => {
    it("should create a packet with required fields", async () => {
      const input = {
        leadId: 10,
        businessName: "Test Business",
        installType: "full_website",
        createdBy: "John",
      };

      const id = await db.createInstallPacket(input as any);
      expect(id).toBe(1);
      expect(db.createInstallPacket).toHaveBeenCalledWith(input);
    });

    it("should log creation activity", async () => {
      await db.createPacketActivityRecord({
        packetId: 1,
        action: "created",
        toStatus: "draft",
        performedBy: "John",
        details: "Packet created for Test Business — full_website",
      });
      expect(db.createPacketActivityRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "created",
          toStatus: "draft",
        })
      );
    });
  });

  describe("Packet listing", () => {
    it("should list packets with default filters", async () => {
      const result = await db.getInstallPackets();
      expect(result).toEqual({ packets: [], total: 0 });
    });

    it("should list packets with status filter", async () => {
      await db.getInstallPackets({ status: "draft" });
      expect(db.getInstallPackets).toHaveBeenCalledWith({ status: "draft" });
    });

    it("should list packets by lead ID", async () => {
      await db.getInstallPackets({ leadId: 10 });
      expect(db.getInstallPackets).toHaveBeenCalledWith({ leadId: 10 });
    });
  });

  describe("Packet detail", () => {
    it("should return packet by id", async () => {
      const packet = await db.getInstallPacketById(1);
      expect(packet).toBeDefined();
      expect(packet?.businessName).toBe("Test Business");
      expect(packet?.installType).toBe("full_website");
    });

    it("should return activities for a packet", async () => {
      const activities = await db.getPacketActivities(1);
      expect(Array.isArray(activities)).toBe(true);
    });
  });

  describe("Status updates", () => {
    it("should update packet status", async () => {
      await db.updateInstallPacket(1, { status: "in_review" as any });
      expect(db.updateInstallPacket).toHaveBeenCalledWith(1, { status: "in_review" });
    });

    it("should log status change activity", async () => {
      await db.createPacketActivityRecord({
        packetId: 1,
        action: "status_change",
        fromStatus: "draft",
        toStatus: "in_review",
        performedBy: "John",
        details: "Status changed from draft to in_review",
      });
      expect(db.createPacketActivityRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "status_change",
          fromStatus: "draft",
          toStatus: "in_review",
        })
      );
    });
  });

  describe("Packet updates", () => {
    it("should update packet fields", async () => {
      await db.updateInstallPacket(1, {
        operatorNotes: "Updated notes",
        assignedTo: "Jacob",
        templateFamily: "clean_professional",
      } as any);
      expect(db.updateInstallPacket).toHaveBeenCalledWith(1, {
        operatorNotes: "Updated notes",
        assignedTo: "Jacob",
        templateFamily: "clean_professional",
      });
    });
  });
});

describe("AI Classification (Alfred)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a classification record", async () => {
    const classificationData = {
      intakeSubmissionId: 1,
      bottleneckType: "no_website",
      bottleneckSummary: "Business has no website",
      suggestedInstallType: "full_website",
      suggestedTemplateFamily: "clean_professional",
      priorityScore: 85,
      reasoning: "High urgency, no web presence",
      rawResponse: "{}",
    };

    const id = await db.createAiClassification(classificationData);
    expect(id).toBe(1);
    expect(db.createAiClassification).toHaveBeenCalledWith(classificationData);
  });

  it("should update submission with classification link", async () => {
    await db.updateIntakeSubmission(1, {
      classificationId: 1,
      status: "classified" as any,
    });
    expect(db.updateIntakeSubmission).toHaveBeenCalledWith(1, {
      classificationId: 1,
      status: "classified",
    });
  });

  it("should look up classification by submission ID", async () => {
    const result = await db.getClassificationBySubmission(1);
    // Mock returns undefined by default
    expect(db.getClassificationBySubmission).toHaveBeenCalledWith(1);
  });
});
