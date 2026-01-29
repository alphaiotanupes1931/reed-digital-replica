import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ClientCarousel from "@/components/ClientCarousel";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ClientCarousel />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
