import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, FolderKanban } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  planning: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  design: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  development: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  review: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  revision: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  completed: "bg-green-500/15 text-green-400 border-green-500/20",
  on_hold: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/15 text-gray-400",
  medium: "bg-blue-500/15 text-blue-400",
  high: "bg-amber-500/15 text-amber-400",
  urgent: "bg-red-500/15 text-red-400",
};

export default function Projects() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    clientName: "",
    description: "",
    priority: "medium" as const,
    quotedPrice: "",
  });

  const { data, isLoading } = trpc.projects.list.useQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const utils = trpc.useUtils();

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      utils.dashboard.stats.invalidate();
      setShowAddDialog(false);
      setForm({ projectName: "", clientName: "", description: "", priority: "medium", quotedPrice: "" });
      toast.success("Project created");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Track website development projects for your clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="revision">Revision</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !data || data.projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No projects yet. Create one from a client intake or manually.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.projects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer hover:bg-accent/30"
                      onClick={() => setLocation(`/projects/${project.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{project.projectName}</p>
                          {project.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{project.clientName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs capitalize ${statusColors[project.status] ?? ""}`}>
                          {project.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs capitalize ${priorityColors[project.priority] ?? ""}`}>
                          {project.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {project.quotedPrice ? `$${project.quotedPrice.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Project Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Project Name *</Label>
              <Input
                value={form.projectName}
                onChange={(e) => setForm((p) => ({ ...p, projectName: e.target.value }))}
                placeholder="e.g. Smith's Plumbing Website"
              />
            </div>
            <div>
              <Label>Client Name *</Label>
              <Input
                value={form.clientName}
                onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief project description"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v: any) => setForm((p) => ({ ...p, priority: v }))}
                >
                  <SelectTrigger>
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
              <div>
                <Label>Quoted Price</Label>
                <Input
                  value={form.quotedPrice}
                  onChange={(e) => setForm((p) => ({ ...p, quotedPrice: e.target.value }))}
                  placeholder="2500"
                  type="number"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                createProject.mutate({
                  ...form,
                  quotedPrice: form.quotedPrice ? parseFloat(form.quotedPrice) : undefined,
                })
              }
              disabled={!form.projectName || !form.clientName || createProject.isPending}
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
