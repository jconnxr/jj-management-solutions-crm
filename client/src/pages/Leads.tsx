import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Globe,
  Phone,
  ArrowUpDown,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

const dispositionColors: Record<string, string> = {
  new: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  contacted: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  qualified: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  proposal: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  won: "bg-green-500/15 text-green-400 border-green-500/20",
  lost: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function Leads() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [disposition, setDisposition] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("leadScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLead, setNewLead] = useState({
    businessName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    industry: "",
    source: "manual" as const,
    hasNoWebsite: true,
  });

  const filters = useMemo(
    () => ({
      search: search || undefined,
      disposition: disposition !== "all" ? disposition : undefined,
      industry: industry !== "all" ? industry : undefined,
      sortBy,
      sortOrder,
      limit: 200,
    }),
    [search, disposition, industry, sortBy, sortOrder]
  );

  const { data, isLoading } = trpc.leads.list.useQuery(filters);
  const { data: industries } = trpc.leads.industries.useQuery();
  const utils = trpc.useUtils();

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      utils.leads.list.invalidate();
      utils.leads.industries.invalidate();
      utils.dashboard.stats.invalidate();
      setShowAddDialog(false);
      setNewLead({
        businessName: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        industry: "",
        source: "manual",
        hasNoWebsite: true,
      });
      toast.success("Lead created successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  // Group leads by industry for the summary bar
  const industryCounts = useMemo(() => {
    if (!data?.leads) return {};
    const counts: Record<string, number> = {};
    data.leads.forEach((lead) => {
      const ind = lead.industry || "Unknown";
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return counts;
  }, [data?.leads]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            {data?.total ?? 0} total leads
            {industry !== "all" && ` in ${industry}`}
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Industry Quick Filter Chips */}
      {industries && industries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIndustry("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              industry === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
            }`}
          >
            All ({data?.total ?? 0})
          </button>
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(ind === industry ? "all" : ind)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                industry === ind
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
              }`}
            >
              {ind} {industryCounts[ind] ? `(${industryCounts[ind]})` : ""}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={disposition} onValueChange={setDisposition}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[200px]">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries?.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">
                    <button
                      onClick={() => toggleSort("businessName")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Business
                      {sortBy === "businessName" && <ArrowUpDown className="h-3 w-3" />}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("industry")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Industry
                      {sortBy === "industry" && <ArrowUpDown className="h-3 w-3" />}
                    </button>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Pain Point</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data?.leads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No leads found. Try adjusting your filters or scrape for new leads.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-accent/30"
                      onClick={() => setLocation(`/leads/${lead.id}`)}
                    >
                      <TableCell>
                        <p className="font-medium text-sm">
                          {lead.businessName}
                        </p>
                      </TableCell>
                      <TableCell>
                        {lead.industry ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                          >
                            {lead.industry}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.hasNoWebsite && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-400 border-red-500/20"
                            >
                              <Globe className="h-2.5 w-2.5 mr-1" />
                              No Site
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${dispositionColors[lead.disposition] ?? ""}`}
                        >
                          {lead.disposition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lead.phone && (
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Lead Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Business Name *</Label>
              <Input
                value={newLead.businessName}
                onChange={(e) =>
                  setNewLead((p) => ({ ...p, businessName: e.target.value }))
                }
                placeholder="e.g. Joe's Plumbing"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="joe@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input
                  value={newLead.city}
                  onChange={(e) =>
                    setNewLead((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="Oklahoma City"
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={newLead.state}
                  onChange={(e) =>
                    setNewLead((p) => ({ ...p, state: e.target.value }))
                  }
                  placeholder="OK"
                />
              </div>
            </div>
            <div>
              <Label>Industry / Business Type</Label>
              <Input
                value={newLead.industry}
                onChange={(e) =>
                  setNewLead((p) => ({ ...p, industry: e.target.value }))
                }
                placeholder="e.g. Plumbing, HVAC, Landscaping"
              />
            </div>
            <div>
              <Label>Source</Label>
              <Select
                value={newLead.source}
                onValueChange={(v: any) =>
                  setNewLead((p) => ({ ...p, source: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="google_maps">Google Maps</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="cold_call">Cold Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createLead.mutate(newLead)}
              disabled={!newLead.businessName || createLead.isPending}
            >
              {createLead.isPending ? "Creating..." : "Create Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
