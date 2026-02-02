import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      {/* Large background text */}
      <div className="bg-text left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
        CONTACT
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <ScrollReveal>
            <motion.p 
              className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              Get Started
            </motion.p>
            <motion.h2 
              className="text-3xl md:text-4xl font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Free Consultation
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Let's discuss your project. No commitment.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                to="/contact"
                data-magnetic
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:bg-primary/90 transition-all duration-300"
              >
                Schedule a Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.p 
              className="text-sm text-muted-foreground mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              info@reeddigitalgroup.com
            </motion.p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
