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
  MessageSquare,
  Send,
  Pencil,
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
  const [genStep, setGenStep] = useState<"template" | "details">("template");
  const [genForm, setGenForm] = useState({
    services: "",
    aboutInfo: "",
    templateId: "",
    ctaStyle: "",
  });

  // Copy state
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Follow-up text state
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [textCopied, setTextCopied] = useState(false);

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
      setGenForm({ services: "", aboutInfo: "", templateId: "", ctaStyle: "" });
      setGenStep("template");
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
                services: "",
                aboutInfo: "",
                templateId: "",
                ctaStyle: "",
              });
              setGenStep("template");
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
              <TabsTrigger value="followup">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Follow-Up Texts
              </TabsTrigger>
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

            <TabsContent value="followup" className="space-y-4">
              {(() => {
                const biz = lead.businessName;
                const previewLink = websites && websites.length > 0 && websites[0].previewToken
                  ? `${window.location.origin}/preview/${websites[0].previewToken}`
                  : "[website preview link]";

                const templates = [
                  {
                    id: "interested-website",
                    label: "Interested — Sending Website Preview",
                    icon: "\uD83C\uDF10",
                    color: "border-emerald-500/30 bg-emerald-500/5",
                    text: `Hey! This is [Your Name] from J&J Management Solutions. It was great speaking with you just now. As promised, here's the website preview I put together for ${biz}:\n\n${previewLink}\n\nTake a look when you get a chance and let me know what you think. Everything on it can be customized to fit exactly what you need. Looking forward to hearing your thoughts!`,
                  },
                  {
                    id: "schedule-meeting",
                    label: "Interested — Scheduling a Meeting",
                    icon: "\uD83D\uDCC5",
                    color: "border-blue-500/30 bg-blue-500/5",
                    text: `Hey! This is [Your Name] from J&J Management Solutions. Really enjoyed our conversation about ${biz}. I'd love to sit down and go over some ideas for how we can help grow your online presence.\n\nWould [Day] at [Time] work for a quick meeting? I can come to you or we can do a phone call — whatever's easiest.\n\nLooking forward to it!`,
                  },
                  {
                    id: "warm-not-ready",
                    label: "Warm — Not Ready Yet",
                    icon: "\u23F3",
                    color: "border-amber-500/30 bg-amber-500/5",
                    text: `Hey! This is [Your Name] from J&J Management Solutions. I appreciate you taking the time to chat today about ${biz}. I totally understand you're not looking to make any changes right now.\n\nI'll check back in with you down the road. In the meantime, if anything comes up or you have any questions about getting online, don't hesitate to reach out. Have a great rest of your day!`,
                  },
                  {
                    id: "voicemail-followup",
                    label: "Left Voicemail — First Touch",
                    icon: "\uD83D\uDCDE",
                    color: "border-violet-500/30 bg-violet-500/5",
                    text: `Hey! This is [Your Name] with J&J Management Solutions. I just tried giving you a call about ${biz}. We help local businesses like yours get set up with a professional website to bring in more customers.\n\nI'd love to chat for just a couple minutes when you get a chance. Feel free to call or text me back at this number. Have a great day!`,
                  },
                  {
                    id: "post-meeting",
                    label: "Post-Meeting — Next Steps",
                    icon: "\u2705",
                    color: "border-cyan-500/30 bg-cyan-500/5",
                    text: `Hey! This is [Your Name] from J&J Management Solutions. Thanks again for meeting with me today to talk about ${biz}. I'm excited about what we can put together for you.\n\nHere's what I'm going to get started on:\n- [Next step 1]\n- [Next step 2]\n\nI'll have something to show you by [timeline]. If you think of anything else in the meantime, just shoot me a text!`,
                  },
                  {
                    id: "follow-up-check-in",
                    label: "Follow-Up Check-In (After Sending Preview)",
                    icon: "\uD83D\uDC4B",
                    color: "border-pink-500/30 bg-pink-500/5",
                    text: `Hey! Just wanted to follow up on the website preview I sent over for ${biz}. Have you had a chance to take a look at it yet?\n\nIf you have any questions or want to make any changes, I'm happy to walk you through it. Just let me know!`,
                  },
                ];

                return (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Select a follow-up template below. The business name is auto-filled. Edit the text if needed, then copy to send.
                    </p>

                    {!selectedTemplate ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setSelectedTemplate(t.id);
                              setEditedText(t.text);
                              setTextCopied(false);
                            }}
                            className={`text-left rounded-lg border-2 p-4 transition-all hover:shadow-md ${t.color}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{t.icon}</span>
                              <h4 className="font-semibold text-sm">{t.label}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {t.text.split("\n")[0]}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              {templates.find((t) => t.id === selectedTemplate)?.label}
                            </CardTitle>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTemplate(null);
                                setEditedText("");
                                setTextCopied(false);
                              }}
                            >
                              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea
                            value={editedText}
                            onChange={(e) => {
                              setEditedText(e.target.value);
                              setTextCopied(false);
                            }}
                            rows={10}
                            className="font-mono text-sm leading-relaxed"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => {
                                navigator.clipboard.writeText(editedText);
                                setTextCopied(true);
                                toast.success("Follow-up text copied to clipboard!");
                                setTimeout(() => setTextCopied(false), 3000);
                              }}
                            >
                              {textCopied ? (
                                <><Check className="h-4 w-4 mr-2" /> Copied!</>
                              ) : (
                                <><Copy className="h-4 w-4 mr-2" /> Copy to Clipboard</>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const original = templates.find((t) => t.id === selectedTemplate)?.text ?? "";
                                setEditedText(original);
                                setTextCopied(false);
                                toast.info("Text reset to original template.");
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Replace [Your Name], [Day], [Time], and any other bracketed items before sending. The business name ({biz}) is already filled in.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })()}
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
      <Dialog open={showGenDialog} onOpenChange={(open) => { setShowGenDialog(open); if (!open) setGenStep("template"); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {genStep === "template" ? "Choose a Template" : "Website Details"}
            </DialogTitle>
          </DialogHeader>

          {genStep === "template" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a design template for {lead.businessName}. The suggested template is highlighted based on the industry.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "bold-modern", name: "Bold & Modern", desc: "Premium, high-end feel with dark backgrounds and geometric accents", colors: { primary: "#6366f1", secondary: "#1e1b4b", accent: "#f59e0b" }, best: "HVAC, Epoxy, Roofing" },
                  { id: "clean-trustworthy", name: "Clean & Trustworthy", desc: "Professional and reliable with soft shadows and clean layouts", colors: { primary: "#2563eb", secondary: "#f8fafc", accent: "#f59e0b" }, best: "Plumber, Electrician, Handyman" },
                  { id: "friendly-approachable", name: "Friendly & Approachable", desc: "Warm, inviting design with rounded corners and playful elements", colors: { primary: "#16a34a", secondary: "#f0fdf4", accent: "#f97316" }, best: "Cleaning, Pet Services, Lawn Care" },
                  { id: "rugged-professional", name: "Rugged & Professional", desc: "Strong, industrial feel with dark tones and bold typography", colors: { primary: "#d97706", secondary: "#1c1917", accent: "#f59e0b" }, best: "Concrete, Fencing, Junk Removal" },
                  { id: "minimal-sleek", name: "Minimal & Sleek", desc: "Ultra-clean, sophisticated design with maximum whitespace", colors: { primary: "#0f172a", secondary: "#ffffff", accent: "#6366f1" }, best: "Detailing, Dog Training, Food" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setGenForm((p) => ({ ...p, templateId: t.id }))}
                    className={"text-left rounded-lg border-2 p-4 transition-all hover:shadow-md " + (genForm.templateId === t.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.secondary, border: "1px solid #333" }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.accent }} />
                      </div>
                      {genForm.templateId === t.id && <Badge className="ml-auto text-xs">Selected</Badge>}
                    </div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">Best for: {t.best}</p>
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGenDialog(false)}>Cancel</Button>
                <Button onClick={() => setGenStep("details")} disabled={!genForm.templateId}>Next: Add Details</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fill in the details for the website. The more info you provide, the better the result.
              </p>
              <div>
                <Label>Business Name</Label>
                <Input value={lead.businessName} disabled className="bg-secondary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input value={[lead.city, lead.state].filter(Boolean).join(", ") || lead.address || ""} disabled className="bg-secondary/50" />
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
                <p className="text-xs text-muted-foreground mt-1">List the main services this business offers</p>
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
              <div>
                <Label>Call-to-Action Style</Label>
                <Select value={genForm.ctaStyle} onValueChange={(v) => setGenForm((p) => ({ ...p, ctaStyle: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choose a CTA style" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Get Your Free Estimate">Get Your Free Estimate</SelectItem>
                    <SelectItem value="Call Now">Call Now</SelectItem>
                    <SelectItem value="Book Online">Book Online</SelectItem>
                    <SelectItem value="Request a Quote">Request a Quote</SelectItem>
                    <SelectItem value="Schedule a Visit">Schedule a Visit</SelectItem>
                    <SelectItem value="Start Your Project Today">Start Your Project Today</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGenStep("template")}>Back</Button>
                <Button
                  onClick={() => {
                    generateWebsite.mutate({
                      leadId,
                      businessName: lead.businessName,
                      templateId: genForm.templateId,
                      ctaStyle: genForm.ctaStyle || "Get Your Free Estimate",
                      serviceType: lead.industry ?? undefined,
                      services: genForm.services || undefined,
                      location: [lead.city, lead.state].filter(Boolean).join(", ") || lead.address || undefined,
                      phone: lead.phone ?? undefined,
                      aboutInfo: genForm.aboutInfo || undefined,
                    });
                  }}
                  disabled={generateWebsite.isPending || !genForm.templateId}
                >
                  {generateWebsite.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Generate Website</>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
