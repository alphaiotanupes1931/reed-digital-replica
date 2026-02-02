import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">Limited Availability</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Let's Build Something{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Amazing
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Schedule a free consultation. No commitment, just conversation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/contact"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                
                <span className="relative z-10">Schedule a Call</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="mailto:info@reeddigitalgroup.com"
                className="group inline-flex items-center gap-2 px-6 py-4 rounded-xl font-medium border border-border hover:border-primary/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:bg-primary/5"
              >
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">info@reeddigitalgroup.com</span>
              </a>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
