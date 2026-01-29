import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const projects = [
  { title: "Wright Shade Creations", category: "Art", url: "https://wrightshadecreations.com/" },
  { title: "OQP Solutions", category: "Government", url: "https://oqpsolutions.com/" },
  { title: "The Intern by Shilom", category: "Finance", url: "https://www.theinternbyshilom.com/" },
  { title: "VisionHeartz", category: "Clothing", url: "https://visionheartz.github.io/" },
  { title: "Call Us First", category: "Government", url: "https://callusfirst.world/" },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase text-center mb-16">
            Portfolio
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          {projects.map((project, index) => (
            <ScrollReveal key={project.title} delay={index * 0.08}>
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex justify-between items-center py-5 border-b border-border -mx-4 px-4 block"
                whileHover={{ 
                  x: 8,
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-baseline gap-4">
                  <motion.span 
                    className="font-medium text-lg group-hover:text-muted-foreground transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    {project.title}
                  </motion.span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.category}
                  </span>
                </div>
                <motion.div
                  whileHover={{ x: 3, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </motion.div>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
