import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  reviewed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  approved: "bg-green-500/15 text-green-400 border-green-500/20",
  archived: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

export default function Intake() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    businessName: "",
    businessType: "",
    currentWebsite: "",
    desiredFeatures: "",
    targetAudience: "",
    competitors: "",
    budget: "",
    timeline: "",
    additionalNotes: "",
  });

  const { data, isLoading } = trpc.intake.list.useQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const utils = trpc.useUtils();

  const createIntake = trpc.intake.create.useMutation({
    onSuccess: () => {
      utils.intake.list.invalidate();
      utils.dashboard.stats.invalidate();
      setShowAddDialog(false);
      setForm({
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        businessName: "",
        businessType: "",
        currentWebsite: "",
        desiredFeatures: "",
        targetAudience: "",
        competitors: "",
        budget: "",
        timeline: "",
        additionalNotes: "",
      });
      toast.success("Intake form submitted");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Intake</h1>
          <p className="text-muted-foreground mt-1">
            Capture and manage project requirements from clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Intake
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !data || data.intakes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No intake forms yet.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.intakes.map((intake) => (
                    <TableRow
                      key={intake.id}
                      className="cursor-pointer hover:bg-accent/30"
                      onClick={() => setLocation(`/intake/${intake.id}`)}
                    >
                      <TableCell className="font-medium text-sm">{intake.businessName}</TableCell>
                      <TableCell className="text-sm">{intake.contactName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{intake.businessType || "—"}</TableCell>
                      <TableCell className="text-sm">{intake.budget || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{intake.timeline || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs capitalize ${statusColors[intake.status] ?? ""}`}>
                          {intake.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(intake.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Intake Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Client Intake Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Contact Name *</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label>Business Name *</Label>
                <Input
                  value={form.businessName}
                  onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
                  placeholder="Smith's Plumbing"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  value={form.contactEmail}
                  onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label>Business Type</Label>
                <Input
                  value={form.businessType}
                  onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value }))}
                  placeholder="Plumbing, HVAC, etc."
                />
              </div>
            </div>
            <div>
              <Label>Current Website (if any)</Label>
              <Input
                value={form.currentWebsite}
                onChange={(e) => setForm((p) => ({ ...p, currentWebsite: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Desired Features</Label>
              <Textarea
                value={form.desiredFeatures}
                onChange={(e) => setForm((p) => ({ ...p, desiredFeatures: e.target.value }))}
                placeholder="What features does the client need? (e.g., booking system, contact form, gallery, etc.)"
                rows={3}
              />
            </div>
            <div>
              <Label>Target Audience</Label>
              <Textarea
                value={form.targetAudience}
                onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                placeholder="Who are their ideal customers?"
                rows={2}
              />
            </div>
            <div>
              <Label>Competitors</Label>
              <Textarea
                value={form.competitors}
                onChange={(e) => setForm((p) => ({ ...p, competitors: e.target.value }))}
                placeholder="Any competitors they want to reference?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Budget Range</Label>
                <Select
                  value={form.budget}
                  onValueChange={(v) => setForm((p) => ({ ...p, budget: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                    <SelectItem value="$1,000 - $2,500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="$2,500 - $5,000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="$10,000+">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Timeline</Label>
                <Select
                  value={form.timeline}
                  onValueChange={(v) => setForm((p) => ({ ...p, timeline: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={form.additionalNotes}
                onChange={(e) => setForm((p) => ({ ...p, additionalNotes: e.target.value }))}
                placeholder="Any other relevant information..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createIntake.mutate(form)}
              disabled={!form.contactName || !form.businessName || createIntake.isPending}
            >
              {createIntake.isPending ? "Submitting..." : "Submit Intake"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
