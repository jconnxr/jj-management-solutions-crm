import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  ExternalLink,
  FolderKanban,
} from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  planning: "bg-blue-500/15 text-blue-400",
  design: "bg-violet-500/15 text-violet-400",
  development: "bg-cyan-500/15 text-cyan-400",
  review: "bg-amber-500/15 text-amber-400",
  revision: "bg-orange-500/15 text-orange-400",
  completed: "bg-green-500/15 text-green-400",
  on_hold: "bg-gray-500/15 text-gray-400",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/15 text-gray-400",
  medium: "bg-blue-500/15 text-blue-400",
  high: "bg-amber-500/15 text-amber-400",
  urgent: "bg-red-500/15 text-red-400",
};

const statusSteps = [
  "planning",
  "design",
  "development",
  "review",
  "revision",
  "completed",
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const projectId = parseInt(id ?? "0");

  const { data: project, isLoading } = trpc.projects.getById.useQuery(
    { id: projectId },
    { enabled: projectId > 0 }
  );
  const utils = trpc.useUtils();

  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.getById.invalidate({ id: projectId });
      utils.projects.list.invalidate();
      utils.dashboard.stats.invalidate();
      toast.success("Project updated");
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

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(project.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.projectName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Client: {project.clientName}</span>
              <Badge
                variant="outline"
                className={`text-xs capitalize ${statusColors[project.status] ?? ""}`}
              >
                {project.status.replace(/_/g, " ")}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs capitalize ${priorityColors[project.priority] ?? ""}`}
              >
                {project.priority}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Status Pipeline */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Project Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {statusSteps.map((step, i) => {
              const isActive = step === project.status;
              const isPast = i < currentStepIndex;
              return (
                <button
                  key={step}
                  onClick={() =>
                    updateProject.mutate({ id: projectId, status: step as any })
                  }
                  className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium text-center transition-all border ${
                    isActive
                      ? "bg-primary/15 text-primary border-primary/30"
                      : isPast
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.description && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Description</span>
                <p className="text-sm mt-1">{project.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Priority</span>
                <div className="mt-1">
                  <Select
                    value={project.priority}
                    onValueChange={(v: any) =>
                      updateProject.mutate({ id: projectId, priority: v })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <div className="mt-1">
                  <Select
                    value={project.status}
                    onValueChange={(v: any) =>
                      updateProject.mutate({ id: projectId, status: v })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="revision">Revision</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financials & Dates */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financials & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Quoted Price</span>
                <p className="text-lg font-bold mt-1">
                  {project.quotedPrice ? `$${project.quotedPrice.toLocaleString()}` : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Created</span>
                <p className="text-sm mt-1">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Start Date
                </span>
                <p className="text-sm mt-1">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due Date
                </span>
                <p className="text-sm mt-1">
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
            {(project.previewUrl || project.liveUrl) && (
              <div className="space-y-2 pt-2 border-t border-border/30">
                {project.previewUrl && (
                  <a
                    href={project.previewUrl}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Preview URL
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 text-sm text-green-400 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Live URL
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
