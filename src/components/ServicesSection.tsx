import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const services = [
  { title: "Custom Development", desc: "Bespoke web applications" },
  { title: "UI/UX Design", desc: "Intuitive interfaces" },
  { title: "Web Applications", desc: "Scalable solutions" },
  { title: "Mobile Development", desc: "iOS & Android" },
  { title: "Cloud Solutions", desc: "AWS & Azure" },
  { title: "Digital Strategy", desc: "Strategic consulting" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase text-center mb-16">
            Services
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.08}>
              <motion.div 
                className="group flex justify-between items-baseline py-5 border-b border-border cursor-default"
                whileHover={{ 
                  x: 8,
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.span 
                  className="font-medium text-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  {service.title}
                </motion.span>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {service.desc}
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
