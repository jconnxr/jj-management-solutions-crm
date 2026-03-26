/**
 * Website Generation Template System
 * 5 distinct visual templates with industry-specific configurations
 */

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  previewColors: { primary: string; secondary: string; accent: string; bg: string; text: string };
  layoutStyle: string;
  typographyStyle: string;
  sectionOrder: string[];
  ctaStyles: string[];
  bestFor: string[];
}

export interface IndustryConfig {
  industry: string;
  keywords: string[];
  suggestedTemplate: string;
  colorOverride?: { primary: string; secondary: string; accent: string };
  imageSearchTerms: string[];
  serviceExamples: string[];
  ctaPreference: string;
  tonality: string;
}

// ============================================================================
// 5 Distinct Templates
// ============================================================================

export const TEMPLATES: WebsiteTemplate[] = [
  {
    id: "bold-modern",
    name: "Bold & Modern",
    description: "Dark hero sections, bold typography, geometric accents. Premium feel for businesses that want to stand out.",
    previewColors: { primary: "#0ea5e9", secondary: "#1e293b", accent: "#f59e0b", bg: "#0f172a", text: "#f8fafc" },
    layoutStyle: "dark-hero-split",
    typographyStyle: "bold-sans",
    sectionOrder: ["hero-split", "trust-bar", "services-grid", "why-us-stats", "testimonials", "cta-banner", "contact-form", "footer"],
    ctaStyles: ["Get Your Free Estimate", "Start Your Project Today", "See What We Can Do"],
    bestFor: ["HVAC", "Epoxy Flooring", "Roofing", "Renovations", "Electrical"],
  },
  {
    id: "clean-trustworthy",
    name: "Clean & Trustworthy",
    description: "Light backgrounds, generous white space, soft shadows. Builds instant credibility and trust.",
    previewColors: { primary: "#2563eb", secondary: "#f1f5f9", accent: "#10b981", bg: "#ffffff", text: "#1e293b" },
    layoutStyle: "light-centered",
    typographyStyle: "clean-serif-mix",
    sectionOrder: ["hero-centered", "services-cards", "about-story", "process-steps", "reviews", "service-area-map", "contact-split", "footer"],
    ctaStyles: ["Call Now for Service", "Book Your Appointment", "Get a Free Consultation"],
    bestFor: ["Plumber", "Plumbing", "Electrician", "Handyman Service", "Dentistry", "Chiropractic"],
  },
  {
    id: "friendly-approachable",
    name: "Friendly & Approachable",
    description: "Warm colors, rounded corners, casual and inviting tone. Makes customers feel welcome.",
    previewColors: { primary: "#8b5cf6", secondary: "#fef3c7", accent: "#f97316", bg: "#fffbeb", text: "#44403c" },
    layoutStyle: "warm-rounded",
    typographyStyle: "friendly-rounded",
    sectionOrder: ["hero-image-overlay", "intro-blurb", "services-icons", "about-team", "gallery", "faq", "contact-friendly", "footer"],
    ctaStyles: ["Schedule a Visit", "Let's Get Started", "Reach Out Today"],
    bestFor: ["Dog poop pickup", "Dog Trainer", "Cleaning Services", "Lawn Care", "Pet Grooming", "Bounce House", "Food Delivery Service"],
  },
  {
    id: "rugged-professional",
    name: "Rugged & Professional",
    description: "Textured backgrounds, strong contrast, industrial feel. Commands respect and authority.",
    previewColors: { primary: "#dc2626", secondary: "#292524", accent: "#eab308", bg: "#1c1917", text: "#fafaf9" },
    layoutStyle: "industrial-bold",
    typographyStyle: "condensed-impact",
    sectionOrder: ["hero-fullwidth", "services-alternating", "equipment-showcase", "stats-counter", "testimonials-dark", "service-area", "cta-urgent", "footer"],
    ctaStyles: ["Request a Quote", "Get the Job Done", "Call for Immediate Service"],
    bestFor: ["Concrete Contractor", "Fencing Contractor", "Junk Removal", "Demolition", "Excavation", "Gutter Cleaning", "Pressure Washing", "Tree Service"],
  },
  {
    id: "minimal-sleek",
    name: "Minimal & Sleek",
    description: "Ultra-clean design, modern typography, subtle animations. Sophisticated and contemporary.",
    previewColors: { primary: "#171717", secondary: "#fafafa", accent: "#6366f1", bg: "#ffffff", text: "#171717" },
    layoutStyle: "minimal-editorial",
    typographyStyle: "modern-thin",
    sectionOrder: ["hero-minimal", "services-list-clean", "about-minimal", "process-timeline", "portfolio", "contact-minimal", "footer"],
    ctaStyles: ["Book Your Appointment", "Get in Touch", "Start a Conversation"],
    bestFor: ["Mobile Auto Detailing", "Food truck", "Photography", "Interior Design", "Salon"],
  },
];

