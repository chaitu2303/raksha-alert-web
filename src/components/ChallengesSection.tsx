import React from "react";
import { AlertCircle, Smartphone, Wifi, MonitorSmartphone } from "lucide-react";

const challenges = [
  { icon: AlertCircle, title: "Real-Time Notifications", desc: "Ensuring push notifications are delivered instantly and reliably across different devices and network conditions was a significant technical challenge." },
  { icon: Smartphone, title: "Device Permissions", desc: "Handling location, camera, and notification permissions across Android versions with varying security policies required extensive testing." },
  { icon: Wifi, title: "Backend Connectivity", desc: "Maintaining stable connections to Firebase during high-traffic scenarios and handling offline states gracefully." },
  { icon: MonitorSmartphone, title: "UI Responsiveness", desc: "Ensuring the app looks and performs consistently across different screen sizes, resolutions, and device capabilities." },
];

const ChallengesSection = React.forwardRef<HTMLElement>((_, ref) => (
  <section ref={ref} className="py-24 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(0_72%_51%/0.05),transparent_50%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h2 className="text-4xl font-bold text-center mb-4">Challenges Faced</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Obstacles we overcame during development</p>
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {challenges.map((c) => (
          <div key={c.title} className="gradient-card rounded-2xl p-6 border border-border border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <c.icon className="h-7 w-7 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));
ChallengesSection.displayName = "ChallengesSection";

export default ChallengesSection;
