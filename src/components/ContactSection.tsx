import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-8">
              Get Started
            </p>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Free Consultation
            </h2>
            <p className="text-muted-foreground mb-10">
              Let's discuss your project. No commitment.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/contact"
                className="inline-block border border-foreground px-10 py-4 text-sm font-medium hover:bg-foreground hover:text-background transition-all rounded-lg"
              >
                Schedule a Call
              </Link>
            </motion.div>
            
            <p className="text-xs text-muted-foreground mt-10 font-mono">
              info@reeddigitalgroup.com
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
