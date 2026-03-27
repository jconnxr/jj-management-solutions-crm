import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module so tests don't actually call the notification service
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): { ctx: TrpcContext } {
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

describe("contact.submit (public)", () => {
  it("accepts a valid contact form submission without authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Mike Johnson",
      businessName: "Mike's Plumbing",
      phone: "(405) 555-1234",
      email: "mike@example.com",
      message: "I need a website for my plumbing business",
      preferredContact: "phone",
    });

    expect(result).toEqual({ success: true });
  });

  it("accepts a minimal submission with only name and message", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Doe",
      message: "I'm interested in getting a website built",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects submission with empty name", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with empty message", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        message: "",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with invalid email format", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "not-an-email",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("accepts all preferred contact methods", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    for (const method of ["phone", "email", "text"] as const) {
      const result = await caller.contact.submit({
        name: "Test User",
        message: "Testing preferred contact",
        preferredContact: method,
      });
      expect(result).toEqual({ success: true });
    }
  });

  it("calls notifyOwner with formatted content", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.contact.submit({
      name: "Bob Builder",
      businessName: "Bob's Construction",
      phone: "(405) 555-9999",
      message: "Need a website ASAP",
      preferredContact: "text",
    });

    expect(notifyOwner).toHaveBeenCalled();
    const lastCall = vi.mocked(notifyOwner).mock.calls.at(-1);
    expect(lastCall).toBeDefined();
    if (lastCall) {
      expect(lastCall[0].title).toContain("Bob Builder");
      expect(lastCall[0].title).toContain("Bob's Construction");
      expect(lastCall[0].content).toContain("(405) 555-9999");
      expect(lastCall[0].content).toContain("Need a website ASAP");
    }
  });
});
