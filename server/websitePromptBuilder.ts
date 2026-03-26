import { WebsiteTemplate } from "../shared/websiteTemplates";

export interface PromptParams {
  template: WebsiteTemplate;
  businessName: string;
  serviceType: string;
  location: string;
  phone: string;
  phoneClean: string;
  services: string[];
  aboutInfo: string;
  ctaText: string;
  colors: { primary: string; secondary: string; accent: string; bg?: string; text?: string };
  images: string[];
  tonality: string;
}

export function buildTemplatePrompt(p: PromptParams): string {
  const servicesFormatted = p.services.map((s, i) => "  " + (i + 1) + ". " + s).join("\n");
  const imageList = p.images.map((url, i) => "  Image " + (i + 1) + ": " + url).join("\n");

  const parts: string[] = [];

  parts.push("BUSINESS INFORMATION:");
  parts.push("- Business Name: " + p.businessName);
  parts.push("- Industry: " + p.serviceType);
  parts.push("- Location: " + p.location);
  parts.push("- Phone: " + p.phone + " (use tel:" + p.phoneClean + " for all call links)");
  parts.push("- Services:\n" + servicesFormatted);
  parts.push("- About: " + p.aboutInfo);
  parts.push('- Primary CTA Text: "' + p.ctaText + '"');
  parts.push("- Tone: " + p.tonality);
  parts.push("");

  parts.push("COLOR PALETTE (use these exact colors):");
  parts.push("- Primary: " + p.colors.primary);
  parts.push("- Secondary: " + p.colors.secondary);
  parts.push("- Accent: " + p.colors.accent);
  if (p.colors.bg) parts.push("- Background: " + p.colors.bg);
  if (p.colors.text) parts.push("- Text: " + p.colors.text);
  parts.push("");

  parts.push("IMAGES (use these real Unsplash URLs, do NOT use placeholder services like picsum.photos):");
  parts.push(imageList);
  parts.push("Use Image 1 as the hero/header background. Use the others for service sections, about sections, and visual breaks.");
  parts.push("Apply CSS object-fit: cover and overlay gradients to make them look professional.");
  parts.push("");

  parts.push(getTemplateInstructions(p));
  parts.push("");

  parts.push("UNIVERSAL REQUIREMENTS:");
  parts.push("1. Generate a COMPLETE single HTML file with ALL CSS in a <style> tag. No external stylesheets except Google Fonts.");
  parts.push("2. Fully mobile responsive with media queries (375px, 768px, 1024px, 1440px breakpoints).");
  parts.push("3. Use Google Fonts via CDN. Choose fonts that match the template style described above.");
  parts.push("4. Every CTA button links to tel:" + p.phoneClean);
  parts.push("5. Include a sticky/fixed mobile call button at the bottom on small screens.");
  parts.push("6. Smooth scroll behavior for anchor links.");
  parts.push("7. Mobile hamburger menu with slide-in animation.");
  parts.push("8. NO JavaScript frameworks. Only vanilla JS for menu toggle and scroll effects.");
  parts.push("9. Minimum 6 distinct sections on the page.");
  parts.push("10. Professional typography hierarchy (h1 > h2 > h3 > body).");
  parts.push("11. Proper spacing and visual rhythm between sections.");
  parts.push("12. The phone number should appear at least 3 times on the page.");
  parts.push("13. Include subtle CSS animations (fade-in on scroll, hover effects on buttons/cards).");
  parts.push("14. The website must look custom-built by a professional agency, NOT a generic template.");
  parts.push("15. Include proper meta viewport tag for mobile.");
  parts.push("16. Use semantic HTML (header, nav, main, section, footer).");
  parts.push("");
  parts.push("Return ONLY the complete HTML code, starting with <!DOCTYPE html> and ending with </html>.");
  parts.push("No markdown, no explanation, no code fences.");

  return parts.join("\n");
}

function getTemplateInstructions(p: PromptParams): string {
  switch (p.template.id) {
    case "bold-modern": return boldModern(p);
    case "clean-trustworthy": return cleanTrustworthy(p);
    case "friendly-approachable": return friendlyApproachable(p);
    case "rugged-professional": return ruggedProfessional(p);
    case "minimal-sleek": return minimalSleek(p);
    default: return cleanTrustworthy(p);
  }
}

