import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const projects = [
  { 
    title: "Wright Shade Creations", 
    category: "Art", 
    url: "https://wrightshadecreations.com/",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop"
  },
  { 
    title: "OQP Solutions", 
    category: "Government", 
    url: "https://oqpsolutions.com/",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
  },
  { 
    title: "The Intern by Shilom", 
    category: "Finance", 
    url: "https://www.theinternbyshilom.com/",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
  },
  { 
    title: "VisionHeartz", 
    category: "Clothing", 
    url: "https://visionheartz.github.io/",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
  },
  { 
    title: "Call Us First", 
    category: "Government", 
    url: "https://callusfirst.world/",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
  },
];

const WorkSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-24 md:py-32 relative overflow-hidden">
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      {/* Large background text */}
      <div className="bg-text left-0 top-1/2 -translate-y-1/2">
        WORK
      </div>
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Our Work
          </motion.p>
          <motion.h2 
            className="text-2xl md:text-3xl font-medium text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Portfolio
          </motion.h2>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto relative">
          {/* Floating preview image */}
          <motion.div
            className="fixed top-1/2 right-[10%] w-80 h-60 pointer-events-none z-50 hidden lg:block"
            animate={{
              opacity: hoveredIndex !== null ? 1 : 0,
              scale: hoveredIndex !== null ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            {hoveredIndex !== null && (
              <img
                src={projects[hoveredIndex].image}
                alt={projects[hoveredIndex].title}
                className="w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500"
              />
            )}
          </motion.div>

          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group flex justify-between items-center py-5 border-b border-border hover:border-primary transition-colors duration-300"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-medium text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </span>
                <span className="text-xs text-muted-foreground px-2 py-1 border border-border rounded-sm">
                  {project.category}
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
