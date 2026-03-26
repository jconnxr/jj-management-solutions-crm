import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  Globe,
  ArrowRight,
  Search,
  Users,
  FolderKanban,
  FileText,
  BarChart3,
  Phone,
  Zap,
  Target,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">J&J Management</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => setLocation("/dashboard")}>
                Dashboard
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => (window.location.href = getLoginUrl())}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
            <Zap className="h-3.5 w-3.5" />
            Lead Generation & Project Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find Businesses.
            <br />
            <span className="text-primary">Build Websites.</span>
            <br />
            Grow Together.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            J&J Management Solutions helps small businesses establish their online presence.
            Our CRM streamlines lead generation, client intake, and project delivery from
            prospecting to launch.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => setLocation("/dashboard")} className="shadow-lg shadow-primary/20">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => (window.location.href = getLoginUrl())} className="shadow-lg shadow-primary/20">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything You Need to Scale
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From finding leads to delivering finished websites, our platform covers the entire sales and project lifecycle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Google Maps Scraper",
                description:
                  "Automatically find businesses without websites in your target area. Filter by industry and location.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: Target,
                title: "Lead Scoring",
                description:
                  "Leads are automatically scored based on pain points like no website, low reviews, and poor booking flow.",
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                icon: Phone,
                title: "Call Tracking",
                description:
                  "Log every call with outcomes and notes. Track your outreach history with each lead.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: Users,
                title: "Lead Pipeline",
                description:
                  "Move leads through stages from new to contacted, qualified, proposal, and won. Never lose track.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: FileText,
                title: "Client Intake",
                description:
                  "Capture project requirements with structured intake forms. Budget, timeline, features, and more.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
              },
              {
                icon: FolderKanban,
                title: "Project Tracking",
                description:
                  "Track website builds from planning through design, development, review, and delivery.",
                color: "text-orange-400",
                bg: "bg-orange-500/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all group"
              >
                <div
                  className={`h-10 w-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-3">
              A streamlined workflow from prospecting to project delivery.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Scrape & Discover",
                description:
                  "Search Google Maps for businesses in your target area and industry. The scraper identifies businesses without websites and other pain points automatically.",
              },
              {
                step: "02",
                title: "Qualify & Reach Out",
                description:
                  "Review scored leads, prioritize by pain point severity, and begin outreach. Log calls, track outcomes, and add notes for your partner to see.",
              },
              {
                step: "03",
                title: "Intake & Scope",
                description:
                  "When a lead is interested, capture their requirements with the intake form. Budget, timeline, desired features, and competitors are all documented.",
              },
              {
                step: "04",
                title: "Build & Deliver",
                description:
                  "Create a project from the intake, track it through design and development stages, and deliver a professional website that grows their business.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border/50"
              >
                <div className="text-3xl font-extrabold text-primary/30 shrink-0 w-12">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Find Your Next Client?
          </h2>
          <p className="text-muted-foreground mt-3">
            Start scraping leads and building your pipeline today.
          </p>
          <div className="mt-8">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => setLocation("/dashboard")} className="shadow-lg shadow-primary/20">
                Open Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => (window.location.href = getLoginUrl())} className="shadow-lg shadow-primary/20">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">J&J Management Solutions</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Helping small businesses build their online presence.
          </p>
        </div>
      </footer>
    </div>
  );
}
