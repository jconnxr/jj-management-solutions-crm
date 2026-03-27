import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Inbox,
  Brain,
  ArrowRightCircle,
  Archive,
  RefreshCw,
  ChevronRight,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "classified", label: "Classified" },
  { value: "converted", label: "Converted" },
  { value: "archived", label: "Archived" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  classified: "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-500",
};

const URGENCY_ICONS: Record<string, { icon: typeof Zap; color: string }> = {
  asap: { icon: Zap, color: "text-red-500" },
  this_month: { icon: AlertTriangle, color: "text-amber-500" },
  next_few_months: { icon: Clock, color: "text-blue-500" },
  just_exploring: { icon: Eye, color: "text-slate-400" },
};

export default function IntakeQueue() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const { data, isLoading, refetch } = trpc.intakeSubmissions.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const convertMutation = trpc.intakeSubmissions.convertToLead.useMutation({
    onSuccess: (result) => {
      toast.success("Converted to lead successfully!");
      refetch();
      setLocation(`/leads/${result.leadId}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const archiveMutation = trpc.intakeSubmissions.archive.useMutation({
    onSuccess: () => {
      toast.success("Submission archived.");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const reclassifyMutation = trpc.intakeSubmissions.reclassify.useMutation({
    onSuccess: () => {
      toast.success("Re-classification started. Refresh in a moment.");
      setTimeout(() => refetch(), 3000);
    },
    onError: (err) => toast.error(err.message),
  });

  const submissions = data?.submissions ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            Intake Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submissions from the public QR intake form, auto-classified by Alfred
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {data?.total ?? 0} total submissions
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl">
          <Inbox className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No submissions yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Share your QR code or intake link to start receiving submissions
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(sub => {
            const urgencyInfo = URGENCY_ICONS[sub.urgency ?? "just_exploring"];
            const UrgencyIcon = urgencyInfo?.icon ?? Clock;
            return (
              <div
                key={sub.id}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {sub.businessName}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] ?? STATUS_COLORS.new}`}>
                        {sub.status}
                      </span>
                      {sub.urgency && (
                        <UrgencyIcon className={`w-4 h-4 ${urgencyInfo?.color ?? "text-slate-400"}`} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sub.ownerName} · {sub.industry ?? "No industry"} · {sub.city ?? "Unknown city"}, {sub.state ?? "OK"}
                    </p>
                    <p className="text-sm text-muted-foreground/80 mt-1 line-clamp-2">
                      {sub.biggestChallenge}
                    </p>
                    {sub.currentOnlinePresence && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                        {sub.currentOnlinePresence.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {sub.status === "new" && (
                      <button
                        onClick={() => reclassifyMutation.mutate({ id: sub.id })}
                        disabled={reclassifyMutation.isPending}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Classify with Alfred"
                      >
                        <Brain className="w-4 h-4" />
                      </button>
                    )}
                    {sub.status === "classified" && (
                      <button
                        onClick={() => reclassifyMutation.mutate({ id: sub.id })}
                        disabled={reclassifyMutation.isPending}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Re-classify"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    {(sub.status === "new" || sub.status === "classified") && (
                      <>
                        <button
                          onClick={() => convertMutation.mutate({ id: sub.id })}
                          disabled={convertMutation.isPending}
                          className="p-2 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-600 hover:text-emerald-700"
                          title="Convert to Lead"
                        >
                          <ArrowRightCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => archiveMutation.mutate({ id: sub.id })}
                          disabled={archiveMutation.isPending}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setLocation(`/intake-queue/${sub.id}`)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-2 text-xs text-muted-foreground/60">
                  Submitted {new Date(sub.createdAt).toLocaleString()}
                  {sub.monthlyBudget && ` · Budget: ${sub.monthlyBudget}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
