# Project TODO

## Core Features (MVP)
- [x] Google Maps lead scraper (fixed location filtering)
- [x] Leads list page with search and filtering
- [x] Lead detail page with call notes
- [x] Website generation button (one-click)
- [x] Website preview with shareable link
- [x] Copy link to clipboard functionality
- [x] Database table for generated websites (linked to leads)
- [x] LLM-powered website generation from lead data
- [x] Generate Website button on LeadDetail page
- [x] Public shareable route for generated website previews
- [x] Copy link to clipboard for sharing on phone calls

## Completed (Previous)
- [x] Initial CRM scaffold with database
- [x] Dashboard with stats
- [x] Google Maps scraper (needs refinement)
- [x] Lead management
- [x] Call history tracking
- [x] Notes system
- [x] Vitest test suite (24 passing)
- [x] Fix: Lead scraper returning results outside target area
- [x] Fix: Scraper returning 0 leads after location fix — post-filtering likely too aggressive

## Needs Refinement
- [ ] Scraper location filtering still needs real-world testing
- [ ] Remove unused pages (Projects, Intake, ProjectDetail) from codebase
- [ ] Dashboard quick actions need cleanup

## Google Sheets Import
- [x] Import leads from user's Google Sheet into CRM database (85 leads → 87 total in DB)
- [x] Map columns: Business Name, City, Industry, Phone, Implementation Type, Internal Notes

## Scraper Rebuild (OKC Metro)
- [x] Pre-built OKC metro city list (26 cities)
- [x] No-website-only filter (remove low reviews/booking pain points)
- [x] Industry presets for blue-collar services (20 presets)
- [x] Duplicate detection by Google Place ID
- [x] Per-city search across metro area with city breakdown

## Google Sheets Import #2
- [x] Import leads from second Google Sheet into CRM database (104 leads added, 245 total in DB)

## Industry Organization
- [x] Add industry/business type filter dropdown to Leads page
- [x] Add industry column to leads table for easy scanning
- [x] Add industry badge/tag styling for visual distinction
- [x] Add clickable industry chip quick-filters at top of leads page
- [x] Add sort-by-industry column header

## Website Generation Template System
- [x] Design 5 distinct visual templates (Bold & Modern, Clean & Trustworthy, Friendly & Approachable, Rugged & Professional, Minimal & Sleek)
- [x] Industry-specific color palettes per template
- [x] Industry-specific imagery from Unsplash (curated per industry)
- [x] Multiple CTA styles (Free Estimate, Call Now, Book Online, Get a Quote, Schedule a Visit, Start Your Project Today)
- [x] Template selection UI with visual preview cards (2-step dialog)
- [x] Auto-suggest best template based on lead industry (via shared config)
- [x] LLM prompt engineering for high-quality, non-cookie-cutter output (5 unique prompt builders)
- [x] Each template has unique layout structure, typography, and section ordering
- [ ] Generated websites include multi-page structure (Home, Services, About, Contact)
- [ ] Test generation across multiple industries to verify quality and variety

## Follow-Up Text Templates
- [x] Create 6 follow-up text templates for different call outcomes
- [x] Add Follow-Up Texts tab to LeadDetail page
- [x] Auto-fill business name and website preview link into templates
- [x] One-click copy to clipboard for pasting into messaging app
- [x] Editable text before copying for personalization
- [x] Reset button to restore original template text

## J&J External Landing Page
- [x] Home page with hero, tagline, and CTA
- [x] About section with John and Jacob headshots and bios
- [x] Services section (websites, online presence, systems)
- [x] Portfolio section with 3 clickable sample websites
- [x] Contact/Book a Meeting form
- [x] Professional Oklahoma-local branding
- [x] QR code optimized for business cards
- [x] 3 high-quality sample portfolio HTML websites

## Bug Fixes
- [x] Fix: Landing page not showing at root URL / — was showing old published version, dev server has correct landing page

## Multi-Page Landing Site Conversion
- [x] Convert single scrollable landing page into multi-page site
- [x] Shared navigation component with active page highlighting
- [x] Shared footer component
- [x] Home page (hero + brief intro + CTAs)
- [x] About page (John & Jacob bios, headshots, values)
- [x] Services page (full service grid + pricing)
- [x] Portfolio page (3 sample websites)
- [x] Contact page (form + contact info + how it works)
- [x] Update App.tsx routing for all new pages
