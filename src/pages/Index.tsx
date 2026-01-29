import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LogoMarquee from "@/components/LogoMarquee";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <LogoMarquee />
      <ServicesSection />
      <WorkSection />
      <FeaturesShowcase />
      <WhyUsSection />
      <TestimonialsSection />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;
