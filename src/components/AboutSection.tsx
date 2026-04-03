import { AlertTriangle, ShieldCheck, Users } from "lucide-react";

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-4">About the Project</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Understanding the need for a smarter emergency response system</p>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: AlertTriangle,
            title: "The Problem",
            desc: "In emergencies, every second counts. Traditional alert systems are slow, fragmented, and lack real-time communication, leaving people vulnerable when they need help the most.",
          },
          {
            icon: ShieldCheck,
            title: "Why It Matters",
            desc: "Emergency alert systems save lives by enabling rapid communication during crises. A connected, mobile-first approach ensures help reaches people faster and more reliably.",
          },
          {
            icon: Users,
            title: "Our Solution",
            desc: "Raksha Alert bridges the gap with real-time SOS alerts, live location tracking, incident reporting with evidence, and community-wide safety awareness — all from one app.",
          },
        ].map((item) => (
          <div key={item.title} className="gradient-card rounded-2xl p-8 border border-border shadow-card hover:border-primary/30 transition-colors">
            <item.icon className="h-10 w-10 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
