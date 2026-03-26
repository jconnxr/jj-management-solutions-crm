import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { makeRequest, PlacesSearchResult, PlaceDetailsResult, GeocodingResult } from "./_core/map";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
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
        industry: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getLeads(input);
      }),

    industries: protectedProcedure.query(async () => {
      return db.getDistinctIndustries();
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
  // Generated Websites
  // =========================================================================
  websites: router({
    listByLead: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        return db.getGeneratedWebsitesByLead(input.leadId);
      }),

    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const site = await db.getGeneratedWebsiteByToken(input.token);
        if (!site) throw new Error("Website not found");
        return site;
      }),

    generate: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        businessName: z.string().min(1),
        serviceType: z.string().optional(),
        services: z.string().optional(),
        location: z.string().optional(),
        phone: z.string().optional(),
        aboutInfo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const previewToken = nanoid(16);

        // Create a placeholder record
        const websiteId = await db.createGeneratedWebsite({
          leadId: input.leadId,
          businessName: input.businessName,
          serviceType: input.serviceType ?? null,
          services: input.services ?? null,
          location: input.location ?? null,
          phone: input.phone ?? null,
          aboutInfo: input.aboutInfo ?? null,
          htmlUrl: "", // will be updated after generation
          previewToken,
          status: "generating",
        });

        try {
          // Build the LLM prompt
          const servicesList = input.services
            ? input.services.split(",").map(s => s.trim()).filter(Boolean)
            : [input.serviceType ?? "General Services"];

          const prompt = `You are a website generator for small local service businesses. Generate a COMPLETE, SINGLE-FILE HTML website.

Business Information:
- Business Name: ${input.businessName}
- Service Type: ${input.serviceType ?? "Service Business"}
- Location: ${input.location ?? "Local Area"}
- Phone: ${input.phone ?? "(555) 000-0000"}
- Services: ${servicesList.join(", ")}
- About: ${input.aboutInfo ?? "A trusted local business serving the community."}

Requirements:
1. Generate a COMPLETE single HTML file with embedded CSS and minimal inline JS
2. Use a clean, professional design with a blue/navy color scheme
3. Mobile responsive (use media queries)
4. Include these sections:
   - Navigation bar with business name and phone number CTA
   - Hero section with a strong headline, subtext about the business, and a prominent "Call Now" button
   - Services section showing each service in a card/grid layout
   - "Why Choose Us" section with 3-4 trust signals (Licensed & Insured, Local, Experienced, etc.)
   - Call-to-action section with phone number
   - Footer with business name, location, and phone
5. Every CTA button should link to tel:${input.phone ?? "5550000000"}
6. Use Google Fonts (Inter or similar) via CDN link
7. Use placeholder image URLs from picsum.photos for any hero/background images
8. Make it look like a real, professional business website — not a template
9. The design should prioritize CLARITY and CONVERSION — make it easy to understand what the business does and easy to call them
10. Do NOT include any JavaScript frameworks, just vanilla HTML/CSS with minimal JS for mobile menu toggle

Return ONLY the complete HTML code, starting with <!DOCTYPE html> and ending with </html>. No markdown, no explanation, no code fences.`;

          const result = await invokeLLM({
            messages: [
              { role: "system", content: "You are a professional website generator. You output ONLY valid HTML code. No markdown, no explanations, no code fences. Just pure HTML starting with <!DOCTYPE html>." },
              { role: "user", content: prompt },
            ],
          });

          let html = typeof result.choices[0]?.message?.content === "string"
            ? result.choices[0].message.content
            : "";

          // Clean up any markdown code fences the LLM might have added
          html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

          // Ensure it starts with DOCTYPE
          if (!html.toLowerCase().startsWith("<!doctype")) {
            const doctypeIdx = html.toLowerCase().indexOf("<!doctype");
            if (doctypeIdx > 0) {
              html = html.substring(doctypeIdx);
            }
          }

          // Upload to S3
          const fileKey = `websites/${previewToken}-${Date.now()}.html`;
          const { url: htmlUrl } = await storagePut(fileKey, html, "text/html");

          // Update the record
          await db.updateGeneratedWebsite(websiteId, {
            htmlUrl,
            status: "ready",
          });

          return { id: websiteId, previewToken, htmlUrl, status: "ready" };
        } catch (error: any) {
          console.error("[WebsiteGen] Failed:", error);
          // Clean up the failed record
          await db.updateGeneratedWebsite(websiteId, {
            status: "rejected",
            htmlUrl: "",
          });
          throw new Error(`Website generation failed: ${error.message}`);
        }
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["generating", "ready", "sent", "approved", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateGeneratedWebsite(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // =========================================================================
  // Google Maps Scraper — OKC Metro focused, no-website-only
  // =========================================================================
  scraper: router({
    jobs: protectedProcedure.query(async () => {
      return db.getScrapeJobs();
    }),

    search: protectedProcedure
      .input(z.object({
        industry: z.string().min(1),
        cities: z.array(z.string().min(1)).min(1),
        state: z.string().default("OK"),
      }))
      .mutation(async ({ input }) => {
        const allNewLeads: any[] = [];
        let totalFound = 0;
        let totalSkippedHasWebsite = 0;
        let totalSkippedDuplicate = 0;
        const cityResults: { city: string; found: number; noWebsite: number; duplicates: number; created: number }[] = [];

        // Create a single scrape job for the batch
        const jobId = await db.createScrapeJob({
          query: input.industry,
          location: input.cities.join(", "),
          radius: 0,
          status: "running",
        });

        try {
          for (const city of input.cities) {
            const fullLocation = `${city}, ${input.state}`;
            // Search with city baked into the query for accurate results
            const searchQuery = `${input.industry} in ${fullLocation}`;

            console.log(`[Scraper] Searching: "${searchQuery}"`);

            const searchResult = await makeRequest<PlacesSearchResult>(
              "/maps/api/place/textsearch/json",
              { query: searchQuery }
            );

            if (searchResult.status !== "OK" || !searchResult.results?.length) {
              console.log(`[Scraper] No results for "${searchQuery}"`);
              cityResults.push({ city, found: 0, noWebsite: 0, duplicates: 0, created: 0 });
              continue;
            }

            const found = searchResult.results.length;
            totalFound += found;

            // Collect all place IDs from this batch to check for duplicates
            const placeIds = searchResult.results.map(p => p.place_id).filter(Boolean);
            const existingIds = await db.getExistingPlaceIds(placeIds);

            let cityNoWebsite = 0;
            let cityDuplicates = 0;
            const cityLeads: any[] = [];

            for (const place of searchResult.results) {
              try {
                // Skip duplicates
                if (place.place_id && existingIds.has(place.place_id)) {
                  cityDuplicates++;
                  totalSkippedDuplicate++;
                  continue;
                }

                const details = await makeRequest<PlaceDetailsResult>(
                  "/maps/api/place/details/json",
                  {
                    place_id: place.place_id,
                    fields: "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,geometry",
                  }
                );

                if (details.status !== "OK" || !details.result) continue;
                const r = details.result;

                // Verify the result is actually in Oklahoma
                const addr = (r.formatted_address ?? "").toUpperCase();
                if (!addr.includes(input.state.toUpperCase())) {
                  continue; // Wrong state entirely
                }

                // ONLY capture businesses WITHOUT a website
                if (r.website) {
                  totalSkippedHasWebsite++;
                  continue;
                }

                cityNoWebsite++;

                // Parse address components
                const addressParts = (r.formatted_address ?? "").split(",").map(s => s.trim());
                const parsedCity = addressParts[1] ?? city;
                const stateZip = addressParts[2] ?? "";
                const stateParts = stateZip.trim().split(" ");
                const parsedState = stateParts[0] ?? input.state;
                const zipCode = stateParts[1] ?? "";

                cityLeads.push({
                  businessName: r.name,
                  address: r.formatted_address,
                  city: parsedCity,
                  state: parsedState,
                  zipCode,
                  phone: r.formatted_phone_number ?? null,
                  website: null,
                  googlePlaceId: place.place_id,
                  googleRating: r.rating ?? null,
                  googleReviewCount: r.user_ratings_total ?? null,
                  latitude: r.geometry?.location?.lat ?? null,
                  longitude: r.geometry?.location?.lng ?? null,
                  hasNoWebsite: true,
                  hasLowReviews: false,
                  hasPoorBooking: false,
                  hasWeakCta: false,
                  source: "google_maps" as const,
                  industry: input.industry,
                });
              } catch (detailErr) {
                console.warn(`[Scraper] Failed details for ${place.place_id}:`, detailErr);
              }
            }

            // Bulk insert this city's leads
            let created = 0;
            if (cityLeads.length > 0) {
              created = await db.bulkCreateLeads(cityLeads);
              allNewLeads.push(...cityLeads);
            }

            cityResults.push({ city, found, noWebsite: cityNoWebsite, duplicates: cityDuplicates, created });
            console.log(`[Scraper] ${city}: ${found} found, ${cityNoWebsite} no website, ${cityDuplicates} duplicates, ${created} created`);
          }

          const leadsCreated = allNewLeads.length;

          await db.updateScrapeJob(jobId, {
            status: "completed",
            totalFound,
            leadsCreated,
            completedAt: new Date(),
          });

          return {
            jobId,
            totalFound,
            leadsCreated,
            totalSkippedHasWebsite,
            totalSkippedDuplicate,
            cityResults,
          };
        } catch (error: any) {
          console.error(`[Scraper] Job failed:`, error);
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