function boldModern(p: PromptParams): string {
  const lines: string[] = [];
  lines.push("DESIGN TEMPLATE: BOLD & MODERN");
  lines.push("This website must feel PREMIUM and HIGH-END. Think tech startup meets luxury contractor.");
  lines.push("");
  lines.push("TYPOGRAPHY:");
  lines.push("- Use Montserrat for headings (weight 800/900) and Inter for body text.");
  lines.push("- Headings should be LARGE with tight letter-spacing (-0.02em).");
  lines.push("- Use uppercase for section labels and nav items.");
  lines.push("");
  lines.push("LAYOUT & STRUCTURE:");
  lines.push("1. HERO (Split Layout): Left side has headline, subtext, and CTA button. Right side has Image 1 with a geometric clip-path or angled edge. Dark background (" + (p.colors.bg || "#0f172a") + "). Bold, impactful headline.");
  lines.push("2. TRUST BAR: Horizontal strip with 4 trust signals (Licensed & Insured, 24/7 Emergency, Free Estimates, 5-Star Rated). Use Unicode icons with accent color (" + p.colors.accent + ").");
  lines.push("3. SERVICES GRID: 2x3 or 3x2 grid of service cards. Each card has a subtle gradient border, icon, title, and short description. Cards have a hover lift effect with glow.");
  lines.push("4. WHY US (Stats Counter): Dark section with 3-4 large numbers (500+ Jobs Completed, 15+ Years Experience, 100% Satisfaction). Use primary color (" + p.colors.primary + ") for the numbers.");
  lines.push("5. TESTIMONIALS: Horizontal scrollable cards with star ratings, customer quotes, and names. Dark cards on slightly lighter background.");
  lines.push('6. CTA BANNER: Full-width section with bold headline, the CTA text "' + p.ctaText + '", and the phone number in large text. Gradient background using primary and accent colors.');
  lines.push("7. FOOTER: Dark footer with business info, quick links, and service area. Clean grid layout.");
  lines.push("");
  lines.push("VISUAL EFFECTS:");
  lines.push("- Geometric shapes and angled dividers between sections (CSS clip-path or SVG).");
  lines.push("- Subtle gradient overlays on images.");
  lines.push("- Glow effects on hover for buttons and cards.");
  lines.push("- Smooth fade-in animations as sections scroll into view.");
  lines.push("- Button style: rounded corners, bold text, gradient or solid with hover glow.");
  return lines.join("\n");
}

function cleanTrustworthy(p: PromptParams): string {
  const lines: string[] = [];
  lines.push("DESIGN TEMPLATE: CLEAN & TRUSTWORTHY");
  lines.push("This website must feel RELIABLE and PROFESSIONAL. Think established local business serving the community for years.");
  lines.push("");
  lines.push("TYPOGRAPHY:");
  lines.push("- Use Playfair Display for h1 headings and Source Sans 3 for everything else.");
  lines.push("- h1 should be elegant and authoritative. h2 should be clean and clear.");
  lines.push("- Body text should be 16-18px with generous line-height (1.7).");
  lines.push("");
  lines.push("LAYOUT & STRUCTURE:");
  lines.push('1. HERO (Centered): Full-width hero with Image 1 as background, dark overlay gradient. Centered headline, subtext, and TWO CTA buttons: "' + p.ctaText + '" (primary) and "Learn More" (outline). Clean and balanced.');
  lines.push("2. SERVICES CARDS: Clean card grid (2x3 on desktop, 1 column mobile). Each card has a subtle top border in primary color, service name, brief description, and a small arrow link. White cards with soft shadow.");
  lines.push("3. ABOUT STORY: Two-column layout. Left has Image 2 with rounded corners. Right has the about text with a small accent line above the heading.");
  lines.push("4. PROCESS STEPS: Numbered steps (1-2-3-4) showing how to work with the business (Call Us, Get a Quote, Schedule Service, Enjoy Results). Connected by a subtle line.");
  lines.push("5. REVIEWS: Customer testimonial cards with star ratings, quotes, and names. Light gray background section.");
  lines.push("6. SERVICE AREA: Simple section mentioning " + p.location + " and surrounding areas.");
  lines.push('7. CONTACT (Split): Left side has contact info (phone, location, hours). Right side has Image 3. Prominent "' + p.ctaText + '" button.');
  lines.push("8. FOOTER: Clean footer with business name, phone, location, and copyright.");
  lines.push("");
  lines.push("VISUAL EFFECTS:");
  lines.push("- Soft box shadows on cards (0 4px 20px rgba(0,0,0,0.08)).");
  lines.push("- Subtle hover transitions on cards (translateY(-4px)).");
  lines.push("- Clean section dividers using padding and background color alternation (white / light gray).");
  lines.push("- Button style: solid primary color, rounded, clean hover darkening effect.");
  return lines.join("\n");
}

