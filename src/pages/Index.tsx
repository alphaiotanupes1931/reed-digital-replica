import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ClientCarousel from "@/components/ClientCarousel";
import ServicesSection from "@/components/ServicesSection";
import FounderSection from "@/components/FounderSection";
import WorkSection from "@/components/WorkSection";
import ProcessSection from "@/components/ProcessSection";
import AwardsSection from "@/components/AwardsSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CalendlySection from "@/components/CalendlySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ClientCarousel />
      <ServicesSection />
      <FounderSection />
      <AwardsSection />
      <WorkSection />
      <ProcessSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <CalendlySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
