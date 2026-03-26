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
import { ArrowLeft, Mail, Phone, Globe, User, Building } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  reviewed: "bg-blue-500/15 text-blue-400",
  approved: "bg-green-500/15 text-green-400",
  archived: "bg-gray-500/15 text-gray-400",
};

export default function IntakeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const intakeId = parseInt(id ?? "0");

  const { data: intake, isLoading } = trpc.intake.getById.useQuery(
    { id: intakeId },
    { enabled: intakeId > 0 }
  );
  const utils = trpc.useUtils();

  const updateStatus = trpc.intake.updateStatus.useMutation({
    onSuccess: () => {
      utils.intake.getById.invalidate({ id: intakeId });
      utils.intake.list.invalidate();
      utils.dashboard.stats.invalidate();
      toast.success("Status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const createProject = trpc.projects.create.useMutation({
    onSuccess: (result) => {
      toast.success("Project created from intake");
      setLocation(`/projects/${result.id}`);
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

  if (!intake) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Intake form not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/intake")}>
          Back to Intake
        </Button>
      </div>
    );
  }

  const infoRow = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return (
      <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-border/30 last:border-0">
        <span className="text-sm font-medium text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/intake")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{intake.businessName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-xs capitalize ${statusColors[intake.status] ?? ""}`}>
                {intake.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Submitted {new Date(intake.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={intake.status}
            onValueChange={(v: any) => updateStatus.mutate({ id: intakeId, status: v })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={() =>
              createProject.mutate({
                intakeId: intakeId,
                projectName: `${intake.businessName} Website`,
                clientName: intake.contactName,
                description: intake.desiredFeatures ?? undefined,
              })
            }
            disabled={createProject.isPending}
          >
            {createProject.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {infoRow("Name", intake.contactName)}
            {infoRow("Email", intake.contactEmail)}
            {infoRow("Phone", intake.contactPhone)}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-4 w-4" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {infoRow("Business Name", intake.businessName)}
            {infoRow("Business Type", intake.businessType)}
            {infoRow("Current Website", intake.currentWebsite)}
            {infoRow("Budget", intake.budget)}
            {infoRow("Timeline", intake.timeline)}
          </CardContent>
        </Card>

        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Project Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {infoRow("Desired Features", intake.desiredFeatures)}
            {infoRow("Target Audience", intake.targetAudience)}
            {infoRow("Competitors", intake.competitors)}
            {infoRow("Additional Notes", intake.additionalNotes)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
