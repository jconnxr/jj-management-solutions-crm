import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  Brain,
  ArrowRightCircle,
  Archive,
  RefreshCw,
  User,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Zap,
  Target,
  Lightbulb,
  BarChart3,
} from "lucide-react";

const PRESENCE_LABELS: Record<string, string> = {
  no_website: "No website",
  outdated_website: "Outdated website",
  no_google: "Not on Google",
  few_reviews: "Few or no reviews",
  no_social: "No social media",
  other: "Other",
};

const URGENCY_LABELS: Record<string, string> = {
  asap: "ASAP",
  this_month: "This month",
  next_few_months: "Next few months",
  just_exploring: "Just exploring",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  classified: "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-500",
};

export default function IntakeSubmissionDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = Number(params.id);

  const { data, isLoading, refetch } = trpc.intakeSubmissions.getById.useQuery(
    { id },
    { enabled: !isNaN(id) }
  );

  const convertMutation = trpc.intakeSubmissions.convertToLead.useMutation({
    onSuccess: (result) => {
      toast.success("Converted to lead!");
      setLocation(`/leads/${result.leadId}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const archiveMutation = trpc.intakeSubmissions.archive.useMutation({
    onSuccess: () => {
      toast.success("Archived.");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const reclassifyMutation = trpc.intakeSubmissions.reclassify.useMutation({
    onSuccess: () => {
      toast.success("Re-classification started.");
      setTimeout(() => refetch(), 3000);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
        <div className="h-64 bg-muted/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Submission not found</p>
      </div>
    );
  }

  const { submission: sub, classification } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/intake-queue")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {sub.businessName}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] ?? ""}`}>
                {sub.status}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Submitted {new Date(sub.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {(sub.status === "new" || sub.status === "classified") && (
            <>
              <button
                onClick={() => reclassifyMutation.mutate({ id: sub.id })}
                disabled={reclassifyMutation.isPending}
                className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5 text-muted-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {sub.status === "new" ? "Classify" : "Re-classify"}
              </button>
              <button
                onClick={() => convertMutation.mutate({ id: sub.id })}
                disabled={convertMutation.isPending}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <ArrowRightCircle className="w-3.5 h-3.5" />
                Convert to Lead
              </button>
              <button
                onClick={() => archiveMutation.mutate({ id: sub.id })}
                disabled={archiveMutation.isPending}
                className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5 text-muted-foreground"
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
            </>
          )}
          {sub.status === "converted" && sub.leadId && (
            <button
              onClick={() => setLocation(`/leads/${sub.leadId}`)}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              View Lead <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Contact Information
          </h2>
          <div className="space-y-3">
            <InfoRow icon={User} label="Owner" value={sub.ownerName} />
            <InfoRow icon={Building2} label="Business" value={sub.businessName} />
            <InfoRow icon={Phone} label="Phone" value={sub.phone} />
            <InfoRow icon={Mail} label="Email" value={sub.email} />
            <InfoRow icon={Globe} label="Website" value={sub.website} />
            <InfoRow icon={MapPin} label="Location" value={[sub.city, sub.state].filter(Boolean).join(", ") || null} />
            <InfoRow icon={Target} label="Industry" value={sub.industry} />
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Business Details
          </h2>
          <div className="space-y-3">
            <InfoRow
              icon={Globe}
              label="Online Presence"
              value={sub.currentOnlinePresence ? PRESENCE_LABELS[sub.currentOnlinePresence] ?? sub.currentOnlinePresence : null}
            />
            <InfoRow
              icon={Clock}
              label="Urgency"
              value={sub.urgency ? URGENCY_LABELS[sub.urgency] ?? sub.urgency : null}
            />
            <InfoRow icon={BarChart3} label="Budget" value={sub.monthlyBudget} />
            <InfoRow icon={Zap} label="How Heard" value={sub.howHeard} />
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-1">Biggest Challenge</p>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {sub.biggestChallenge}
            </p>
          </div>
        </div>
      </div>

      {/* Alfred Classification */}
      {classification && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Alfred's Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/70 dark:bg-background/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Bottleneck Type</p>
              <p className="font-semibold text-foreground text-sm">
                {classification.bottleneckType.replace(/_/g, " ")}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-background/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Suggested Install</p>
              <p className="font-semibold text-foreground text-sm">
                {classification.suggestedInstallType.replace(/_/g, " ")}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-background/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Priority Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (classification.priorityScore ?? 50) >= 70
                        ? "bg-red-500"
                        : (classification.priorityScore ?? 50) >= 40
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${classification.priorityScore ?? 50}%` }}
                  />
                </div>
                <span className="font-bold text-foreground text-sm">
                  {classification.priorityScore ?? 50}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-background/50 rounded-lg p-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1">Summary</p>
            <p className="text-sm text-foreground">{classification.bottleneckSummary}</p>
          </div>

          {classification.reasoning && (
            <div className="bg-white/70 dark:bg-background/50 rounded-lg p-3 mb-3">
              <p className="text-xs text-muted-foreground mb-1">Reasoning</p>
              <p className="text-sm text-muted-foreground">{classification.reasoning}</p>
            </div>
          )}

          {classification.suggestedTemplateFamily && (
            <div className="bg-white/70 dark:bg-background/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Suggested Template</p>
              <p className="text-sm font-medium text-foreground">
                {classification.suggestedTemplateFamily.replace(/_/g, " ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}
