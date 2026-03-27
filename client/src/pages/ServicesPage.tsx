import { useEffect } from "react";
import { Link } from "wouter";
import {
  Globe,
  Phone,
  ArrowRight,
  Wrench,
  BarChart3,
  Palette,
  MessageSquare,
  Star,
  CheckCircle,
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

export default function ServicesPage() {
  useEffect(() => {
    document.title = "Services | J&J Management Solutions";
    return () => { document.title = "J&J Management Solutions CRM"; };
  }, []);

  const services = [
    {
      icon: Globe,
      title: "Custom Website Design",
      description:
        "Professional, mobile-friendly websites designed specifically for your business. No templates — every site is unique to your brand and industry.",
      features: ["Mobile-responsive design", "SEO-optimized structure", "Fast loading speeds", "Custom branding & colors"],
      highlight: "Most Popular",
    },
    {
      icon: BarChart3,
      title: "Google Business Setup",
      description:
        "Get found on Google Maps and local search. We'll set up and optimize your Google Business Profile so customers in your area find you first.",
      features: ["Google Maps listing", "Business profile optimization", "Local SEO setup", "Review strategy"],
      highlight: null,
    },
    {
      icon: Palette,
      title: "Brand & Logo Design",
      description:
        "Need a professional logo? We'll create a brand identity that looks great on your truck, business cards, and website.",
      features: ["Custom logo design", "Color palette & fonts", "Business card design", "Brand guidelines"],
      highlight: null,
    },
    {
      icon: MessageSquare,
      title: "Review Management",
      description:
        "We help you get more 5-star reviews and manage your online reputation. More reviews means more trust and more customers.",
      features: ["Review generation strategy", "Response templates", "Reputation monitoring", "Review platform setup"],
      highlight: null,
    },
    {
      icon: Phone,
      title: "Lead Generation",
      description:
        "Your website should work for you 24/7. We build sites that turn visitors into phone calls, form submissions, and booked jobs.",
      features: ["Contact form integration", "Click-to-call buttons", "Conversion optimization", "Analytics tracking"],
      highlight: null,
    },
    {
      icon: Wrench,
      title: "Ongoing Support",
      description:
        "Need updates? Have questions? We're a phone call away. We maintain your site so you can focus on running your business.",
      features: ["Content updates", "Security maintenance", "Performance monitoring", "Priority support"],
      highlight: null,
    },
  ];

  return (
    <PublicLayout>
      {/* Page Header */}
      <section
        className="pt-12 pb-16 sm:pt-20 sm:pb-20 px-4"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <Wrench className="h-3 w-3" />
            What We Do
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: "#f8fafc" }}
          >
            Our Services
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            We don't just build websites — we build your entire online presence so
            customers can find you, trust you, and call you.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="relative rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(30,64,175,0.06)" }}
                >
                  <service.icon className="h-5 w-5" style={{ color: "#1e40af" }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#0f172a" }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#64748b" }}>
                  {service.description}
                </p>
                <div className="mt-auto space-y-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} />
                      <span className="text-xs font-medium" style={{ color: "#475569" }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#f8fafc" }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-10 sm:p-14 text-center"
            style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <Star className="h-8 w-8 mx-auto mb-4" style={{ color: "#3b82f6" }} />
            <h2 className="text-3xl font-bold" style={{ color: "#f8fafc" }}>
              Flexible Pricing That Fits Your Budget
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
              We believe every business deserves a great website, regardless of size or budget.
              We'll work with you to find a plan that makes sense for your business. No hidden
              fees, no long-term contracts — just honest pricing.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Small Business", desc: "Perfect for getting started" },
                { label: "Growing Business", desc: "Full online presence" },
                { label: "Established Business", desc: "Premium custom solution" },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-xl p-5"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
                >
                  <p className="font-semibold text-sm" style={{ color: "#f8fafc" }}>
                    {tier.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              Let's Talk About Your Project
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
