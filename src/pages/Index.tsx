import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PartnersMarquee from "@/components/PartnersMarquee";
import AboutSection from "@/components/AboutSection";
import FounderSection from "@/components/FounderSection";
import ConsultationCTA from "@/components/ConsultationCTA";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import WorkSection from "@/components/WorkSection";
import PrioritySection from "@/components/PrioritySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PartnersMarquee />
      <AboutSection />
      <FounderSection />
      <ConsultationCTA />
      <ServicesSection />
      <WhyUsSection />
      <WorkSection />
      <PrioritySection />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
