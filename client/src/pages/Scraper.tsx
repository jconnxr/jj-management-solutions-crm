import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

// ── OKC Metro Cities ─────────────────────────────────────────────────────────
const OKC_METRO_CITIES = [
  "Oklahoma City",
  "Edmond",
  "Norman",
  "Moore",
  "Midwest City",
  "Del City",
  "Yukon",
  "Mustang",
  "Bethany",
  "Warr Acres",
  "The Village",
  "Nichols Hills",
  "Choctaw",
  "Harrah",
  "Jones",
  "Luther",
  "Piedmont",
  "Tuttle",
  "Newcastle",
  "Blanchard",
  "Noble",
  "Purcell",
  "Shawnee",
  "Tecumseh",
  "El Reno",
  "Guthrie",
];

// ── Industry Presets ─────────────────────────────────────────────────────────
const INDUSTRY_PRESETS = [
  "Plumber",
  "Electrician",
  "HVAC Contractor",
  "Roofer",
  "Landscaper",
  "Fencing Contractor",
  "Concrete Contractor",
  "Painter",
  "Handyman",
  "Pest Control",
  "Cleaning Service",
  "Pressure Washing",
  "Junk Removal",
  "Auto Detailing",
  "Moving Company",
  "Flooring Contractor",
  "Garage Door Repair",
  "Tree Service",
  "Lawn Care",
  "Pool Service",
];

export default function Scraper() {
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());

  const { data: jobs, isLoading: jobsLoading } = trpc.scraper.jobs.useQuery();
  const utils = trpc.useUtils();

  const searchMutation = trpc.scraper.search.useMutation({
    onSuccess: (result) => {
      utils.scraper.jobs.invalidate();
      utils.leads.list.invalidate();
      utils.dashboard.stats.invalidate();
      toast.success(
        `Scraped ${result.totalFound} businesses across ${result.cityResults.length} cities — ${result.leadsCreated} new leads without websites added`
      );
    },
    onError: (err) => {
      utils.scraper.jobs.invalidate();
      toast.error(`Scrape failed: ${err.message}`);
    },
  });

  const toggleCity = (city: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  };

  const selectAllCities = () => {
    if (selectedCities.size === OKC_METRO_CITIES.length) {
      setSelectedCities(new Set());
    } else {
      setSelectedCities(new Set(OKC_METRO_CITIES));
    }
  };

  const handleSearch = () => {
    if (!selectedIndustry) {
      toast.error("Please select an industry");
      return;
    }
    if (selectedCities.size === 0) {
      toast.error("Please select at least one city");
      return;
    }
    searchMutation.mutate({
      industry: selectedIndustry,
      cities: Array.from(selectedCities),
      state: "OK",
    });
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lead Scraper</h1>
        <p className="text-muted-foreground mt-1">
          Find businesses without websites in the OKC metro area. Select an industry and cities, then scrape.
        </p>
      </div>

      {/* Industry Selection */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">1. Select Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_PRESETS.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                  selectedIndustry === industry
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
          {selectedIndustry && (
            <p className="mt-3 text-sm text-primary">
              Selected: <span className="font-semibold">{selectedIndustry}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* City Selection */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">2. Select Cities</CardTitle>
          <Button variant="outline" size="sm" onClick={selectAllCities}>
            {selectedCities.size === OKC_METRO_CITIES.length ? "Deselect All" : "Select All OKC Metro"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {OKC_METRO_CITIES.map((city) => (
              <label
                key={city}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                  selectedCities.has(city)
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-secondary/30 border-border hover:border-primary/20 text-muted-foreground"
                }`}
              >
                <Checkbox
                  checked={selectedCities.has(city)}
                  onCheckedChange={() => toggleCity(city)}
                />
                {city}
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {selectedCities.size} of {OKC_METRO_CITIES.length} cities selected
          </p>
        </CardContent>
      </Card>

      {/* Scrape Button */}
      <Button
        onClick={handleSearch}
        disabled={searchMutation.isPending || !selectedIndustry || selectedCities.size === 0}
        size="lg"
        className="w-full"
      >
        {searchMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Scraping {selectedCities.size} cities... (this may take a few minutes)
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Scrape "{selectedIndustry || "..."}" across {selectedCities.size} cities
          </>
        )}
      </Button>

      {/* Latest Results */}
      {searchMutation.data && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base text-primary">Latest Scrape Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{searchMutation.data.totalFound}</p>
                <p className="text-xs text-muted-foreground">Businesses Found</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{searchMutation.data.leadsCreated}</p>
                <p className="text-xs text-muted-foreground">New Leads (No Website)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{searchMutation.data.totalSkippedHasWebsite}</p>
                <p className="text-xs text-muted-foreground">Had Website</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{searchMutation.data.totalSkippedDuplicate}</p>
                <p className="text-xs text-muted-foreground">Duplicates Skipped</p>
              </div>
            </div>

            {/* Per-City Breakdown */}
            <div>
              <h4 className="text-sm font-medium mb-2">City Breakdown</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Found</TableHead>
                      <TableHead className="text-right">No Website</TableHead>
                      <TableHead className="text-right">Duplicates</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchMutation.data.cityResults.map((cr) => (
                      <TableRow key={cr.city}>
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {cr.city}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">{cr.found}</TableCell>
                        <TableCell className="text-right text-sm">{cr.noWebsite}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{cr.duplicates}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-primary">{cr.created}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scrape History */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Scrape History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Industry</TableHead>
                  <TableHead>Cities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Found</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !jobs || jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No scrape jobs yet. Run your first search above.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium text-sm">{job.query}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {statusIcon(job.status)}
                          <span className="text-xs capitalize">{job.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{job.totalFound}</TableCell>
                      <TableCell className="text-sm font-medium text-primary">{job.leadsCreated}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
