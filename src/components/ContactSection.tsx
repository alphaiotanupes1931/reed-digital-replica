import { Link } from "react-router-dom";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <span className="section-label font-mono">Get Started</span>
            <TypedHeader text="Free Consultation" className="mt-4 mb-6" />
            <p className="text-muted-foreground mb-10">
              Let's discuss your project. No commitment, no pressure.
            </p>
            
            <Link 
              to="/contact"
              className="inline-block border border-foreground px-10 py-4 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Schedule a Call
            </Link>
            
            <p className="text-xs text-muted-foreground mt-6 font-mono">
              info@reeddigitalgroup.com · (301) 332-4084
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;