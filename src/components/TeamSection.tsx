import { User } from "lucide-react";

const members = [
  {
    initials: "CKS",
    name: "Chaitanya Kumar Sahu",
    role: "Full Stack Developer, UI/UX Designer & System Architect",
    desc: "Designed and developed the Raksha Alert mobile application and website including UI/UX design, backend architecture, frontend integration, and overall system functionality.",
    photo: "/team/chaitanya.jpeg", // Add photo path here
  },
  {
    initials: "BH",
    name: "B. Harish",
    role: "Frontend Developer",
    desc: "Assisted in developing the user interface and implementing responsive frontend components.",
    photo: "/team/harish.jpeg", // Add photo path here
  },
  {
    initials: "GS",
    name: "Gunna Sateesh",
    role: "Team Leader & Documentation Lead",
    desc: "Managed the project team, conducted research, and handled documentation and planning.",
    photo: "/team/sateesh.jpeg", // Add photo path here
  },
  {
    initials: "GVK",
    name: "Gopi Vasant Kumar",
    role: "Research & Feature Planning Associate",
    desc: "Contributed to feature ideas, research insights, and project improvements.",
    photo: "/team/gopi.jpeg", // Add photo path here
  },
  {
    initials: "GS",
    name: "Gujja Sandeep",
    role: "Research Analyst",
    desc: "Worked on research related to emergency safety systems and project concept analysis.",
    photo: "/team/sandeep.jpeg", // Add photo path here
  },
];

const TeamSection = () => (
  <section id="team" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-2">Our Team</h2>
      <p className="text-primary text-center font-medium mb-4">Raksha Alert Team</p>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
        The talented individuals behind Raksha Alert
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m) => (
          <div
            key={m.name}
            className="gradient-card rounded-2xl p-6 border border-border text-center hover:border-primary/40 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group"
          >
            <img
              src={m.photo}
              alt={m.name}
              className="w-24 h-24 rounded-full mx-auto mb-5 border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-300 object-cover object-center"
            />
            <h3 className="font-semibold text-lg">{m.name}</h3>
            <p className="text-primary text-sm font-medium mb-3">{m.role}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
