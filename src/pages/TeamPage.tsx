import { ArrowLeft, Github, Linkedin, Code, Users, BookOpen, Search, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import team1 from "@/assets/team-1.png";
import team2 from "@/assets/team-2.png";
import team3 from "@/assets/team-3.png";
import team4 from "@/assets/team-4.png";

const members = [
  {
    photo: team1,
    name: "Chaitanya Kumar Sahu",
    role: "Full Stack Developer, UI/UX Designer & System Architect",
    desc: "Designed and developed the Raksha Alert mobile application and website including UI/UX design, backend architecture, frontend integration, and overall system functionality.",
    icon: Code,
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  {
    photo: team2,
    name: "B. Harish",
    role: "Frontend Developer",
    desc: "Assisted in developing the user interface and implementing responsive frontend components.",
    icon: Code,
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
  },
  {
    photo: team3,
    name: "Gunna Sateesh",
    role: "Team Leader & Documentation Lead",
    desc: "Managed the project team, conducted research, and handled documentation and planning.",
    icon: BookOpen,
    color: "from-green-500/20 to-green-500/5",
    borderColor: "border-green-500/30",
  },
  {
    photo: team4,
    name: "Gopi Vasant Kumar",
    role: "Research & Feature Planning Associate",
    desc: "Contributed to feature ideas, research insights, and project improvements.",
    icon: Search,
    color: "from-yellow-500/20 to-yellow-500/5",
    borderColor: "border-yellow-500/30",
  },
  {
    photo: team3,
    name: "Gujja Sandeep",
    role: "Research Analyst",
    desc: "Worked on research related to emergency safety systems and project concept analysis.",
    icon: FlaskConical,
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/30",
  },
];

const TeamPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Our Team</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Meet the <span className="text-primary">Team</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The talented individuals behind Raksha Alert – building safety technology for everyone.
          </p>
        </div>

        {/* Featured member */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className={`gradient-card rounded-3xl p-8 border ${members[0].borderColor} flex flex-col md:flex-row items-center gap-8`}>
            <div className="shrink-0">
              <img
                src={members[0].photo}
                alt={members[0].name}
                className="w-40 h-40 rounded-2xl object-cover border-2 border-primary/30 shadow-glow"
              />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                <Code className="h-3.5 w-3.5" /> Lead Developer
              </div>
              <h3 className="text-2xl font-bold mb-1">{members[0].name}</h3>
              <p className="text-primary text-sm font-medium mb-3">{members[0].role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">{members[0].desc}</p>
            </div>
          </div>
        </div>

        {/* Other members grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.slice(1).map((m, i) => (
            <div
              key={m.name}
              className={`gradient-card rounded-2xl p-6 border ${m.borderColor} text-center hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${(i + 1) * 100}ms`, animationFillMode: 'backwards' }}
            >
              <img
                src={m.photo}
                alt={m.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-border group-hover:border-primary/50 transition-colors duration-300"
              />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-3">
                <m.icon className="h-3 w-3" /> {m.role.split("&")[0].trim()}
              </div>
              <h3 className="font-semibold text-base mb-1">{m.name}</h3>
              <p className="text-primary text-xs font-medium mb-2">{m.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
