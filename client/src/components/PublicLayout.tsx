import { Link, useLocation } from "wouter";
import { Phone, Menu, X, Globe } from "lucide-react";
import { useState } from "react";

const JOHN_HEADSHOT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/john-conner-headshot_44e6bbef.jpeg";
const JACOB_HEADSHOT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/jacob-foreman-headshot_dacc8d1c.jpeg";

export { JOHN_HEADSHOT, JACOB_HEADSHOT };

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ffffff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif" }}>
      {/* ============================================================ */}
      {/* NAVIGATION */}
      {/* ============================================================ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
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
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: location === link.href ? "#1e40af" : "#475569",
                  background: location === link.href ? "rgba(30,64,175,0.06)" : "transparent",
                }}
              >
                {link.label}
              </Link>
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
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: location === link.href ? "#1e40af" : "#475569" }}
              >
                {link.label}
              </Link>
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

      {/* Page content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer
        className="py-12 px-4"
        style={{
          background: "#0f172a",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                >
                  J&J
                </div>
                <p className="font-semibold text-sm" style={{ color: "#f8fafc" }}>
                  J&J Management Solutions
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Helping Oklahoma businesses build professional websites that bring in more customers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "#f8fafc" }}>
                Quick Links
              </p>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm transition-colors hover:text-white"
                    style={{ color: "#94a3b8" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "#f8fafc" }}>
                Contact Us
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" style={{ color: "#3b82f6" }} />
                  <a href="tel:+14053123681" className="text-sm" style={{ color: "#94a3b8" }}>
                    John: (405) 312-3681
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" style={{ color: "#3b82f6" }} />
                  <a href="tel:+14056530112" className="text-sm" style={{ color: "#94a3b8" }}>
                    Jacob: (405) 653-0112
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" style={{ color: "#3b82f6" }} />
                  <span className="text-sm" style={{ color: "#94a3b8" }}>
                    Oklahoma City Metro Area
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-8 pt-6 text-center text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#475569" }}
          >
            &copy; {new Date().getFullYear()} J&J Management Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