function friendlyApproachable(p: PromptParams): string {
  const lines: string[] = [];
  lines.push("DESIGN TEMPLATE: FRIENDLY & APPROACHABLE");
  lines.push("This website must feel WARM, INVITING, and FUN. Think friendly neighborhood business that makes you smile.");
  lines.push("");
  lines.push("TYPOGRAPHY:");
  lines.push("- Use Nunito or Quicksand for headings (weight 700) and Nunito for body text.");
  lines.push("- Rounded, friendly letterforms. Nothing sharp or corporate.");
  lines.push("- Generous font sizes with relaxed line-height (1.8).");
  lines.push("");
  lines.push("LAYOUT & STRUCTURE:");
  lines.push("1. HERO (Image Overlay): Full-width Image 1 with a warm gradient overlay (from " + p.colors.primary + " at 70% opacity). Centered text with a playful headline, friendly subtext, and a large rounded CTA button. Wave SVG divider at the bottom.");
  lines.push("2. INTRO BLURB: Short, warm introduction paragraph centered on the page. Friendly tone with a decorative icon above it. Light warm background.");
  lines.push("3. SERVICES (Icon Cards): Services displayed with large friendly icons (Unicode or SVG), service name, and a one-liner. Cards have rounded corners (16px+), warm shadows, and a subtle background tint on hover.");
  lines.push("4. ABOUT (Team Feel): Image 2 alongside a personal about section. Rounded image corners. Warm, conversational text.");
  lines.push("5. GALLERY/SHOWCASE: A simple image grid (2x2) showing work or happy customers. Rounded corners on all images. Subtle hover zoom effect.");
  lines.push("6. FAQ: Expandable accordion-style FAQ section with 4-5 common questions. Rounded containers, friendly icons for expand/collapse.");
  lines.push('7. CONTACT (Friendly): Warm background section with "' + p.ctaText + '" as the main CTA. Phone number displayed large. Friendly closing message.');
  lines.push("8. FOOTER: Warm-toned footer with rounded elements, business info, and a friendly tagline.");
  lines.push("");
  lines.push("VISUAL EFFECTS:");
  lines.push("- Rounded corners everywhere (12-20px on cards, full-round on avatars).");
  lines.push("- Warm, soft shadows (0 8px 30px rgba(0,0,0,0.06)).");
  lines.push("- Wave or blob SVG dividers between sections.");
  lines.push("- Playful hover animations (slight bounce, color shift).");
  lines.push("- Button style: large, rounded (border-radius: 50px), bold text, warm colors.");
  return lines.join("\n");
}

