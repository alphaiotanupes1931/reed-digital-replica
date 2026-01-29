import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 md:py-28 border-t border-border">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-6">
              Get Started
            </p>
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              Free Consultation
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Let's discuss your project. No commitment.
            </p>
            
            <Link 
              to="/contact"
              className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Schedule a Call
            </Link>
            
            <p className="text-xs text-muted-foreground mt-8 font-mono">
              info@reeddigitalgroup.com
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
