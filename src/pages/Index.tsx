import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import InnovationSection from "@/components/InnovationSection";
import FeaturesSection from "@/components/FeaturesSection";
import FeedbackSection from "@/components/FeedbackSection";
import FeedbackFormSection from "@/components/FeedbackFormSection";
import TeamSection from "@/components/TeamSection";
import FutureSection from "@/components/FutureSection";
import QRSection from "@/components/QRSection";
import LearningsSection from "@/components/LearningsSection";
import ChallengesSection from "@/components/ChallengesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <InnovationSection />
      <FeaturesSection />
      <FeedbackSection />
      <FeedbackFormSection />
      <TeamSection />
      <FutureSection />
      <QRSection />
      <LearningsSection />
      <ChallengesSection />
      <Footer />
    </div>
  );
};

export default Index;
