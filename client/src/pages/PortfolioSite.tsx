import { useParams } from "wouter";
import { ArrowLeft } from "lucide-react";

// Portfolio site URLs - S3 CDN URLs for the static HTML files
const PORTFOLIO_SITES: Record<string, { title: string; industry: string; url: string }> = {
  "summit-plumbing": {
    title: "Summit Plumbing Co.",
    industry: "Plumbing",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/portfolio-summit-plumbing_a3d0388c.html",
  },
  "ironclad-concrete": {
    title: "Ironclad Concrete",
    industry: "Concrete",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/portfolio-ironclad-concrete_45b6c961.html",
  },
  "pristine-auto-detail": {
    title: "Pristine Auto Detail",
    industry: "Auto Detailing",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663258854199/h6cag4yZseQ24Sa6JcBbXo/portfolio-pristine-auto-detail_1edaeeda.html",
  },
};

export default function PortfolioSite() {
  const { slug } = useParams<{ slug: string }>();
  const site = slug ? PORTFOLIO_SITES[slug] : null;

  if (!site || !site.url) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#ffffff" }}>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "#0f172a" }}>
            Portfolio site not found
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium"
            style={{ color: "#1e40af" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to J&J Management Solutions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "#0f172a" }}>
      {/* Top bar */}
      <div
        className="h-12 flex items-center justify-between px-4 shrink-0"
        style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <a
            href="/#portfolio"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#93c5fd" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
          <span className="text-xs" style={{ color: "#475569" }}>|</span>
          <span className="text-sm font-semibold" style={{ color: "#f8fafc" }}>
            {site.title}
          </span>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}
          >
            {site.industry}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs" style={{ color: "#64748b" }}>
            Sample website by J&J Management Solutions
          </span>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        src={site.url}
        className="flex-1 w-full border-0"
        title={`${site.title} - Portfolio Preview`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
