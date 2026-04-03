import { useState } from "react";
import { Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSOS = async () => {
    if (!user) return;
    setSending(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });

      const { error } = await supabase.from("sos_alerts").insert({
        user_id: user.id,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        message: "Emergency SOS",
      });

      if (error) throw error;
      toast({ title: "🚨 SOS Alert Sent!", description: "Emergency services have been notified with your location." });
    } catch (err: any) {
      toast({
        title: "SOS Failed",
        description: err.message || "Could not send SOS. Please enable location access.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <button
          onClick={handleSOS}
          disabled={sending}
          className="relative h-28 w-28 rounded-full gradient-emergency shadow-glow flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Radio className="h-10 w-10 text-primary-foreground" />
          {sending && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping" />
          )}
        </button>
        <p className="mt-4 font-bold text-foreground text-lg">SOS Emergency</p>
        <p className="text-sm text-muted-foreground">Tap to send emergency alert with your location</p>
      </CardContent>
    </Card>
  );
};

export default SOSButton;
