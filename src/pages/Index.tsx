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
import StatsSection from "@/components/StatsSection";
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
        <StatsSection />
        <div id="services">
          <ServicesSection />
        </div>
        <div id="founder">
          <FounderSection />
        </div>
        <div id="awards">
          <AwardsSection />
        </div>
        <div id="work">
          <WorkSection />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <div id="calendly">
          <CalendlySection />
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
