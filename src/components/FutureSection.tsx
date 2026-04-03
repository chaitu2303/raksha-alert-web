import { Brain, Map, Radio, Watch, Languages } from "lucide-react";

const enhancements = [
  { icon: Brain, title: "AI-Based Danger Prediction", desc: "Machine learning models to predict high-risk zones and alert users proactively before incidents occur." },
  { icon: Map, title: "Crime Heatmap Visualization", desc: "Interactive heatmaps showing historical incident data to help users navigate safer routes." },
  { icon: Radio, title: "Police Emergency Integration", desc: "Direct integration with local police and fire department systems for automated dispatching." },
  { icon: Watch, title: "Smart Wearable Integration", desc: "Support for smartwatches and fitness bands to trigger SOS alerts via physical gestures." },
  { icon: Languages, title: "Multilingual Support", desc: "Full localization across multiple regional languages to ensure accessibility for all communities." },
];

const FutureSection = () => (
  <section id="future" className="py-24 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(15_90%_55%/0.05),transparent_50%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h2 className="text-4xl font-bold text-center mb-4">Future Enhancements</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Our roadmap for making Raksha Alert even more powerful</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancements.map((e, i) => (
          <div key={e.title} className={`gradient-card rounded-2xl p-6 border border-border ${i === enhancements.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <e.icon className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold mb-2">{e.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FutureSection;
