import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import LocationPicker from "@/components/LocationPicker";

const categories = ["general", "fire", "accident", "crime", "natural_disaster", "medical", "other"];
const severities = ["low", "medium", "high"];

const PostAlert = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    severity: "medium",
    location_name: "",
    image_url: "",
  });
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("alerts").insert({
        title: form.title,
        description: form.description,
        category: form.category,
        severity: form.severity,
        location_name: form.location_name,
        latitude: latitude,
        longitude: longitude,
        image_url: form.image_url || null,
        created_by: user.id,
      });
      if (error) throw error;
      toast({ title: "Alert posted!", description: "The alert has been broadcast to all users." });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <DashboardLayout>
      <Card className="max-w-2xl mx-auto gradient-card border-border">
        <CardHeader><CardTitle>Post New Alert</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Alert title" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the emergency..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <select value={form.severity} onChange={(e) => set("severity", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {severities.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alert Location</Label>
              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
                onLocationNameChange={(name) => set("location_name", name)}
              />
            </div>
            <div className="space-y-2">
              <Label>Location Name</Label>
              <Input value={form.location_name} onChange={(e) => set("location_name", e.target.value)} placeholder="e.g. Main Campus Gate" />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting..." : "Broadcast Alert"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PostAlert;
