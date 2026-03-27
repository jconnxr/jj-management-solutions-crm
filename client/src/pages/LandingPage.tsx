import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Globe,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Palette,
  BarChart3,
  Wrench,
  MessageSquare,
  ChevronDown,
  ExternalLink,
  MapPin,
  Clock,
  Shield,
  Zap,
  Heart,
  Menu,
  X,
} from "lucide-react";

// CDN URLs for headshots
const JOHN_HEADSHOT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/john-conner-headshot_44e6bbef.jpeg";
const JACOB_HEADSHOT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/jacob-foreman-headshot_dacc8d1c.jpeg";

// Portfolio sample sites will be populated after upload
const PORTFOLIO_SITES: { title: string; industry: string; template: string; description: string; previewUrl: string; colors: { primary: string; accent: string; bg: string }; thumbnail: string }[] = [];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [contactForm, setContactForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    message: "",
    preferredContact: "phone" as "phone" | "email" | "text",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFormSubmitted(true);
      toast.success("Message sent! We'll be in touch soon.");
    },
    onError: () => {
      toast.error("Something went wrong. Please call us directly.");
    },
  });

  // Set page title for the landing page
  useEffect(() => {
    document.title = "J&J Management Solutions | Websites for Oklahoma Businesses";
    return () => { document.title = "J&J Management Solutions CRM"; };
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }
    contactMutation.mutate({
      name: contactForm.name,
      businessName: contactForm.businessName || undefined,
      phone: contactForm.phone || undefined,
      email: contactForm.email || undefined,
      message: contactForm.message,
      preferredContact: contactForm.preferredContact,
    });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif" }}>
      {/* ============================================================ */}
      {/* NAVIGATION */}
      {/* ============================================================ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5 group">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              J&J
            </div>
            <div className="text-left">
              <div className="font-bold text-sm leading-tight" style={{ color: "#1a1a2e" }}>
                J&J Management
              </div>
              <div className="text-[10px] font-medium leading-tight" style={{ color: "#64748b" }}>
                Solutions
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: activeSection === link.id ? "#1e40af" : "#475569",
                  background: activeSection === link.id ? "rgba(30,64,175,0.06)" : "transparent",
                }}
              >
                {link.label}
              </button>
            ))}
            <a
              href="tel:+14053123681"
              className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              <Phone className="h-3.5 w-3.5 inline mr-1.5" />
              Call Us
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "#475569" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 pb-4 pt-2"
            style={{ background: "rgba(255,255,255,0.98)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: activeSection === link.id ? "#1e40af" : "#475569" }}
              >
                {link.label}
              </button>
            ))}
            <a
              href="tel:+14053123681"
              className="block w-full text-center mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              <Phone className="h-3.5 w-3.5 inline mr-1.5" />
              (405) 312-3681
            </a>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section
        id="home"
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient orbs */}
        <div
          className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <MapPin className="h-3 w-3" />
              Serving the Oklahoma City Metro Area
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
              style={{ color: "#f8fafc" }}
            >
              Your Business Deserves
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                A Real Website.
              </span>
            </h1>

            <p
              className="mt-5 text-lg sm:text-xl leading-relaxed max-w-2xl"
              style={{ color: "#94a3b8" }}
            >
              We help service-based businesses in Oklahoma build professional websites that
              bring in more customers. No templates. No cookie-cutter designs. Just websites
              that actually work for <em>your</em> business.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
              >
                Get a Free Consultation
                <ArrowRight className="h-4 w-4 inline ml-2" />
              </button>
              <a
                href="tel:+14053123681"
                className="px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 text-center"
                style={{ color: "#93c5fd", border: "1px solid rgba(147,197,253,0.3)", background: "rgba(59,130,246,0.08)" }}
              >
                <Phone className="h-4 w-4 inline mr-2" />
                (405) 312-3681
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: Shield, text: "No Upfront Costs" },
                { icon: Clock, text: "Fast Turnaround" },
                { icon: Heart, text: "Oklahoma Owned" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2" style={{ color: "#64748b" }}>
                  <item.icon className="h-4 w-4" style={{ color: "#3b82f6" }} />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABOUT SECTION */}
      {/* ============================================================ */}
      <section id="about" className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "rgba(30,64,175,0.06)", color: "#1e40af" }}
            >
              <Users className="h-3 w-3" />
              Who We Are
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "#0f172a" }}
            >
              Two Oklahoma Guys Who Get It
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
              We know what it's like to run a business. We started J&J Management Solutions
              because too many hardworking business owners were losing customers simply
              because they didn't have a website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* John */}
            <div
              className="rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <div className="relative inline-block mb-5">
                <img
                  src={JOHN_HEADSHOT}
                  alt="John Conner"
                  className="w-36 h-36 rounded-full object-cover mx-auto"
                  style={{ border: "4px solid #e2e8f0" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                >
                  J
                </div>
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                John Conner
              </h3>
              <p className="text-sm font-semibold mt-1" style={{ color: "#3b82f6" }}>
                Co-Founder
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Born and raised in Oklahoma, John brings a hands-on approach to every project.
                He believes every business owner deserves a professional online presence,
                regardless of their budget.
              </p>
              <a
                href="tel:+14053123681"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium"
                style={{ color: "#1e40af" }}
              >
                <Phone className="h-3.5 w-3.5" />
                (405) 312-3681
              </a>
            </div>

            {/* Jacob */}
            <div
              className="rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <div className="relative inline-block mb-5">
                <img
                  src={JACOB_HEADSHOT}
                  alt="Jacob Foreman"
                  className="w-36 h-36 rounded-full object-cover mx-auto"
                  style={{ border: "4px solid #e2e8f0" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                >
                  J
                </div>
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                Jacob Foreman
              </h3>
              <p className="text-sm font-semibold mt-1" style={{ color: "#3b82f6" }}>
                Co-Founder
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Jacob is passionate about helping small businesses compete with the big guys.
                He handles the technical side, making sure every website is fast, mobile-friendly,
                and built to convert visitors into customers.
              </p>
              <a
                href="tel:+14056530112"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium"
                style={{ color: "#1e40af" }}
              >
                <Phone className="h-3.5 w-3.5" />
                (405) 653-0112
              </a>
            </div>
          </div>

          {/* Values */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Oklahoma Roots",
                text: "We're local. We understand the OKC market and the businesses that make it great.",
              },
              {
                icon: Shield,
                title: "Honest Pricing",
                text: "We work with businesses of all sizes and budgets. No hidden fees, no surprises.",
              },
              {
                icon: Zap,
                title: "Real Results",
                text: "Our websites aren't just pretty — they're built to bring in phone calls and customers.",
              },
            ].map((val) => (
              <div key={val.title} className="text-center p-5">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(30,64,175,0.06)" }}
                >
                  <val.icon className="h-5 w-5" style={{ color: "#1e40af" }} />
                </div>
                <h4 className="font-semibold text-base" style={{ color: "#0f172a" }}>
                  {val.title}
                </h4>
                <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
                  {val.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES SECTION */}
      {/* ============================================================ */}
      <section
        id="services"
        className="py-20 sm:py-28 px-4"
        style={{ background: "#f8fafc" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "rgba(30,64,175,0.06)", color: "#1e40af" }}
            >
              <Wrench className="h-3 w-3" />
              What We Do
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "#0f172a" }}
            >
              Everything Your Business Needs Online
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
              We don't just build websites — we build your entire online presence so
              customers can find you, trust you, and call you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Custom Website Design",
                description:
                  "Professional, mobile-friendly websites designed specifically for your business. No templates — every site is unique to your brand and industry.",
                highlight: "Most Popular",
              },
              {
                icon: BarChart3,
                title: "Google Business Setup",
                description:
                  "Get found on Google Maps and local search. We'll set up and optimize your Google Business Profile so customers in your area find you first.",
                highlight: null,
              },
              {
                icon: Palette,
                title: "Brand & Logo Design",
                description:
                  "Need a professional logo? We'll create a brand identity that looks great on your truck, business cards, and website.",
                highlight: null,
              },
              {
                icon: MessageSquare,
                title: "Review Management",
                description:
                  "We help you get more 5-star reviews and manage your online reputation. More reviews means more trust and more customers.",
                highlight: null,
              },
              {
                icon: Phone,
                title: "Lead Generation",
                description:
                  "Your website should work for you 24/7. We build sites that turn visitors into phone calls, form submissions, and booked jobs.",
                highlight: null,
              },
              {
                icon: Wrench,
                title: "Ongoing Support",
                description:
                  "Need updates? Have questions? We're a phone call away. We maintain your site so you can focus on running your business.",
                highlight: null,
              },
            ].map((service) => (
              <div
                key={service.title}
                className="relative rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                {service.highlight && (
                  <div
                    className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                  >
                    {service.highlight}
                  </div>
                )}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(30,64,175,0.06)" }}
                >
                  <service.icon className="h-5 w-5" style={{ color: "#1e40af" }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#0f172a" }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing message */}
          <div
            className="mt-14 rounded-2xl p-8 sm:p-10 text-center"
            style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <h3 className="text-2xl font-bold" style={{ color: "#f8fafc" }}>
              Flexible Pricing That Fits Your Budget
            </h3>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
              We believe every business deserves a great website, regardless of size or budget.
              We'll work with you to find a plan that makes sense for your business.
            </p>
            <button
              onClick={() => scrollTo("contact")}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              Let's Talk About Your Project
              <ArrowRight className="h-4 w-4 inline ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PORTFOLIO SECTION */}
      {/* ============================================================ */}
      <section id="portfolio" className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "rgba(30,64,175,0.06)", color: "#1e40af" }}
            >
              <Star className="h-3 w-3" />
              Our Work
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "#0f172a" }}
            >
              Sample Websites We've Built
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
              Every website is custom-designed for the business and industry. Here are a few
              examples of what we can build for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="portfolio-grid">
            {/* Portfolio Card 1 - Plumbing */}
            <a
              href="/portfolio/summit-plumbing"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div
                className="h-48 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e40af, #2563eb)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Wrench className="h-10 w-10 mx-auto mb-2 opacity-80" />
                    <p className="text-lg font-bold">Summit Plumbing Co.</p>
                    <p className="text-xs opacity-70 mt-1">Professional Plumbing Services</p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                    View Website <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(30,64,175,0.08)", color: "#1e40af" }}
                  >
                    PLUMBING
                  </span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#f1f5f9", color: "#64748b" }}
                  >
                    Clean & Trustworthy
                  </span>
                </div>
                <h3 className="font-semibold" style={{ color: "#0f172a" }}>
                  Summit Plumbing Co.
                </h3>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                  A clean, professional website for a plumbing company. Builds trust with a light design, clear service listings, and prominent call-to-action.
                </p>
              </div>
            </a>

            {/* Portfolio Card 2 - Concrete */}
            <a
              href="/portfolio/ironclad-concrete"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div
                className="h-48 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #292524, #44403c)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Shield className="h-10 w-10 mx-auto mb-2 opacity-80" />
                    <p className="text-lg font-bold">Ironclad Concrete</p>
                    <p className="text-xs opacity-70 mt-1">Concrete & Flatwork Specialists</p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                    View Website <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}
                  >
                    CONCRETE
                  </span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#f1f5f9", color: "#64748b" }}
                  >
                    Rugged & Professional
                  </span>
                </div>
                <h3 className="font-semibold" style={{ color: "#0f172a" }}>
                  Ironclad Concrete
                </h3>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                  A bold, industrial website for a concrete contractor. Dark theme with strong typography that commands authority and trust.
                </p>
              </div>
            </a>

            {/* Portfolio Card 3 - Auto Detailing */}
            <a
              href="/portfolio/pristine-auto-detail"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div
                className="h-48 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #171717, #374151)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Star className="h-10 w-10 mx-auto mb-2 opacity-80" />
                    <p className="text-lg font-bold">Pristine Auto Detail</p>
                    <p className="text-xs opacity-70 mt-1">Mobile Auto Detailing</p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                    View Website <ExternalLink className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1" }}
                  >
                    AUTO DETAILING
                  </span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#f1f5f9", color: "#64748b" }}
                  >
                    Minimal & Sleek
                  </span>
                </div>
                <h3 className="font-semibold" style={{ color: "#0f172a" }}>
                  Pristine Auto Detail
                </h3>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                  A sleek, minimal website for a mobile detailing business. Modern design with clean lines and sophisticated typography.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#f8fafc" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "#0f172a" }}
            >
              How It Works
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#64748b" }}>
              Getting your business online is easier than you think.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Free Consultation",
                text: "Give us a call or fill out the form below. We'll learn about your business, what you need, and how we can help. No pressure, no commitment.",
              },
              {
                step: "02",
                title: "Custom Design",
                text: "We design a website tailored to your industry, brand, and customers. You'll see a preview before anything goes live — and we'll revise until you love it.",
              },
              {
                step: "03",
                title: "Launch & Grow",
                text: "Once approved, we launch your site and make sure it shows up on Google. Then we stick around to help you keep it updated and working for you.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                  >
                    {item.step}
                  </div>
                  {i < 2 && (
                    <div className="w-0.5 h-16" style={{ background: "#e2e8f0" }} />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-lg" style={{ color: "#0f172a" }}>
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTACT SECTION */}
      {/* ============================================================ */}
      <section id="contact" className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact info */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: "rgba(30,64,175,0.06)", color: "#1e40af" }}
              >
                <MessageSquare className="h-3 w-3" />
                Get In Touch
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ color: "#0f172a" }}
              >
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg" style={{ color: "#64748b" }}>
                Give us a call, shoot us a text, or fill out the form. We'll get back to you
                within 24 hours — usually much sooner.
              </p>

              <div className="mt-8 space-y-5">
                {/* John */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <img
                    src={JOHN_HEADSHOT}
                    alt="John"
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: "2px solid #e2e8f0" }}
                  />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                      John Conner
                    </p>
                    <a
                      href="tel:+14053123681"
                      className="text-sm font-medium"
                      style={{ color: "#1e40af" }}
                    >
                      (405) 312-3681
                    </a>
                  </div>
                </div>

                {/* Jacob */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <img
                    src={JACOB_HEADSHOT}
                    alt="Jacob"
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: "2px solid #e2e8f0" }}
                  />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                      Jacob Foreman
                    </p>
                    <a
                      href="tel:+14056530112"
                      className="text-sm font-medium"
                      style={{ color: "#1e40af" }}
                    >
                      (405) 653-0112
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 p-4 rounded-xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#1e40af" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                    Serving the OKC Metro Area
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                    Oklahoma City, Edmond, Norman, Moore, Yukon, Mustang, Midwest City, Del City,
                    Bethany, Warr Acres, and surrounding communities.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              {formSubmitted ? (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  <CheckCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "#16a34a" }} />
                  <h3 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
                    Thanks for reaching out. We'll get back to you within 24 hours. If you need
                    immediate help, give us a call at{" "}
                    <a href="tel:+14053123681" className="font-semibold" style={{ color: "#1e40af" }}>
                      (405) 312-3681
                    </a>
                    .
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setContactForm({
                        name: "",
                        businessName: "",
                        phone: "",
                        email: "",
                        message: "",
                        preferredContact: "phone",
                      });
                    }}
                    className="mt-4 text-sm font-medium"
                    style={{ color: "#1e40af" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  className="rounded-2xl p-8"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <h3 className="text-lg font-bold mb-6" style={{ color: "#0f172a" }}>
                    Send Us a Message
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#0f172a",
                        }}
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={contactForm.businessName}
                        onChange={(e) => setContactForm((f) => ({ ...f, businessName: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#0f172a",
                        }}
                        placeholder="Smith's Plumbing"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #d1d5db",
                            color: "#0f172a",
                          }}
                          placeholder="(405) 555-1234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #d1d5db",
                            color: "#0f172a",
                          }}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        How should we contact you?
                      </label>
                      <div className="flex gap-3">
                        {(["phone", "email", "text"] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setContactForm((f) => ({ ...f, preferredContact: method }))}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: contactForm.preferredContact === method ? "#1e40af" : "#ffffff",
                              color: contactForm.preferredContact === method ? "#ffffff" : "#475569",
                              border: contactForm.preferredContact === method ? "1px solid #1e40af" : "1px solid #d1d5db",
                            }}
                          >
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Tell us about your business *
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#0f172a",
                        }}
                        placeholder="What kind of business do you run? What are you looking for in a website?"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer
        className="py-10 px-4"
        style={{
          background: "#0f172a",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
              >
                J&J
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#f8fafc" }}>
                  J&J Management Solutions
                </p>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  Helping Oklahoma businesses get online.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="tel:+14053123681" className="text-sm" style={{ color: "#94a3b8" }}>
                (405) 312-3681
              </a>
              <a href="tel:+14056530112" className="text-sm" style={{ color: "#94a3b8" }}>
                (405) 653-0112
              </a>
            </div>
          </div>

          <div
            className="mt-6 pt-6 text-center text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#475569" }}
          >
            &copy; {new Date().getFullYear()} J&J Management Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
