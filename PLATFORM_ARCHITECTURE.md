# J&J Management Solutions — Platform Architecture

## Core Workflow

```
Prospect → Data Collection → Website Generation → Client Preview → Conversion Tracking
```

## 1. Prospecting Phase

**Goal:** Find local service businesses without websites

**Input:** Industry + Location (e.g., "plumber" + "Oklahoma City")

**Output:** Lead list with basic info

**Current Status:** Google Maps scraper (needs refinement for accuracy)

---

## 2. Data Collection Phase

**Goal:** Gather minimal, factual information needed to generate a website

**Required Data:**
- Company name
- Location (city, state)
- Service type (plumbing, HVAC, electrical, etc.)
- Services offered (list of 3-5 main services)
- About info (if available — years in business, ownership, etc.)

**Optional Data:**
- Phone number
- Email
- Existing website URL
- Google Place ID

**Current Status:** Manual entry in CRM (can be pre-filled from scraper)

---

## 3. Website Generation Phase

**Goal:** Generate a clean, conversion-focused website in <5 minutes

**Template Structure (based on Don's Plumbing reference):**
- Hero section with main CTA (Call Now + Book Service)
- Services overview
- Why Choose Us (trust signals)
- Testimonials/Reviews section
- Emergency/Availability messaging
- Service area map
- Contact section

**Tech Stack:**
- Next.js
- Tailwind CSS
- Framer Motion (subtle animations)
- Vercel deployment

**Input:** The 5 data points from Data Collection phase

**Output:** Live preview URL (Vercel deployment)

**Current Status:** Manual generation with GPT/Cursor (goal: automate with LLM)

---

## 4. Client Preview Phase

**Goal:** Share website with client on phone call (no Zoom needed)

**Process:**
1. Generate website
2. Get live Vercel URL
3. Share link on phone call
4. Walk through website together
5. Collect feedback
6. Make adjustments if needed
7. Send final link for client approval

**Current Status:** Manual phone call + link sharing

---

## 5. Conversion Tracking Phase

**Goal:** Track which websites lead to actual client conversions

**Metrics to Track:**
- Website generated (date, URL)
- Sent to client (date)
- Client feedback (approved, needs changes, rejected)
- Conversion status (won, lost, pending)
- Follow-up notes

**Current Status:** Not yet implemented (need real data first)

---

## CRM Structure

### Lead Record
- Company name
- Location (city, state)
- Service type
- Phone
- Email
- Website (if exists)
- Google Place ID
- Source (Google Maps, manual, etc.)
- Status (prospect, data collected, website generated, sent to client, won, lost)
- Created date
- Last updated

### Website Record
- Lead ID (foreign key)
- Company name
- Location
- Service type
- Services (list)
- About info
- Generated URL (Vercel link)
- Status (draft, preview, approved, live)
- Generated date
- Sent to client date
- Client feedback
- Conversion status (won, lost, pending)

### Call/Note Record
- Lead ID
- Author
- Date
- Content
- Outcome (if call)

---

## Key Principles

1. **Speed first** — Generate websites in minutes, not hours
2. **Simplicity** — Only collect data that's needed
3. **Conversion-focused** — Every page element serves a purpose (calls, bookings, trust)
4. **Repeatable** — Same template, different data
5. **Low friction** — Phone call + link, no Zoom/screen share needed

---

## Next Steps

1. Fix Google Maps scraper to return accurate local results
2. Build website generator that takes 5 data points → live Vercel site
3. Simplify CRM to track leads through the pipeline
4. Add conversion tracking once we have real data
5. Iterate based on actual usage
