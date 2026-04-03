import { useEffect, useState } from "react";
import { AlertTriangle, Users, FileText, Radio, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  reviewing: "bg-blue-500/20 text-blue-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-primary/20 text-primary",
  resolved: "bg-green-500/20 text-green-400",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ alerts: 0, reports: 0, sos: 0, users: 0, pendingReports: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [alertsRes, reportsRes, sosRes, profilesRes, pendingRes] = await Promise.all([
        supabase.from("alerts").select("id", { count: "exact" }),
        supabase.from("incident_reports").select("id", { count: "exact" }),
        supabase.from("sos_alerts").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("incident_reports").select("id", { count: "exact" }).eq("status", "pending"),
      ]);
      setStats({
        alerts: alertsRes.count || 0,
        reports: reportsRes.count || 0,
        sos: sosRes.count || 0,
        users: profilesRes.count || 0,
        pendingReports: pendingRes.count || 0,
      });

      const [reportsData, alertsData] = await Promise.all([
        supabase
          .from("incident_reports")
          .select("*, profiles!incident_reports_user_id_profiles_fkey(display_name)")
          .order("reported_at", { ascending: false })
          .limit(5),
        supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (reportsData.data) setRecentReports(reportsData.data);
      if (alertsData.data) setRecentAlerts(alertsData.data);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Alerts", value: stats.alerts, icon: AlertTriangle, color: "text-primary" },
    { label: "Incident Reports", value: stats.reports, icon: FileText, color: "text-accent" },
    { label: "Pending Review", value: stats.pendingReports, icon: Clock, color: "text-yellow-500" },
    { label: "SOS Alerts", value: stats.sos, icon: Radio, color: "text-orange-500" },
    { label: "Registered Users", value: stats.users, icon: Users, color: "text-green-400" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Admin Dashboard</h2>
          <Button onClick={() => navigate("/admin/post-alert")} className="gradient-emergency">
            + Post Alert
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="gradient-card border-border">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`p-2.5 rounded-xl bg-secondary ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent reports */}
          <Card className="gradient-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Incident Reports</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/reports")}>
                  View All →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground text-sm">No incident reports yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((r: any) => (
                    <div key={r.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{r.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          By {r.profiles?.display_name || "Unknown"} · {new Date(r.reported_at).toLocaleString()}
                        </p>
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Alerts</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/post-alert")}>
                  + New Alert
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground text-sm">No alerts posted yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((a: any) => (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.severity === 'high' ? 'text-primary' : a.severity === 'medium' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{a.title}</p>
                        {a.location_name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {a.location_name}
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{a.severity}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
