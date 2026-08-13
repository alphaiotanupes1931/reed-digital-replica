import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustedBySection from "@/components/TrustedBySection";
import CredentialBar from "@/components/CredentialBar";
import RecentAwardsSection from "@/components/RecentAwardsSection";
import AsSeenOnSection from "@/components/AsSeenOnSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import ServicesSection from "@/components/ServicesSection";
import InteractiveProcessSection from "@/components/InteractiveProcessSection";
import { Link } from "react-router-dom";
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
        <TrustedBySection />
        <CredentialBar />
        <AsSeenOnSection />
        <RecentAwardsSection />
        <ClientLogosSection />
        <div id="services">
          <ServicesSection />
        </div>
        <InteractiveProcessSection />
        <section id="work" className="py-24 border-t border-border">
          <div className="container text-center">
            <span className="section-label font-mono">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-6 tracking-tight">
              See the projects we've shipped
            </h2>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center bg-brand text-brand-foreground rounded-full px-8 py-4 text-sm font-medium hover:bg-brand/90 transition-colors"
            >
              Click here to view the portfolio
            </Link>
          </div>
        </section>
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
