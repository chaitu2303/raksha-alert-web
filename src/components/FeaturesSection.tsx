import { Siren, MapPin, FileWarning, Bell, Radio, Camera, Share2 } from "lucide-react";

const features = [
  { icon: Siren, title: "SOS Emergency Alert", desc: "One-tap panic button sends instant alerts with your location to emergency contacts and nearby users." },
  { icon: MapPin, title: "Live Location Tracking", desc: "Real-time GPS tracking allows contacts to monitor your location during emergencies." },
  { icon: FileWarning, title: "Incident Reporting", desc: "Report incidents with detailed descriptions, categories, and geolocation data." },
  { icon: Bell, title: "Push Notifications", desc: "Stay informed with real-time push notifications about nearby alerts and safety updates." },
  { icon: Radio, title: "Alert Broadcasting", desc: "Broadcast emergency alerts to all users in a defined radius for community-wide awareness." },
  { icon: Camera, title: "Visual Evidence Upload", desc: "Attach photos and videos to incident reports for more accurate documentation." },
  { icon: Share2, title: "Share Alerts via Social Media", desc: "Amplify emergency alerts by sharing them across social media platforms instantly." },
];

const FeaturesSection = () => (
  <section id="features" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-4">Features</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Powerful tools designed to keep you and your community safe</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {features.map((f, i) => (
          <div key={f.title} className={`gradient-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <f.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
