import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import ContactPage from "./pages/ContactPage";
import IntakeFormPage from "./pages/IntakeFormPage";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Scraper from "./pages/Scraper";
import IntakeQueue from "./pages/IntakeQueue";
import IntakeSubmissionDetail from "./pages/IntakeSubmissionDetail";
import Packets from "./pages/Packets";
import PacketDetail from "./pages/PacketDetail";
import WebsitePreview from "./pages/WebsitePreview";

function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/leads" component={Leads} />
        <Route path="/leads/:id" component={LeadDetail} />
        <Route path="/scraper" component={Scraper} />
        <Route path="/intake-queue" component={IntakeQueue} />
        <Route path="/intake-queue/:id" component={IntakeSubmissionDetail} />
        <Route path="/packets" component={Packets} />
        <Route path="/packets/:id" component={PacketDetail} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public landing pages */}
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/contact" component={ContactPage} />
      {/* Public QR intake form — no auth required */}
      <Route path="/intake" component={IntakeFormPage} />
      {/* Public preview route — no auth required */}
      <Route path="/preview/:token" component={WebsitePreview} />
      <Route path="/404" component={NotFound} />
      {/* CRM dashboard — requires auth */}
      <Route component={DashboardRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