// ============================================================================
// Industry Configurations
// ============================================================================

export const INDUSTRY_CONFIGS: IndustryConfig[] = [
  // --- Plumbing ---
  {
    industry: "Plumber",
    keywords: ["plumber", "plumbing"],
    suggestedTemplate: "clean-trustworthy",
    colorOverride: { primary: "#2563eb", secondary: "#eff6ff", accent: "#0891b2" },
    imageSearchTerms: ["professional plumber working", "plumbing repair service", "modern bathroom plumbing", "water heater installation"],
    serviceExamples: ["Drain Cleaning", "Water Heater Repair", "Pipe Repair & Replacement", "Sewer Line Services", "Leak Detection", "Bathroom Remodeling", "Emergency Plumbing"],
    ctaPreference: "Call Now for Service",
    tonality: "reliable, professional, emergency-ready",
  },
  {
    industry: "Plumbing",
    keywords: ["plumbing"],
    suggestedTemplate: "clean-trustworthy",
    colorOverride: { primary: "#2563eb", secondary: "#eff6ff", accent: "#0891b2" },
    imageSearchTerms: ["professional plumber working", "plumbing repair service", "modern bathroom plumbing"],
    serviceExamples: ["Drain Cleaning", "Water Heater Repair", "Pipe Repair & Replacement", "Sewer Line Services", "Leak Detection", "Emergency Plumbing"],
    ctaPreference: "Call Now for Service",
    tonality: "reliable, professional, emergency-ready",
  },
  // --- HVAC ---
  {
    industry: "HVAC",
    keywords: ["hvac", "heating", "cooling", "air conditioning"],
    suggestedTemplate: "bold-modern",
    colorOverride: { primary: "#0ea5e9", secondary: "#0c4a6e", accent: "#f59e0b" },
    imageSearchTerms: ["HVAC technician working", "air conditioning unit installation", "heating system repair", "modern HVAC equipment"],
    serviceExamples: ["AC Installation & Repair", "Heating System Service", "Duct Cleaning", "Thermostat Installation", "Indoor Air Quality", "Emergency HVAC Service", "Preventive Maintenance"],
    ctaPreference: "Get Your Free Estimate",
    tonality: "expert, energy-efficient, comfort-focused",
  },
  // --- Concrete ---
  {
    industry: "Concrete Contractor",
    keywords: ["concrete", "cement", "masonry"],
    suggestedTemplate: "rugged-professional",
    colorOverride: { primary: "#b91c1c", secondary: "#292524", accent: "#d97706" },
    imageSearchTerms: ["concrete pouring construction", "stamped concrete patio", "concrete driveway installation", "concrete foundation work"],
    serviceExamples: ["Driveways & Sidewalks", "Patios & Pool Decks", "Foundations", "Stamped Concrete", "Concrete Repair", "Retaining Walls", "Commercial Flatwork"],
    ctaPreference: "Request a Quote",
    tonality: "strong, durable, craftsman-quality",
  },
  // --- Fencing ---
  {
    industry: "Fencing Contractor",
    keywords: ["fencing", "fence"],
    suggestedTemplate: "rugged-professional",
    colorOverride: { primary: "#92400e", secondary: "#1c1917", accent: "#16a34a" },
    imageSearchTerms: ["wooden fence installation", "privacy fence backyard", "iron fence residential", "fence contractor working"],
    serviceExamples: ["Wood Fencing", "Chain Link Fencing", "Iron & Steel Fencing", "Vinyl Fencing", "Fence Repair", "Gate Installation", "Commercial Fencing"],
    ctaPreference: "Get the Job Done",
    tonality: "secure, reliable, property-enhancing",
  },
  // --- Junk Removal ---
  {
    industry: "Junk Removal",
    keywords: ["junk removal", "hauling", "debris"],
    suggestedTemplate: "rugged-professional",
    colorOverride: { primary: "#15803d", secondary: "#1c1917", accent: "#eab308" },
    imageSearchTerms: ["junk removal truck", "property cleanout service", "debris removal team", "garage cleanout"],
    serviceExamples: ["Residential Junk Removal", "Commercial Cleanouts", "Construction Debris", "Appliance Removal", "Furniture Disposal", "Garage & Attic Cleanout", "Estate Cleanouts"],
    ctaPreference: "Call for Immediate Service",
    tonality: "fast, eco-friendly, hassle-free",
  },
  // --- Mobile Auto Detailing ---
  {
    industry: "Mobile Auto Detailing",
    keywords: ["auto detailing", "car detailing", "mobile detailing"],
    suggestedTemplate: "minimal-sleek",
    colorOverride: { primary: "#171717", secondary: "#fafafa", accent: "#7c3aed" },
    imageSearchTerms: ["car detailing professional", "auto paint correction", "interior car cleaning", "ceramic coating application"],
    serviceExamples: ["Full Detail Package", "Interior Deep Clean", "Exterior Polish & Wax", "Ceramic Coating", "Paint Correction", "Engine Bay Cleaning", "Headlight Restoration"],
    ctaPreference: "Book Your Appointment",
    tonality: "premium, meticulous, showroom-quality",
  },
  // --- Pressure Washing ---
  {
    industry: "Pressure Washing",
    keywords: ["pressure washing", "power washing"],
    suggestedTemplate: "rugged-professional",
    colorOverride: { primary: "#1d4ed8", secondary: "#1e293b", accent: "#22c55e" },
    imageSearchTerms: ["pressure washing driveway", "house exterior power washing", "commercial pressure cleaning", "deck pressure washing"],
    serviceExamples: ["House Washing", "Driveway & Sidewalk Cleaning", "Deck & Patio Restoration", "Commercial Pressure Washing", "Roof Cleaning", "Fence Cleaning", "Graffiti Removal"],
    ctaPreference: "Request a Quote",
    tonality: "transformative, before-and-after, powerful",
  },
  // --- Dentistry ---
  {
    industry: "Dentistry",
    keywords: ["dentist", "dental", "dentistry"],
    suggestedTemplate: "clean-trustworthy",
    colorOverride: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#2563eb" },
    imageSearchTerms: ["modern dental office", "dentist with patient smiling", "dental clinic interior", "professional dental care"],
    serviceExamples: ["General Dentistry", "Teeth Whitening", "Dental Implants", "Cosmetic Dentistry", "Emergency Dental Care", "Pediatric Dentistry", "Invisalign"],
    ctaPreference: "Book Your Appointment",
    tonality: "caring, professional, modern",
  },
  // --- Chiropractic ---
  {
    industry: "Chiropractic",
    keywords: ["chiropractor", "chiropractic"],
    suggestedTemplate: "clean-trustworthy",
    colorOverride: { primary: "#059669", secondary: "#ecfdf5", accent: "#7c3aed" },
    imageSearchTerms: ["chiropractic adjustment", "chiropractor office modern", "spine health wellness", "physical therapy session"],
    serviceExamples: ["Spinal Adjustments", "Sports Injury Treatment", "Neck & Back Pain Relief", "Posture Correction", "Sciatica Treatment", "Wellness Programs", "X-Ray Diagnostics"],
    ctaPreference: "Get a Free Consultation",
    tonality: "healing, wellness-focused, expert",
  },
  // --- Bounce House ---
  {
    industry: "Bounce House",
    keywords: ["bounce house", "party rental", "inflatable"],
    suggestedTemplate: "friendly-approachable",
    colorOverride: { primary: "#d946ef", secondary: "#fdf4ff", accent: "#f97316" },
    imageSearchTerms: ["bounce house party kids", "inflatable rental event", "colorful bounce castle", "outdoor party rentals"],
    serviceExamples: ["Bounce House Rentals", "Water Slide Rentals", "Obstacle Course Rentals", "Party Packages", "Event Setup & Delivery", "Combo Units", "Toddler Inflatables"],
    ctaPreference: "Let's Get Started",
    tonality: "fun, exciting, family-friendly",
  },
  // --- Dog Poop Pickup ---
  {
    industry: "Dog poop pickup",
    keywords: ["dog poop", "pet waste", "pooper scooper"],
    suggestedTemplate: "friendly-approachable",
    colorOverride: { primary: "#16a34a", secondary: "#f0fdf4", accent: "#a855f7" },
    imageSearchTerms: ["clean backyard lawn", "happy dog in yard", "pet waste removal service", "green lawn maintenance"],
    serviceExamples: ["Weekly Yard Cleanup", "One-Time Deep Clean", "Bi-Weekly Service", "Commercial Property Service", "Dog Park Cleanup", "Deodorizing Treatment", "Holiday Schedules"],
    ctaPreference: "Schedule a Visit",
    tonality: "friendly, clean, hassle-free",
  },
  // --- Dog Trainer ---
  {
    industry: "Dog Trainer",
    keywords: ["dog trainer", "dog training", "pet training"],
    suggestedTemplate: "friendly-approachable",
    colorOverride: { primary: "#b45309", secondary: "#fffbeb", accent: "#2563eb" },
    imageSearchTerms: ["dog training session", "professional dog trainer", "obedient dog outdoors", "puppy training class"],
    serviceExamples: ["Basic Obedience Training", "Puppy Training", "Behavioral Modification", "In-Home Training", "Group Classes", "Advanced Commands", "Aggression Management"],
    ctaPreference: "Schedule a Visit",
    tonality: "patient, knowledgeable, results-driven",
  },
  // --- Epoxy Flooring ---
  {
    industry: "Epoxy Flooring",
    keywords: ["epoxy", "flooring", "coatings"],
    suggestedTemplate: "bold-modern",
    colorOverride: { primary: "#6366f1", secondary: "#1e1b4b", accent: "#f59e0b" },
    imageSearchTerms: ["epoxy garage floor", "metallic epoxy flooring", "commercial epoxy coating", "decorative concrete floor"],
    serviceExamples: ["Garage Floor Epoxy", "Commercial Epoxy Coatings", "Metallic Epoxy Floors", "Decorative Concrete", "Industrial Flooring", "Floor Repair & Prep", "Anti-Slip Coatings"],
    ctaPreference: "Get Your Free Estimate",
    tonality: "transformative, durable, showroom-quality",
  },
  // --- Handyman ---
  {
    industry: "Handyman Service",
    keywords: ["handyman", "home repair"],
    suggestedTemplate: "clean-trustworthy",
    colorOverride: { primary: "#ca8a04", secondary: "#fefce8", accent: "#2563eb" },
    imageSearchTerms: ["handyman home repair", "professional handyman tools", "home maintenance service", "fixing home interior"],
    serviceExamples: ["General Repairs", "Furniture Assembly", "Drywall Repair", "Painting & Touch-ups", "Door & Window Repair", "Shelving & Mounting", "Plumbing & Electrical Basics"],
    ctaPreference: "Call Now for Service",
    tonality: "dependable, versatile, neighborly",
  },
  // --- Gutter Cleaning ---
  {
    industry: "Gutter Cleaning",
    keywords: ["gutter", "guttering"],
    suggestedTemplate: "rugged-professional",
    colorOverride: { primary: "#1e40af", secondary: "#1e293b", accent: "#f59e0b" },
    imageSearchTerms: ["gutter cleaning service", "seamless gutter installation", "rain gutter repair", "gutter guard installation"],
    serviceExamples: ["Gutter Cleaning", "Gutter Installation", "Gutter Guards", "Gutter Repair", "Downspout Service", "Seamless Gutters", "Storm Damage Repair"],
    ctaPreference: "Request a Quote",
    tonality: "protective, thorough, weather-ready",
  },
  // --- Cleaning Services ---
  {
    industry: "Cleaning Services",
    keywords: ["cleaning", "maid", "janitorial"],
    suggestedTemplate: "friendly-approachable",
    colorOverride: { primary: "#0891b2", secondary: "#ecfeff", accent: "#f97316" },
    imageSearchTerms: ["professional house cleaning", "clean modern home interior", "cleaning service team", "sparkling kitchen clean"],
    serviceExamples: ["Regular House Cleaning", "Deep Cleaning", "Move-In/Move-Out Cleaning", "Office Cleaning", "Post-Construction Cleanup", "Window Cleaning", "Carpet Cleaning"],
    ctaPreference: "Schedule a Visit",
    tonality: "fresh, reliable, detail-oriented",
  },
  // --- Food Truck ---
  {
    industry: "Food truck",
    keywords: ["food truck", "mobile food"],
    suggestedTemplate: "minimal-sleek",
    colorOverride: { primary: "#dc2626", secondary: "#fafafa", accent: "#f59e0b" },
    imageSearchTerms: ["food truck serving customers", "gourmet street food", "food truck festival", "mobile kitchen"],
    serviceExamples: ["Daily Menu Specials", "Catering Services", "Event Bookings", "Private Parties", "Corporate Lunch Service", "Festival Appearances", "Custom Menu Options"],
    ctaPreference: "Book Your Appointment",
    tonality: "delicious, vibrant, community-driven",
  },
  // --- Renovations ---
  {
    industry: "Renovations",
    keywords: ["renovation", "remodeling", "remodel"],
    suggestedTemplate: "bold-modern",
    colorOverride: { primary: "#0f766e", secondary: "#134e4a", accent: "#f59e0b" },
    imageSearchTerms: ["home renovation before after", "kitchen remodel modern", "bathroom renovation luxury", "home improvement contractor"],
    serviceExamples: ["Kitchen Remodeling", "Bathroom Renovation", "Basement Finishing", "Room Additions", "Whole Home Renovation", "Flooring Installation", "Custom Cabinetry"],
    ctaPreference: "Start Your Project Today",
    tonality: "transformative, visionary, quality-crafted",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getTemplateById(id: string): WebsiteTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function getSuggestedTemplate(industry: string): WebsiteTemplate {
  const config = INDUSTRY_CONFIGS.find(
    c => c.industry.toLowerCase() === industry.toLowerCase() ||
         c.keywords.some(k => industry.toLowerCase().includes(k))
  );
  if (config) {
    return TEMPLATES.find(t => t.id === config.suggestedTemplate) ?? TEMPLATES[1];
  }
  // Default to Clean & Trustworthy for unknown industries
  return TEMPLATES[1];
}

export function getIndustryConfig(industry: string): IndustryConfig | undefined {
  return INDUSTRY_CONFIGS.find(
    c => c.industry.toLowerCase() === industry.toLowerCase() ||
         c.keywords.some(k => industry.toLowerCase().includes(k))
  );
}

/**
 * Curated Unsplash photo URLs for industry-specific imagery.
 * Hand-picked, high-quality photos that work well as website hero/section images.
 */
export const INDUSTRY_IMAGES: Record<string, string[]> = {
  plumbing: [
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
  ],
  hvac: [
    "https://images.unsplash.com/photo-1631545806609-35d4ae440431?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
  ],
  concrete: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
  ],
  fencing: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
  ],
  junk_removal: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&h=800&fit=crop",
  ],
  auto_detailing: [
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=800&fit=crop",
  ],
  pressure_washing: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
  ],
  dentistry: [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?w=1200&h=800&fit=crop",
  ],
  chiropractic: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
  ],
  bounce_house: [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&h=800&fit=crop",
  ],
  cleaning: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
  ],
  dog_services: [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1200&h=800&fit=crop",
  ],
  epoxy: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=1200&h=800&fit=crop",
  ],
  renovation: [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
  ],
  handyman: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
  ],
  gutter: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
  ],
  food: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&h=800&fit=crop",
  ],
  generic: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
  ],
};

/**
 * Get industry-specific image URLs based on the industry name.
 * Falls back to generic images if no specific match is found.
 */
export function getIndustryImages(industry: string): string[] {
  const lower = industry.toLowerCase();
  for (const [key, urls] of Object.entries(INDUSTRY_IMAGES)) {
    if (lower.includes(key) || key.includes(lower.split(' ')[0])) {
      return urls;
    }
  }
  // Try keyword matching from industry configs
  const config = getIndustryConfig(industry);
  if (config) {
    for (const keyword of config.keywords) {
      for (const [key, urls] of Object.entries(INDUSTRY_IMAGES)) {
        if (keyword.includes(key) || key.includes(keyword)) {
          return urls;
        }
      }
    }
  }
  return INDUSTRY_IMAGES.generic;
}
