import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { Building2, HeartPulse, HandHeart, Dumbbell, Rocket, GraduationCap } from "lucide-react";

const industries = [
  { name: "Government & Municipal", icon: Building2 },
  { name: "Healthcare & Wellness", icon: HeartPulse },
  { name: "Nonprofit Organizations", icon: HandHeart },
  { name: "Fitness & Personal Training", icon: Dumbbell },
  { name: "Small Business & Startups", icon: Rocket },
  { name: "Education", icon: GraduationCap },
];

const ClientLogosSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="section-line absolute top-0 left-0 right-0" />
      
      <div className="bg-text left-0 top-1/2 -translate-y-1/2">
        INDUSTRIES
      </div>
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Who We Work With
          </motion.p>
          <motion.h2 
            className="text-2xl md:text-3xl font-medium text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Industries We Serve
          </motion.h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              className="flex flex-col items-center gap-3 p-6 border border-border hover:border-muted-foreground transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <industry.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm text-center font-medium">{industry.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
