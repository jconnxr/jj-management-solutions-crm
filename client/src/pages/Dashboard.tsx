import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserPlus,
  Phone,
  Target,
  FileText,
  Trophy,
  XCircle,
  FolderKanban,
  Inbox,
} from "lucide-react";
import { useLocation } from "wouter";

const statCards = [
  { key: "totalLeads", label: "Total Leads", icon: Users, color: "text-blue-400" },
  { key: "newLeads", label: "New Leads", icon: UserPlus, color: "text-emerald-400" },
  { key: "contacted", label: "Contacted", icon: Phone, color: "text-amber-400" },
  { key: "qualified", label: "Qualified", icon: Target, color: "text-violet-400" },
  { key: "proposals", label: "Proposals", icon: FileText, color: "text-cyan-400" },
  { key: "won", label: "Won", icon: Trophy, color: "text-green-400" },
  { key: "lost", label: "Lost", icon: XCircle, color: "text-red-400" },
] as const;

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your lead generation and project pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.key}
            className="bg-card hover:bg-accent/30 transition-colors cursor-pointer border-border/50"
            onClick={() => {
              setLocation("/leads");
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">
                  {stats?.[card.key] ?? 0}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setLocation("/scraper")}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Scrape New Leads</p>
                <p className="text-xs text-muted-foreground">
                  Find businesses without websites on Google Maps
                </p>
              </div>
            </button>
            <button
              onClick={() => setLocation("/leads")}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Manage Leads</p>
                <p className="text-xs text-muted-foreground">
                  View, filter, and update your lead pipeline
                </p>
              </div>
            </button>

          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "New", value: stats?.newLeads ?? 0, color: "bg-emerald-500" },
                  { label: "Contacted", value: stats?.contacted ?? 0, color: "bg-amber-500" },
                  { label: "Qualified", value: stats?.qualified ?? 0, color: "bg-violet-500" },
                  { label: "Proposal", value: stats?.proposals ?? 0, color: "bg-cyan-500" },
                  { label: "Won", value: stats?.won ?? 0, color: "bg-green-500" },
                ].map((stage) => {
                  const total = stats?.totalLeads ?? 1;
                  const pct = total > 0 ? (stage.value / total) * 100 : 0;
                  return (
                    <div key={stage.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{stage.label}</span>
                        <span className="font-medium">{stage.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stage.color} transition-all`}
                          style={{ width: `${Math.max(pct, 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
