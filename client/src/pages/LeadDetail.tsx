import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Globe,
  Star,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const dispositionColors: Record<string, string> = {
  new: "bg-emerald-500/15 text-emerald-400",
  contacted: "bg-amber-500/15 text-amber-400",
  qualified: "bg-violet-500/15 text-violet-400",
  proposal: "bg-cyan-500/15 text-cyan-400",
  won: "bg-green-500/15 text-green-400",
  lost: "bg-red-500/15 text-red-400",
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const leadId = parseInt(id ?? "0");

  const { data: lead, isLoading } = trpc.leads.getById.useQuery({ id: leadId }, { enabled: leadId > 0 });
  const { data: calls } = trpc.calls.list.useQuery({ leadId }, { enabled: leadId > 0 });
  const { data: notesList } = trpc.notes.list.useQuery({ leadId }, { enabled: leadId > 0 });

  const utils = trpc.useUtils();

  // Call dialog state
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callForm, setCallForm] = useState({
    calledBy: "",
    outcome: "no_answer" as const,
    summary: "",
  });

  // Note state
  const [noteForm, setNoteForm] = useState({ authorName: "", content: "" });

  const updateLead = trpc.leads.update.useMutation({
    onSuccess: () => {
      utils.leads.getById.invalidate({ id: leadId });
      utils.leads.list.invalidate();
      utils.dashboard.stats.invalidate();
      toast.success("Lead updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteLead = trpc.leads.delete.useMutation({
    onSuccess: () => {
      utils.leads.list.invalidate();
      utils.dashboard.stats.invalidate();
      setLocation("/leads");
      toast.success("Lead deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const createCall = trpc.calls.create.useMutation({
    onSuccess: () => {
      utils.calls.list.invalidate({ leadId });
      setShowCallDialog(false);
      setCallForm({ calledBy: "", outcome: "no_answer", summary: "" });
      toast.success("Call logged");
    },
    onError: (err) => toast.error(err.message),
  });

  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => {
      utils.notes.list.invalidate({ leadId });
      setNoteForm({ authorName: "", content: "" });
      toast.success("Note added");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lead not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/leads")}>
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/leads")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{lead.businessName}</h1>
            <div className="flex items-center gap-2 mt-1">
              {lead.industry && (
                <span className="text-sm text-muted-foreground">{lead.industry}</span>
              )}
              <Badge variant="outline" className={`text-xs capitalize ${dispositionColors[lead.disposition] ?? ""}`}>
                {lead.disposition}
              </Badge>
              <span className="text-sm font-semibold text-primary">Score: {lead.leadScore}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowCallDialog(true)}>
            <Phone className="h-4 w-4 mr-2" />
            Log Call
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this lead and all associated data?")) {
                deleteLead.mutate({ id: leadId });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Lead info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{lead.address}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={lead.website} target="_blank" rel="noopener" className="hover:text-primary transition-colors flex items-center gap-1">
                    {lead.website} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {lead.googleRating != null && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>{lead.googleRating} ({lead.googleReviewCount} reviews)</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Pain Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: "hasNoWebsite", label: "No Website", active: lead.hasNoWebsite },
                { key: "hasLowReviews", label: "Low Reviews", active: lead.hasLowReviews },
                { key: "hasPoorBooking", label: "Poor Booking Flow", active: lead.hasPoorBooking },
                { key: "hasWeakCta", label: "Weak CTA", active: lead.hasWeakCta },
              ].map((pp) => (
                <button
                  key={pp.key}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    pp.active
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "bg-secondary/50 text-muted-foreground border border-transparent hover:border-border"
                  }`}
                  onClick={() =>
                    updateLead.mutate({ id: leadId, [pp.key]: !pp.active })
                  }
                >
                  {pp.active ? "✓ " : "○ "}
                  {pp.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Disposition</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={lead.disposition}
                onValueChange={(v: any) => updateLead.mutate({ id: leadId, disposition: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="calls" className="space-y-4">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="calls">Call History ({calls?.length ?? 0})</TabsTrigger>
              <TabsTrigger value="notes">Notes ({notesList?.length ?? 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="calls" className="space-y-4">
              {calls && calls.length > 0 ? (
                calls.map((call) => (
                  <Card key={call.id} className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {call.outcome.replace(/_/g, " ")}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              by {call.calledBy}
                            </span>
                          </div>
                          {call.summary && (
                            <p className="text-sm text-muted-foreground mt-2">{call.summary}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(call.callDate).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No calls logged yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card className="border-border/50">
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <Input
                      placeholder="Your name"
                      value={noteForm.authorName}
                      onChange={(e) => setNoteForm((p) => ({ ...p, authorName: e.target.value }))}
                    />
                    <div className="sm:col-span-3">
                      <Textarea
                        placeholder="Add a note..."
                        value={noteForm.content}
                        onChange={(e) => setNoteForm((p) => ({ ...p, content: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      createNote.mutate({ leadId, ...noteForm })
                    }
                    disabled={!noteForm.authorName || !noteForm.content || createNote.isPending}
                  >
                    {createNote.isPending ? "Adding..." : "Add Note"}
                  </Button>
                </CardContent>
              </Card>

              {notesList && notesList.length > 0 ? (
                notesList.map((note) => (
                  <Card key={note.id} className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-medium">{note.authorName}</span>
                          <p className="text-sm text-muted-foreground mt-1">{note.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No notes yet. Add one above.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Log Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Call - {lead.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Called By *</Label>
              <Input
                value={callForm.calledBy}
                onChange={(e) => setCallForm((p) => ({ ...p, calledBy: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label>Outcome *</Label>
              <Select
                value={callForm.outcome}
                onValueChange={(v: any) => setCallForm((p) => ({ ...p, outcome: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                  <SelectItem value="callback_scheduled">Callback Scheduled</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                  <SelectItem value="wrong_number">Wrong Number</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea
                value={callForm.summary}
                onChange={(e) => setCallForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder="Brief summary of the call..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createCall.mutate({ leadId, ...callForm })}
              disabled={!callForm.calledBy || createCall.isPending}
            >
              {createCall.isPending ? "Saving..." : "Log Call"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
