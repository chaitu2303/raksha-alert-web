import { Zap, MapPin, FileText, Bell, Users, Eye } from "lucide-react";

const innovations = [
  { icon: Zap, title: "Real‑Time Emergency Alerts", desc: "Instant SOS alerts broadcast to nearby users and authorities within seconds, minimizing response time." },
  { icon: MapPin, title: "Live Location Tracking", desc: "Precise GPS tracking lets emergency contacts and responders pinpoint the user's exact location in real time." },
  { icon: FileText, title: "Incident Reporting with Evidence", desc: "Users can attach photos and videos to incident reports, providing visual evidence for faster and more accurate responses." },
  { icon: Bell, title: "Push Notifications", desc: "Automated push notifications keep the community informed about nearby incidents and safety updates." },
  { icon: Users, title: "Community Safety Awareness", desc: "A shared safety network where users can view and respond to alerts in their area, fostering collective vigilance." },
  { icon: Eye, title: "SOS Panic Button", desc: "A one-tap panic button sends emergency alerts with location data to all registered contacts instantly." },
];

const InnovationSection = () => (
  <section id="innovation" className="py-24 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(15_90%_55%/0.06),transparent_60%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h2 className="text-4xl font-bold text-center mb-4">What Makes Our Idea Innovative?</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
        A unique combination of real-time technology and community-driven safety
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {innovations.map((item) => (
          <div key={item.title} className="group gradient-card rounded-2xl p-6 border border-border hover:border-primary/40 transition-all hover:shadow-glow">
            <div className="w-12 h-12 rounded-xl gradient-emergency flex items-center justify-center mb-5">
              <item.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default InnovationSection;
