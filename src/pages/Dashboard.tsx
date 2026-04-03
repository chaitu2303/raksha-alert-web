import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, FileText, Radio, Loader2 } from "lucide-react";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import SOSButton from "@/components/SOSButton";
import type { Tables } from "@/integrations/supabase/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  reviewing: "bg-blue-500/20 text-blue-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-primary/20 text-primary",
  resolved: "bg-green-500/20 text-green-400",
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Tables<"alerts">[]>([]);
  const [reports, setReports] = useState<Tables<"incident_reports">[]>([]);
  const [reportsCount, setReportsCount] = useState(0);
  const [sosCount, setSosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [alertsRes, reportsRes, sosRes, myReports] = await Promise.all([
        supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("incident_reports").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("sos_alerts").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("incident_reports").select("*").eq("user_id", user.id).order("reported_at", { ascending: false }).limit(5),
      ]);
      if (alertsRes.data) setAlerts(alertsRes.data);
      setReportsCount(reportsRes.count || 0);
      setSosCount(sosRes.count || 0);
      if (myReports.data) setReports(myReports.data);
      setLoading(false);
    };
    fetchData();

    const channel = supabase
      .channel("dashboard-alerts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        setAlerts((prev) => [payload.new as Tables<"alerts">, ...prev].slice(0, 5));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const stats = [
    { label: "Active Alerts", value: alerts.length, icon: AlertTriangle, color: "text-primary" },
    { label: "My Reports", value: reportsCount, icon: FileText, color: "text-accent" },
    { label: "SOS Sent", value: sosCount, icon: Radio, color: "text-yellow-500" },
  ];

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="gradient-card border-border">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-secondary ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SOSButton />
          <Card className="gradient-card border-border">
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard/report")}>
                <FileText className="h-4 w-4 mr-2" /> Report an Incident
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard/map")}>
                <MapPin className="h-4 w-4 mr-2" /> View Alert Map
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard/alerts")}>
                <AlertTriangle className="h-4 w-4 mr-2" /> View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My incident reports */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">My Incident Reports</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/report")}>
                + New Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground text-sm">You haven't submitted any reports yet.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/dashboard/report")}>
                  Report an Incident
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {r.location_name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {r.location_name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.reported_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge className={statusColors[r.status] || statusColors.pending}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card className="gradient-card border-border">
          <CardHeader><CardTitle className="text-lg">Recent Alerts</CardTitle></CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground text-sm">No alerts yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${alert.severity === 'high' ? 'text-primary' : alert.severity === 'medium' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {alert.location_name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {alert.location_name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {alert.image_url && (
                      <img src={alert.image_url} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
