import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const presetQueries = [
  "plumber",
  "electrician",
  "HVAC contractor",
  "landscaping",
  "roofing contractor",
  "auto repair",
  "cleaning service",
  "pest control",
  "painting contractor",
  "handyman",
  "moving company",
  "flooring contractor",
];

export default function Scraper() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5000");

  const { data: jobs, isLoading: jobsLoading } = trpc.scraper.jobs.useQuery();
  const utils = trpc.useUtils();

  const searchMutation = trpc.scraper.search.useMutation({
    onSuccess: (result) => {
      utils.scraper.jobs.invalidate();
      utils.leads.list.invalidate();
      utils.dashboard.stats.invalidate();
      toast.success(
        `Found ${result.totalFound} businesses, created ${result.leadsCreated} leads with pain points`
      );
    },
    onError: (err) => {
      utils.scraper.jobs.invalidate();
      toast.error(`Scrape failed: ${err.message}`);
    },
  });

  const handleSearch = () => {
    if (!query.trim() || !location.trim()) {
      toast.error("Please enter both a business type and location");
      return;
    }
    searchMutation.mutate({
      query: query.trim(),
      location: location.trim(),
      radius: parseInt(radius),
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
          Find businesses without websites on Google Maps and add them to your pipeline.
        </p>
      </div>

      {/* Search Form */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Search Google Maps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Business Type / Industry</Label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. plumber, HVAC, landscaping"
              />
            </div>
            <div>
              <Label>Location (lat,lng or address)</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 32.78,-96.80 or Dallas, TX"
              />
            </div>
            <div>
              <Label>Radius (meters)</Label>
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">2 km (~1.2 mi)</SelectItem>
                  <SelectItem value="5000">5 km (~3 mi)</SelectItem>
                  <SelectItem value="10000">10 km (~6 mi)</SelectItem>
                  <SelectItem value="20000">20 km (~12 mi)</SelectItem>
                  <SelectItem value="50000">50 km (~31 mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <Label className="text-xs text-muted-foreground">Quick Select Industry</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {presetQueries.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setQuery(preset)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                    query === preset
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending || !query.trim() || !location.trim()}
            className="w-full sm:w-auto"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scraping... (this may take a moment)
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search & Scrape
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Results */}
      {searchMutation.data && (
        <Card className="border-border/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base text-primary">Latest Scrape Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{searchMutation.data.totalFound}</p>
                <p className="text-xs text-muted-foreground">Businesses Found</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{searchMutation.data.leadsCreated}</p>
                <p className="text-xs text-muted-foreground">Leads Created</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">
                  {searchMutation.data.totalFound - searchMutation.data.leadsCreated}
                </p>
                <p className="text-xs text-muted-foreground">Already Had Website</p>
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
                  <TableHead>Query</TableHead>
                  <TableHead>Location</TableHead>
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
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
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
