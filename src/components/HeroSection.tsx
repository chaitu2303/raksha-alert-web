import screenshot1 from "@/assets/app-screenshot-1.png";
import screenshot2 from "@/assets/app-screenshot-2.png";
import screenshot3 from "@/assets/app-screenshot-3.png";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_72%_51%/0.12),transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Emergency Safety Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient">Raksha Alert</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              A comprehensive emergency safety platform that empowers people to report incidents, send instant emergency alerts, and share live locations — making communities safer, one alert at a time.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="/auth" className="gradient-emergency text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-glow hover:opacity-90 transition-opacity">
                Get Started
              </a>
              <a href="#features" className="bg-secondary text-secondary-foreground px-8 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-colors">
                Explore Features
              </a>
            </div>
          </div>
          <div className="flex justify-center gap-4 items-end">
            <img src={screenshot1} alt="Raksha Alert SOS screen" className="w-40 sm:w-48 rounded-2xl shadow-card -rotate-3 hover:rotate-0 transition-transform duration-500" />
            <img src={screenshot2} alt="Raksha Alert map screen" className="w-40 sm:w-48 rounded-2xl shadow-card translate-y-[-20px] hover:translate-y-[-28px] transition-transform duration-500" />
            <img src={screenshot3} alt="Raksha Alert report screen" className="w-40 sm:w-48 rounded-2xl shadow-card rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
