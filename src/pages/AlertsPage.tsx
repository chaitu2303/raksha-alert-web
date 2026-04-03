import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Eye, X, Loader2 } from "lucide-react";
import { AlertsSkeleton } from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import type { Tables } from "@/integrations/supabase/types";

const severityColors: Record<string, string> = {
  high: "bg-primary/20 text-primary",
  medium: "bg-yellow-500/20 text-yellow-500",
  low: "bg-green-500/20 text-green-400",
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Tables<"alerts">[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (data) setAlerts(data);
      setLoading(false);
    };
    fetchAlerts();

    const channel = supabase
      .channel("alerts-page")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        setAlerts((prev) => [payload.new as Tables<"alerts">, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>All Alerts</h2>
        {loading ? (
          <AlertsSkeleton />
        ) : alerts.length === 0 ? (
          <p className="text-muted-foreground">No alerts posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="gradient-card border-border overflow-hidden">
                {alert.image_url && (
                  <div className="relative cursor-pointer" onClick={() => setSelectedImage(alert.image_url)}>
                    <img src={alert.image_url} alt={alert.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-background/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Eye className="h-8 w-8 text-foreground" />
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{alert.title}</CardTitle>
                    <Badge className={severityColors[alert.severity] || severityColors.medium}>{alert.severity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {alert.location_name && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alert.location_name}</span>
                    )}
                    <span>{new Date(alert.created_at).toLocaleString()}</span>
                    <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen image modal */}
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

export default AlertsPage;
