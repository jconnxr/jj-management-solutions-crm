import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Package,
  Plus,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Truck,
} from "lucide-react";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
  { value: "on_hold", label: "On Hold" },
];

const STATUS_CONFIG: Record<string, { color: string; icon: typeof FileText }> = {
  draft: { color: "bg-slate-100 text-slate-600", icon: FileText },
  in_review: { color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  in_progress: { color: "bg-purple-100 text-purple-700", icon: AlertCircle },
  delivered: { color: "bg-emerald-100 text-emerald-700", icon: Truck },
  on_hold: { color: "bg-red-100 text-red-600", icon: Pause },
};

export default function Packets() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data, isLoading } = trpc.packets.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const packets = data?.packets ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Install Packets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Structured work orders for client projects
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {data?.total ?? 0} total packets
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit flex-wrap">
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

      {/* Packets List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : packets.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No install packets yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Packets are created from leads or intake submissions
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {packets.map(packet => {
            const statusConf = STATUS_CONFIG[packet.status] ?? STATUS_CONFIG.draft;
            const StatusIcon = statusConf.icon;
            return (
              <button
                key={packet.id}
                onClick={() => setLocation(`/packets/${packet.id}`)}
                className="w-full bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {packet.businessName}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConf.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {packet.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {packet.installType.replace(/_/g, " ")}
                      {packet.industry && ` · ${packet.industry}`}
                      {packet.assignedTo && ` · Assigned: ${packet.assignedTo}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(packet.createdAt).toLocaleDateString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
