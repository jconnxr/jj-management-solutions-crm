import { useEffect } from "react";
import { Link } from "wouter";
import {
  Star,
  ExternalLink,
  Wrench,
  Shield,
  ArrowRight,
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

const portfolioItems = [
  {
    title: "Summit Plumbing Co.",
    industry: "PLUMBING",
    template: "Clean & Trustworthy",
    description:
      "A clean, professional website for a plumbing company. Builds trust with a light design, clear service listings, and prominent call-to-action.",
    href: "/portfolio/summit-plumbing",
    icon: Wrench,
    gradient: "linear-gradient(135deg, #1e40af, #2563eb)",
    tagColor: "#1e40af",
    tagBg: "rgba(30,64,175,0.08)",
  },
  {
    title: "Ironclad Concrete",
    industry: "CONCRETE",
    template: "Rugged & Professional",
    description:
      "A bold, industrial website for a concrete contractor. Dark theme with strong typography that commands authority and trust.",
    href: "/portfolio/ironclad-concrete",
    icon: Shield,
    gradient: "linear-gradient(135deg, #292524, #44403c)",
    tagColor: "#dc2626",
    tagBg: "rgba(220,38,38,0.08)",
  },
  {
    title: "Pristine Auto Detail",
    industry: "AUTO DETAILING",
    template: "Minimal & Sleek",
    description:
      "A sleek, minimal website for a mobile detailing business. Modern design with clean lines and sophisticated typography.",
    href: "/portfolio/pristine-auto-detail",
    icon: Star,
    gradient: "linear-gradient(135deg, #171717, #374151)",
    tagColor: "#6366f1",
    tagBg: "rgba(99,102,241,0.08)",
  },
];

export default function PortfolioPage() {
  useEffect(() => {
    document.title = "Portfolio | J&J Management Solutions";
    return () => { document.title = "J&J Management Solutions CRM"; };
  }, []);

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
            <Star className="h-3 w-3" />
            Our Work
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: "#f8fafc" }}
          >
            Sample Websites We've Built
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            Every website is custom-designed for the business and industry. Here are a few
            examples of what we can build for you.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div
                  className="h-52 relative overflow-hidden"
                  style={{ background: item.gradient }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <item.icon className="h-12 w-12 mx-auto mb-3 opacity-80" />
                      <p className="text-xl font-bold">{item.title}</p>
                      <p className="text-xs opacity-70 mt-1">{item.industry}</p>
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
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: item.tagBg, color: item.tagColor }}
                    >
                      {item.industry}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "#f1f5f9", color: "#64748b" }}
                    >
                      {item.template}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: "#0f172a" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: "#64748b" }}>
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm mb-2" style={{ color: "#64748b" }}>
              These are sample sites. Yours will be custom-built for your business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold" style={{ color: "#f8fafc" }}>
            Want Something Like This for Your Business?
          </h2>
          <p className="mt-3 text-base" style={{ color: "#94a3b8" }}>
            Let's build a website that's custom-made for your industry and brand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
            style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
          >
            Get a Free Consultation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
