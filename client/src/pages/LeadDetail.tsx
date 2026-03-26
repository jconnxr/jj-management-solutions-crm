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
  Loader2,
  Copy,
  Check,
  Sparkles,
  Eye,
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

const websiteStatusColors: Record<string, string> = {
  generating: "bg-amber-500/15 text-amber-400",
  ready: "bg-emerald-500/15 text-emerald-400",
  sent: "bg-cyan-500/15 text-cyan-400",
  approved: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const leadId = parseInt(id ?? "0");

  const { data: lead, isLoading } = trpc.leads.getById.useQuery({ id: leadId }, { enabled: leadId > 0 });
  const { data: calls } = trpc.calls.list.useQuery({ leadId }, { enabled: leadId > 0 });
  const { data: notesList } = trpc.notes.list.useQuery({ leadId }, { enabled: leadId > 0 });
  const { data: websites } = trpc.websites.listByLead.useQuery({ leadId }, { enabled: leadId > 0 });

  const utils = trpc.useUtils();

  // Call dialog state
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callForm, setCallForm] = useState({
    calledBy: "",
    outcome: "no_answer" as string,
    summary: "",
  });

  // Note state
  const [noteForm, setNoteForm] = useState({ authorName: "", content: "" });

  // Generate website dialog state
  const [showGenDialog, setShowGenDialog] = useState(false);
  const [genForm, setGenForm] = useState({
    services: "",
    aboutInfo: "",
  });

  // Copy state
  const [copiedId, setCopiedId] = useState<number | null>(null);

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

  const generateWebsite = trpc.websites.generate.useMutation({
    onSuccess: (data) => {
      utils.websites.listByLead.invalidate({ leadId });
      setShowGenDialog(false);
      setGenForm({ services: "", aboutInfo: "" });
      toast.success("Website generated! Copy the link to share.");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCopyLink = (website: { id: number; previewToken: string }) => {
    const previewUrl = `${window.location.origin}/preview/${website.previewToken}`;
    navigator.clipboard.writeText(previewUrl);
    setCopiedId(website.id);
    toast.success("Preview link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

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
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => {
              // Pre-fill services from industry if available
              setGenForm({
                services: lead.industry ?? "",
                aboutInfo: "",
              });
              setShowGenDialog(true);
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Website
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowCallDialog(true)}>
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

          {/* Generated Websites */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Generated Websites ({websites?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {websites && websites.length > 0 ? (
                websites.map((site) => (
                  <div
                    key={site.id}
                    className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs capitalize ${websiteStatusColors[site.status] ?? ""}`}>
                        {site.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(site.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {site.status === "ready" || site.status === "sent" || site.status === "approved" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleCopyLink(site)}
                        >
                          {copiedId === site.id ? (
                            <><Check className="h-3 w-3 mr-1" /> Copied!</>
                          ) : (
                            <><Copy className="h-3 w-3 mr-1" /> Copy Link</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/preview/${site.previewToken}`, "_blank")}
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </div>
                    ) : site.status === "generating" ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating...
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No websites generated yet. Click "Generate Website" above to create one.
                </p>
              )}
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
                            <span className="text-sm font-medium">{call.calledBy}</span>
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
                    onClick={() => createNote.mutate({ leadId, ...noteForm })}
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
                onValueChange={(v) => setCallForm((p) => ({ ...p, outcome: v }))}
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
              onClick={() => createCall.mutate({ leadId, ...callForm, outcome: callForm.outcome as any })}
              disabled={!callForm.calledBy || createCall.isPending}
            >
              {createCall.isPending ? "Saving..." : "Log Call"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Website Dialog */}
      <Dialog open={showGenDialog} onOpenChange={setShowGenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Website for {lead.businessName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will generate a professional website preview using the lead's data. You can then copy the link and share it on a phone call.
            </p>
            <div>
              <Label>Business Name</Label>
              <Input value={lead.businessName} disabled className="bg-secondary/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Location</Label>
                <Input
                  value={[lead.city, lead.state].filter(Boolean).join(", ") || lead.address || ""}
                  disabled
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={lead.phone ?? ""} disabled className="bg-secondary/50" />
              </div>
            </div>
            <div>
              <Label>Services (comma-separated) *</Label>
              <Input
                value={genForm.services}
                onChange={(e) => setGenForm((p) => ({ ...p, services: e.target.value }))}
                placeholder="e.g. Drain Cleaning, Water Heater Repair, Pipe Installation"
              />
              <p className="text-xs text-muted-foreground mt-1">
                List the main services this business offers
              </p>
            </div>
            <div>
              <Label>About Info (optional)</Label>
              <Textarea
                value={genForm.aboutInfo}
                onChange={(e) => setGenForm((p) => ({ ...p, aboutInfo: e.target.value }))}
                placeholder="e.g. Family-owned business serving the area for 15 years..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                generateWebsite.mutate({
                  leadId,
                  businessName: lead.businessName,
                  serviceType: lead.industry ?? undefined,
                  services: genForm.services || undefined,
                  location: [lead.city, lead.state].filter(Boolean).join(", ") || lead.address || undefined,
                  phone: lead.phone ?? undefined,
                  aboutInfo: genForm.aboutInfo || undefined,
                });
              }}
              disabled={generateWebsite.isPending}
            >
              {generateWebsite.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Generate Website</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
