import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  User,
  Building2,
  Phone,
  Mail,
  Wrench,
  Palette,
  Layout,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Truck,
  Activity,
  Edit3,
  Save,
  X,
} from "lucide-react";

const STATUS_PIPELINE = [
  { value: "draft", label: "Draft", icon: FileText },
  { value: "in_review", label: "In Review", icon: Clock },
  { value: "approved", label: "Approved", icon: CheckCircle2 },
  { value: "in_progress", label: "In Progress", icon: AlertCircle },
  { value: "delivered", label: "Delivered", icon: Truck },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-300",
  in_review: "bg-amber-100 text-amber-700 border-amber-300",
  approved: "bg-blue-100 text-blue-700 border-blue-300",
  in_progress: "bg-purple-100 text-purple-700 border-purple-300",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-300",
  on_hold: "bg-red-100 text-red-600 border-red-300",
};

export default function PacketDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = Number(params.id);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const { data, isLoading, refetch } = trpc.packets.getById.useQuery(
    { id },
    { enabled: !isNaN(id) }
  );

  const utils = trpc.useUtils();

  const updateStatusMutation = trpc.packets.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated!");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.packets.update.useMutation({
    onSuccess: () => {
      toast.success("Packet updated!");
      setEditing(false);
      refetch();
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
        <p className="text-muted-foreground">Packet not found</p>
      </div>
    );
  }

  const { packet, activities } = data;

  const startEdit = () => {
    setEditForm({
      operatorNotes: packet.operatorNotes ?? "",
      assignedTo: packet.assignedTo ?? "",
      templateFamily: packet.templateFamily ?? "",
      stylePreset: packet.stylePreset ?? "",
      ctaRecommendation: packet.ctaRecommendation ?? "",
    });
    setEditing(true);
  };

  const saveEdit = () => {
    updateMutation.mutate({
      id: packet.id,
      operatorNotes: editForm.operatorNotes || undefined,
      assignedTo: editForm.assignedTo || undefined,
      templateFamily: editForm.templateFamily || undefined,
      stylePreset: editForm.stylePreset || undefined,
      ctaRecommendation: editForm.ctaRecommendation || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/packets")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {packet.businessName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {packet.installType.replace(/_/g, " ")} · Created {new Date(packet.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {!editing ? (
          <button
            onClick={startEdit}
            className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={updateMutation.isPending}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        )}
      </div>

      {/* Status Pipeline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4">Status Pipeline</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_PIPELINE.map((stage, idx) => {
            const isActive = packet.status === stage.value;
            const isPast = STATUS_PIPELINE.findIndex(s => s.value === packet.status) > idx;
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.value}
                onClick={() => {
                  if (stage.value !== packet.status) {
                    updateStatusMutation.mutate({ id: packet.id, status: stage.value as any });
                  }
                }}
                disabled={updateStatusMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? STATUS_COLORS[stage.value] + " border-2"
                    : isPast
                    ? "bg-muted/50 text-muted-foreground border-transparent"
                    : "bg-transparent text-muted-foreground/50 border-dashed border-border hover:border-primary/30 hover:text-muted-foreground"
                }`}
              >
                <StageIcon className="w-4 h-4" />
                {stage.label}
              </button>
            );
          })}
          {/* On Hold toggle */}
          {packet.status !== "on_hold" ? (
            <button
              onClick={() => updateStatusMutation.mutate({ id: packet.id, status: "on_hold" })}
              disabled={updateStatusMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-red-200 text-red-400 text-sm font-medium hover:border-red-400 hover:text-red-500 transition-all shrink-0"
            >
              <Pause className="w-4 h-4" /> Hold
            </button>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 border-2 border-red-300 text-sm font-medium shrink-0">
              <Pause className="w-4 h-4" /> On Hold
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Client Info
          </h2>
          <div className="space-y-3">
            <InfoRow icon={Building2} label="Business" value={packet.businessName} />
            <InfoRow icon={Wrench} label="Industry" value={packet.industry} />
            <InfoRow icon={User} label="Contact" value={packet.contactName} />
            <InfoRow icon={Phone} label="Phone" value={packet.contactPhone} />
            <InfoRow icon={Mail} label="Email" value={packet.contactEmail} />
          </div>
        </div>

        {/* Install Spec */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layout className="w-4 h-4 text-primary" />
            Install Specification
          </h2>
          <div className="space-y-3">
            <InfoRow icon={Wrench} label="Install Type" value={packet.installType?.replace(/_/g, " ")} />
            {editing ? (
              <>
                <EditRow label="Template Family" value={editForm.templateFamily ?? ""} onChange={v => setEditForm(p => ({ ...p, templateFamily: v }))} />
                <EditRow label="Style Preset" value={editForm.stylePreset ?? ""} onChange={v => setEditForm(p => ({ ...p, stylePreset: v }))} />
                <EditRow label="CTA" value={editForm.ctaRecommendation ?? ""} onChange={v => setEditForm(p => ({ ...p, ctaRecommendation: v }))} />
                <EditRow label="Assigned To" value={editForm.assignedTo ?? ""} onChange={v => setEditForm(p => ({ ...p, assignedTo: v }))} />
              </>
            ) : (
              <>
                <InfoRow icon={Palette} label="Template" value={packet.templateFamily?.replace(/_/g, " ")} />
                <InfoRow icon={Palette} label="Style" value={packet.stylePreset} />
                <InfoRow icon={FileText} label="CTA" value={packet.ctaRecommendation} />
                <InfoRow icon={User} label="Assigned" value={packet.assignedTo} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Operator Notes */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Operator Notes
        </h2>
        {editing ? (
          <textarea
            value={editForm.operatorNotes ?? ""}
            onChange={e => setEditForm(p => ({ ...p, operatorNotes: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="Add notes about this packet..."
          />
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {packet.operatorNotes || "No notes yet."}
          </p>
        )}
      </div>

      {/* Activity Trail */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Activity Trail
        </h2>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {activities.map(act => (
              <div key={act.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground">
                    <span className="font-medium">{act.performedBy}</span>{" "}
                    <span className="text-muted-foreground">{act.details}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {new Date(act.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

function EditRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
      />
    </div>
  );
}
