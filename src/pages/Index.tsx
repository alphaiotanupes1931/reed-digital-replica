import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CredentialBar from "@/components/CredentialBar";
import ClientCarousel from "@/components/ClientCarousel";
import AsSeenOnSection from "@/components/AsSeenOnSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import ServicesSection from "@/components/ServicesSection";
import InteractiveProcessSection from "@/components/InteractiveProcessSection";
import WorkSection from "@/components/WorkSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import LeaveReviewSection from "@/components/LeaveReviewSection";
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
        <CredentialBar />
        <ClientCarousel />
        <AsSeenOnSection />
        <ClientLogosSection />
        <div id="services">
          <ServicesSection />
        </div>
        <InteractiveProcessSection />
        <div id="work">
          <WorkSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <LeaveReviewSection />
        <div id="contact">
          <ContactSection />
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
