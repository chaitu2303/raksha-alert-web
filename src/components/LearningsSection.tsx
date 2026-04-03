import React from "react";
import { BookOpen, Flame, Palette, BellRing, Users } from "lucide-react";

const learnings = [
  { icon: BookOpen, title: "Mobile App Development", desc: "Gained hands-on experience building a full-featured mobile application from concept to deployment." },
  { icon: Flame, title: "Firebase Integration", desc: "Learned to implement real-time databases, cloud functions, authentication, and cloud messaging." },
  { icon: Palette, title: "UI/UX Design", desc: "Understood the importance of user-centered design, dark themes, accessibility, and intuitive navigation." },
  { icon: BellRing, title: "Push Notification Systems", desc: "Mastered FCM implementation for reliable, real-time push notifications across devices." },
  { icon: Users, title: "Teamwork & Collaboration", desc: "Developed strong communication, version control with Git, and agile project management skills." },
];

const LearningsSection = React.forwardRef<HTMLElement>((_, ref) => (
  <section ref={ref} className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-4">Project Learnings</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Key skills and knowledge gained throughout the development journey</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {learnings.map((l) => (
          <div key={l.title} className="flex gap-4 gradient-card rounded-2xl p-6 border border-border">
            <l.icon className="h-7 w-7 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">{l.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));
LearningsSection.displayName = "LearningsSection";

export default LearningsSection;
