import { useEffect } from "react";
import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  MapPin,
  Shield,
  Clock,
  Heart,
  Globe,
  BarChart3,
  Palette,
  Star,
  CheckCircle,
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

export default function LandingPage() {
  useEffect(() => {
    document.title = "J&J Management Solutions | Websites for Oklahoma Businesses";
    return () => { document.title = "J&J Management Solutions CRM"; };
  }, []);

  return (
    <PublicLayout>
      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section
        className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
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
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
              >
                Get a Free Consultation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <a
                href="tel:+14053123681"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ color: "#93c5fd", border: "1px solid rgba(147,197,253,0.3)", background: "rgba(59,130,246,0.08)" }}
              >
                <Phone className="h-4 w-4 mr-2" />
                (405) 312-3681
              </a>
            </div>

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
      {/* WHAT WE DO - Quick Overview */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Custom Websites", text: "Professional, mobile-friendly websites designed specifically for your business." },
              { icon: BarChart3, title: "Google Business", text: "Get found on Google Maps and local search results in your area." },
              { icon: Palette, title: "Brand & Logo", text: "Professional brand identity that looks great everywhere." },
              { icon: Star, title: "Review Management", text: "Get more 5-star reviews and manage your online reputation." },
              { icon: Phone, title: "Lead Generation", text: "Websites that turn visitors into phone calls and booked jobs." },
              { icon: CheckCircle, title: "Ongoing Support", text: "We maintain your site so you can focus on running your business." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(30,64,175,0.06)" }}
                >
                  <item.icon className="h-5 w-5" style={{ color: "#1e40af" }} />
                </div>
                <h3 className="font-semibold text-base mb-1" style={{ color: "#0f172a" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#64748b" }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: "#1e40af", background: "rgba(30,64,175,0.06)" }}
            >
              View All Services & Pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
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
                text: "Give us a call or fill out the form. We'll learn about your business, what you need, and how we can help. No pressure, no commitment.",
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
                    <div className="w-px h-16" style={{ background: "#cbd5e1" }} />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-bold" style={{ color: "#0f172a" }}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA BAND */}
      {/* ============================================================ */}
      <section
        className="py-16 px-4"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold" style={{ color: "#f8fafc" }}>
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-base" style={{ color: "#94a3b8" }}>
            Give us a call, shoot us a text, or fill out the form. We'll get back to you
            within 24 hours — usually much sooner.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              Contact Us
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ color: "#93c5fd", border: "1px solid rgba(147,197,253,0.3)", background: "rgba(59,130,246,0.08)" }}
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
