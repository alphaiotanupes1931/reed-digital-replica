import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ClientCarousel from "@/components/ClientCarousel";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <SectionNav />
        <div id="hero">
          <HeroSection />
        </div>
        <ClientCarousel />
        <div id="services">
          <ServicesSection />
        </div>
        <div id="work">
          <WorkSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
