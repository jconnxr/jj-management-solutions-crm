import { useEffect } from "react";
import { Link } from "wouter";
import {
  Phone,
  Users,
  Heart,
  Shield,
  Zap,
  ArrowRight,
  MapPin,
} from "lucide-react";
import PublicLayout, { JOHN_HEADSHOT, JACOB_HEADSHOT } from "@/components/PublicLayout";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Us | J&J Management Solutions";
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
            <Users className="h-3 w-3" />
            Who We Are
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: "#f8fafc" }}
          >
            Two Oklahoma Guys Who Get It
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            We know what it's like to run a business. We started J&J Management Solutions
            because too many hardworking business owners were losing customers simply
            because they didn't have a website.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* John */}
            <div
              className="rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <div className="relative inline-block mb-5">
                <img
                  src={JOHN_HEADSHOT}
                  alt="John Conner"
                  className="w-40 h-40 rounded-full object-cover mx-auto"
                  style={{ border: "4px solid #e2e8f0" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                >
                  J
                </div>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                John Conner
              </h2>
              <p className="text-sm font-semibold mt-1" style={{ color: "#3b82f6" }}>
                Co-Founder
              </p>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Born and raised in Oklahoma, John brings a hands-on approach to every project.
                He believes every business owner deserves a professional online presence,
                regardless of their budget. John handles client relationships and makes sure
                every project exceeds expectations.
              </p>
              <a
                href="tel:+14053123681"
                className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-md"
                style={{ color: "#1e40af", background: "rgba(30,64,175,0.06)" }}
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
                  className="w-40 h-40 rounded-full object-cover mx-auto"
                  style={{ border: "4px solid #e2e8f0" }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                >
                  J
                </div>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                Jacob Foreman
              </h2>
              <p className="text-sm font-semibold mt-1" style={{ color: "#3b82f6" }}>
                Co-Founder
              </p>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Jacob is passionate about helping small businesses compete with the big guys.
                He handles the technical side, making sure every website is fast, mobile-friendly,
                and built to convert visitors into customers. Jacob turns ideas into professional
                websites that actually work.
              </p>
              <a
                href="tel:+14056530112"
                className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-md"
                style={{ color: "#1e40af", background: "rgba(30,64,175,0.06)" }}
              >
                <Phone className="h-3.5 w-3.5" />
                (405) 653-0112
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "#0f172a" }}
            >
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Oklahoma Roots",
                text: "We're local. We understand the OKC market and the businesses that make it great. We're not some out-of-state agency — we're your neighbors.",
              },
              {
                icon: Shield,
                title: "Honest Pricing",
                text: "We work with businesses of all sizes and budgets. No hidden fees, no surprises. We'll always be upfront about what things cost.",
              },
              {
                icon: Zap,
                title: "Real Results",
                text: "Our websites aren't just pretty — they're built to bring in phone calls and customers. If it doesn't help your business grow, we're not doing our job.",
              },
            ].map((val) => (
              <div
                key={val.title}
                className="rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-md"
                style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "rgba(30,64,175,0.06)" }}
                >
                  <val.icon className="h-6 w-6" style={{ color: "#1e40af" }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "#0f172a" }}>
                  {val.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {val.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serving Area */}
      <section className="py-16 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <MapPin className="h-6 w-6 shrink-0 mt-0.5" style={{ color: "#1e40af" }} />
            <div>
              <p className="font-bold text-lg" style={{ color: "#0f172a" }}>
                Proudly Serving the OKC Metro Area
              </p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "#64748b" }}>
                Oklahoma City, Edmond, Norman, Moore, Yukon, Mustang, Midwest City, Del City,
                Bethany, Warr Acres, and all surrounding communities. We work with businesses
                across the metro — if you're in Oklahoma, we'd love to help.
              </p>
            </div>
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
            Let's Talk About Your Business
          </h2>
          <p className="mt-3 text-base" style={{ color: "#94a3b8" }}>
            No pressure, no commitment. Just a conversation about how we can help.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              Get In Touch
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
