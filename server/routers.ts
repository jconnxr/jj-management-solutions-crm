import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { makeRequest, PlacesSearchResult, PlaceDetailsResult, GeocodingResult } from "./_core/map";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // =========================================================================
  // Dashboard
  // =========================================================================
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return db.getDashboardStats();
    }),
  }),

  // =========================================================================
  // Leads
  // =========================================================================
  leads: router({
    list: protectedProcedure
      .input(z.object({
        disposition: z.string().optional(),
        source: z.string().optional(),
        search: z.string().optional(),
        painPoint: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getLeads(input);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lead = await db.getLeadById(input.id);
        if (!lead) throw new Error("Lead not found");
        return lead;
      }),

    create: protectedProcedure
      .input(z.object({
        businessName: z.string().min(1),
        industry: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        googlePlaceId: z.string().optional(),
        googleRating: z.number().optional(),
        googleReviewCount: z.number().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        hasNoWebsite: z.boolean().optional(),
        hasLowReviews: z.boolean().optional(),
        hasPoorBooking: z.boolean().optional(),
        hasWeakCta: z.boolean().optional(),
        disposition: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]).optional(),
        assignedTo: z.string().optional(),
        source: z.enum(["google_maps", "facebook", "referral", "manual", "cold_call"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createLead(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        businessName: z.string().optional(),
        industry: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        hasNoWebsite: z.boolean().optional(),
        hasLowReviews: z.boolean().optional(),
        hasPoorBooking: z.boolean().optional(),
        hasWeakCta: z.boolean().optional(),
        disposition: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]).optional(),
        assignedTo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateLead(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteLead(input.id);
        return { success: true };
      }),
  }),

  // =========================================================================
  // Call History
  // =========================================================================
  calls: router({
    list: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        return db.getCallHistory(input.leadId);
      }),

    create: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        calledBy: z.string().min(1),
        outcome: z.enum(["no_answer", "voicemail", "callback_scheduled", "interested", "not_interested", "wrong_number", "follow_up"]),
        duration: z.number().optional(),
        summary: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createCallRecord(input);
        return { id };
      }),
  }),

  // =========================================================================
  // Notes
  // =========================================================================
  notes: router({
    list: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        return db.getNotes(input.leadId);
      }),

    create: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        authorName: z.string().min(1),
        content: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createNote(input);
        return { id };
      }),
  }),

  // =========================================================================
  // Client Intake
  // =========================================================================
  intake: router({
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getIntakes(input);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const intake = await db.getIntakeById(input.id);
        if (!intake) throw new Error("Intake not found");
        return intake;
      }),

    create: protectedProcedure
      .input(z.object({
        leadId: z.number().optional(),
        contactName: z.string().min(1),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        businessName: z.string().min(1),
        businessType: z.string().optional(),
        currentWebsite: z.string().optional(),
        desiredFeatures: z.string().optional(),
        targetAudience: z.string().optional(),
        competitors: z.string().optional(),
        budget: z.string().optional(),
        timeline: z.string().optional(),
        additionalNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createIntake(input);
        return { id };
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "approved", "archived"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateIntake(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // =========================================================================
  // Projects
  // =========================================================================
  projects: router({
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getProjects(input);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) throw new Error("Project not found");
        return project;
      }),

    create: protectedProcedure
      .input(z.object({
        leadId: z.number().optional(),
        intakeId: z.number().optional(),
        projectName: z.string().min(1),
        clientName: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["planning", "design", "development", "review", "revision", "completed", "on_hold"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        startDate: z.date().optional(),
        dueDate: z.date().optional(),
        quotedPrice: z.number().optional(),
        previewUrl: z.string().optional(),
        liveUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createProject(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        projectName: z.string().optional(),
        clientName: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["planning", "design", "development", "review", "revision", "completed", "on_hold"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        startDate: z.date().optional(),
        dueDate: z.date().optional(),
        completedDate: z.date().optional(),
        quotedPrice: z.number().optional(),
        previewUrl: z.string().optional(),
        liveUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),
  }),

  // =========================================================================
  // Google Maps Scraper
  // =========================================================================
  scraper: router({
    jobs: protectedProcedure.query(async () => {
      return db.getScrapeJobs();
    }),

    search: protectedProcedure
      .input(z.object({
        query: z.string().min(1),
        location: z.string().min(1),
        radius: z.number().min(1000).max(50000).optional(),
      }))
      .mutation(async ({ input }) => {
        // Create scrape job record
        const jobId = await db.createScrapeJob({
          query: input.query,
          location: input.location,
          radius: input.radius ?? 5000,
          status: "running",
        });

        try {
          // Step 1: Geocode the location to get lat/lng coordinates
          // The Text Search API's location param needs lat,lng — plain text like
          // "Oklahoma City" gets ignored and returns results from anywhere.
          let locationCoords: string | undefined;
          let targetCity = "";
          let targetState = "";

          // Check if location is already lat,lng format
          const latLngMatch = input.location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
          if (latLngMatch) {
            locationCoords = input.location;
          } else {
            // Geocode the text address to coordinates
            const geocodeResult = await makeRequest<GeocodingResult>(
              "/maps/api/geocode/json",
              { address: input.location }
            );
            if (geocodeResult.status === "OK" && geocodeResult.results?.length > 0) {
              const geo = geocodeResult.results[0];
              locationCoords = `${geo.geometry.location.lat},${geo.geometry.location.lng}`;
              // Extract city and state from geocode for post-filtering
              for (const comp of geo.address_components) {
                if (comp.types.includes("locality")) {
                  targetCity = comp.long_name.toLowerCase();
                }
                if (comp.types.includes("administrative_area_level_1")) {
                  targetState = comp.short_name.toUpperCase();
                }
              }
            }
          }

          // Step 2: Text search — include location name in query for better scoping
          // e.g. "plumber in Oklahoma City" instead of just "plumber"
          const scopedQuery = locationCoords
            ? `${input.query} in ${input.location}`
            : input.query;

          const searchParams: Record<string, unknown> = {
            query: scopedQuery,
          };
          if (locationCoords) {
            searchParams.location = locationCoords;
            searchParams.radius = input.radius ?? 10000;
          }

          const searchResult = await makeRequest<PlacesSearchResult>(
            "/maps/api/place/textsearch/json",
            searchParams
          );

          if (searchResult.status !== "OK" || !searchResult.results?.length) {
            await db.updateScrapeJob(jobId, {
              status: "completed",
              totalFound: 0,
              leadsCreated: 0,
              completedAt: new Date(),
            });
            return { jobId, totalFound: 0, leadsCreated: 0, leads: [] };
          }

          const totalFound = searchResult.results.length;
          const newLeads: any[] = [];

          // Helper: calculate distance between two lat/lng points in meters
          const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
            const R = 6371000; // Earth radius in meters
            const toRad = (d: number) => (d * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          };

          // Parse center coordinates for distance filtering
          let centerLat: number | null = null;
          let centerLng: number | null = null;
          if (locationCoords) {
            const [lat, lng] = locationCoords.split(",").map(Number);
            centerLat = lat;
            centerLng = lng;
          }
          const maxDistance = (input.radius ?? 10000) * 3; // generous 3x radius for filtering

          // Step 3: Get details for each place to check for website
          for (const place of searchResult.results) {
            try {
              // Post-filter: skip results that are geographically too far
              if (centerLat !== null && centerLng !== null && place.geometry?.location) {
                const dist = haversineDistance(
                  centerLat, centerLng,
                  place.geometry.location.lat, place.geometry.location.lng
                );
                if (dist > maxDistance) {
                  continue; // Skip — outside target area
                }
              }

              const details = await makeRequest<PlaceDetailsResult>(
                "/maps/api/place/details/json",
                {
                  place_id: place.place_id,
                  fields: "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,geometry",
                }
              );

              if (details.status === "OK" && details.result) {
                const r = details.result;

                // Post-filter: verify the address contains the target city/state
                const addr = (r.formatted_address ?? "").toLowerCase();
                if (targetCity && !addr.includes(targetCity) && targetState && !addr.toLowerCase().includes(targetState.toLowerCase())) {
                  continue; // Skip — address doesn't match target area
                }

                const hasNoWebsite = !r.website;
                const hasLowReviews = (r.user_ratings_total ?? 0) < 10 || (r.rating ?? 0) < 3.5;

                // Only add leads that match pain points (primarily no website)
                if (hasNoWebsite || hasLowReviews) {
                  // Parse address components
                  const addressParts = (r.formatted_address ?? "").split(",").map(s => s.trim());
                  const city = addressParts[1] ?? "";
                  const stateZip = addressParts[2] ?? "";
                  const stateParts = stateZip.split(" ");
                  const state = stateParts[0] ?? "";
                  const zipCode = stateParts[1] ?? "";

                  newLeads.push({
                    businessName: r.name,
                    address: r.formatted_address,
                    city,
                    state,
                    zipCode,
                    phone: r.formatted_phone_number ?? null,
                    website: r.website ?? null,
                    googlePlaceId: place.place_id,
                    googleRating: r.rating ?? null,
                    googleReviewCount: r.user_ratings_total ?? null,
                    latitude: r.geometry?.location?.lat ?? null,
                    longitude: r.geometry?.location?.lng ?? null,
                    hasNoWebsite,
                    hasLowReviews,
                    hasPoorBooking: false,
                    hasWeakCta: false,
                    source: "google_maps" as const,
                    industry: input.query,
                  });
                }
              }
            } catch (detailErr) {
              console.warn(`Failed to get details for ${place.place_id}:`, detailErr);
            }
          }

          // Step 4: Bulk insert leads
          let leadsCreated = 0;
          if (newLeads.length > 0) {
            leadsCreated = await db.bulkCreateLeads(newLeads);
          }

          await db.updateScrapeJob(jobId, {
            status: "completed",
            totalFound,
            leadsCreated,
            completedAt: new Date(),
          });

          return { jobId, totalFound, leadsCreated, leads: newLeads };
        } catch (error: any) {
          await db.updateScrapeJob(jobId, {
            status: "failed",
            errorMessage: error.message,
            completedAt: new Date(),
          });
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