function ruggedProfessional(p: PromptParams): string {
  const lines: string[] = [];
  lines.push("DESIGN TEMPLATE: RUGGED & PROFESSIONAL");
  lines.push("This website must feel STRONG, TOUGH, and AUTHORITATIVE. Think heavy-duty contractor who gets the job done right.");
  lines.push("");
  lines.push("TYPOGRAPHY:");
  lines.push("- Use Oswald or Barlow Condensed for headings (weight 700, uppercase) and Roboto for body text.");
  lines.push("- Headings should feel industrial and commanding. Tight letter-spacing.");
  lines.push("- Use all-caps for section titles and CTAs.");
  lines.push("");
  lines.push("LAYOUT & STRUCTURE:");
  lines.push("1. HERO (Full-Width Impact): Full-width Image 1 with a dark overlay (80% opacity). Large uppercase headline, strong subtext, and a bold CTA button. Maybe a subtle texture or noise overlay on the dark background.");
  lines.push("2. SERVICES (Alternating Rows): Each service gets a full-width alternating row. Left image / right text, then right image / left text. Strong visual impact. Each row has a CTA link.");
  lines.push("3. EQUIPMENT/WORK SHOWCASE: A visual section showing the type of work done. Grid of images with overlay text. Dark theme.");
  lines.push("4. STATS COUNTER: Dark section with large bold numbers (Projects Completed, Years in Business, Happy Customers, Cities Served). Yellow/accent colored numbers on dark background.");
  lines.push("5. TESTIMONIALS (Dark): Customer quotes on dark cards with accent-colored quotation marks. Strong, confident testimonials.");
  lines.push("6. SERVICE AREA: Bold section listing cities and areas served. " + p.location + " prominently featured.");
  lines.push('7. CTA (Urgent): Full-width dark section with urgent messaging. "' + p.ctaText + '" in large text. Phone number huge. Create a sense of urgency.');
  lines.push("8. FOOTER: Dark, industrial footer with clean grid layout. Business info, services list, service area.");
  lines.push("");
  lines.push("VISUAL EFFECTS:");
  lines.push("- Strong contrast between dark backgrounds and light text.");
  lines.push("- Textured or noise overlays on dark sections for depth.");
  lines.push("- Bold, angular elements (no rounded corners, use sharp edges).");
  lines.push("- Accent color (" + p.colors.accent + ") used sparingly for maximum impact (CTAs, numbers, dividers).");
  lines.push("- Button style: sharp corners, uppercase text, bold border or solid fill, strong hover state.");
  return lines.join("\n");
}

function minimalSleek(p: PromptParams): string {
  const lines: string[] = [];
  lines.push("DESIGN TEMPLATE: MINIMAL & SLEEK");
  lines.push("This website must feel SOPHISTICATED and CONTEMPORARY. Think high-end design studio or premium service brand.");
  lines.push("");
  lines.push("TYPOGRAPHY:");
  lines.push("- Use DM Sans or Space Grotesk for headings and Inter for body text.");
  lines.push("- Thin to medium weights. Elegant, not heavy.");
  lines.push("- Generous whitespace around all text. Let it breathe.");
  lines.push("");
  lines.push("LAYOUT & STRUCTURE:");
  lines.push("1. HERO (Minimal): Clean white/light background. Large, elegant headline with subtle animation. Small subtext. Single CTA button. Image 1 displayed as a large, clean photo below or beside the text with generous padding.");
  lines.push("2. SERVICES (Clean List): Services displayed as a clean vertical list with subtle dividers. Each service has a name, one-line description, and a small arrow. Hover reveals more detail or subtle highlight.");
  lines.push("3. ABOUT (Minimal): Simple two-column layout. Image 2 on one side, clean text on the other. Lots of whitespace. Elegant and understated.");
  lines.push("4. PROCESS TIMELINE: Vertical timeline showing the process steps. Clean lines connecting each step. Minimal icons.");
  lines.push("5. PORTFOLIO/WORK: Clean image grid with subtle hover effects. No borders, just spacing. Images speak for themselves.");
  lines.push('6. CONTACT (Minimal): Clean section with just the essentials. Phone number, location, and a single "' + p.ctaText + '" button. Nothing extra.');
  lines.push("7. FOOTER: Ultra-minimal footer. Business name, phone, copyright. Single line or two-column max.");
  lines.push("");
  lines.push("VISUAL EFFECTS:");
  lines.push("- Maximum whitespace. Let every element breathe.");
  lines.push("- Subtle, thin borders (1px, light gray) instead of shadows.");
  lines.push("- Micro-animations on hover (underline slide, opacity shift, subtle scale).");
  lines.push("- Accent color (" + p.colors.accent + ") used very sparingly for links and CTAs only.");
  lines.push("- Button style: minimal, thin border or text-only with underline. Clean hover transition.");
  lines.push("- No visual clutter. Every element must earn its place on the page.");
  return lines.join("\n");
}
