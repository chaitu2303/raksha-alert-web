import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { MapPin, X, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/20 text-yellow-500" },
  reviewing: { label: "Reviewing", className: "bg-blue-500/20 text-blue-400" },
  approved: { label: "Approved", className: "bg-green-500/20 text-green-400" },
  rejected: { label: "Rejected", className: "bg-primary/20 text-primary" },
  resolved: { label: "Resolved", className: "bg-green-500/20 text-green-400" },
};

const AdminReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase
        .from("incident_reports")
        .select("*, profiles!incident_reports_user_id_profiles_fkey(display_name)")
        .order("reported_at", { ascending: false });
      if (data) setReports(data);
    };
    fetchReports();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("incident_reports").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
      return;
    }
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({ title: `Report ${status}`, description: `The incident report has been marked as ${status}.` });
  };

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Incident Reports ({reports.length})
          </h2>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "reviewing", "approved", "rejected", "resolved"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filter === s ? "default" : "outline"}
                onClick={() => setFilter(s)}
                className="capitalize"
              >
                {s === "all" ? `All (${reports.length})` : `${s} (${reports.filter((r) => r.status === s).length})`}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No reports match this filter.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((r: any) => (
              <Card key={r.id} className="gradient-card border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {r.image_url && (
                      <img
                        src={r.image_url}
                        alt=""
                        className="w-full md:w-40 h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(r.image_url)}
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">{r.title}</h3>
                        <Badge className={statusConfig[r.status]?.className || statusConfig.pending.className}>
                          {statusConfig[r.status]?.label || r.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                      {r.location_name && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {r.location_name}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground">
                        By {r.profiles?.display_name || "Unknown"} · {new Date(r.reported_at).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "reviewing")}>
                              <Clock className="h-3.5 w-3.5 mr-1.5" /> Review
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(r.id, "approved")}>
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "rejected")}>
                              <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                            </Button>
                          </>
                        )}
                        {r.status === "reviewing" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(r.id, "approved")}>
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "rejected")}>
                              <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                            </Button>
                          </>
                        )}
                        {(r.status === "approved" || r.status === "reviewing") && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "resolved")}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-foreground" onClick={() => setSelectedImage(null)}>
            <X className="h-8 w-8" />
          </button>
          <img src={selectedImage} alt="Evidence" className="max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;
