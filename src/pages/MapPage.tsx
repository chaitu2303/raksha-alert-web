import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import type { Tables } from "@/integrations/supabase/types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const sosIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapPage = () => {
  const [alerts, setAlerts] = useState<Tables<"alerts">[]>([]);
  const [sosAlerts, setSosAlerts] = useState<Tables<"sos_alerts">[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [alertsRes, sosRes] = await Promise.all([
        supabase.from("alerts").select("*").not("latitude", "is", null),
        supabase.from("sos_alerts").select("*").eq("status", "active"),
      ]);
      if (alertsRes.data) setAlerts(alertsRes.data);
      if (sosRes.data) setSosAlerts(sosRes.data);
    };
    fetchData();
  }, []);

  const center: [number, number] = alerts.length > 0 && alerts[0].latitude && alerts[0].longitude
    ? [alerts[0].latitude, alerts[0].longitude]
    : [20.5937, 78.9629]; // Default: India

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Alert Map</h2>
        <div className="h-[calc(100vh-220px)] rounded-2xl overflow-hidden border border-border">
          <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {alerts.filter(a => a.latitude && a.longitude).map((alert) => (
              <Marker key={alert.id} position={[alert.latitude!, alert.longitude!]}>
                <Popup>
                  <div className="text-sm">
                    <strong>{alert.title}</strong>
                    <p>{alert.description}</p>
                    {alert.location_name && <p className="text-xs">{alert.location_name}</p>}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs underline"
                    >
                      Navigate →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
            {sosAlerts.map((sos) => (
              <Marker key={sos.id} position={[sos.latitude, sos.longitude]} icon={sosIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong className="text-red-500">🚨 SOS Alert</strong>
                    <p>{sos.message}</p>
                    <p className="text-xs">{new Date(sos.created_at).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapPage;
