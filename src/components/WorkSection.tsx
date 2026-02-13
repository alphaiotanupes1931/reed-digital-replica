import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const projects = [
  { 
    title: "Wright Shade Creations", 
    category: "Art Portfolio", 
    type: "Portfolio Website",
    tools: ["React", "Tailwind CSS", "Framer Motion"],
    url: "https://wrightshadecreations.com/",
  },
  { 
    title: "OQP Solutions", 
    category: "Government Contractor", 
    type: "Business Website",
    tools: ["Next.js", "TypeScript", "Vercel"],
    url: "https://oqpsolutions.com/",
  },
  { 
    title: "The Intern by Shilom", 
    category: "Finance Education", 
    type: "Educational Platform",
    tools: ["React", "Node.js", "Stripe"],
    url: "https://www.theinternbyshilom.com/",
  },
  { 
    title: "VisionHeartz", 
    category: "Clothing Brand", 
    type: "E-Commerce Store",
    tools: ["Shopify", "Custom Theme", "JavaScript"],
    url: "https://visionheartz.github.io/",
  },
  { 
    title: "Conation Fitness", 
    category: "Fitness", 
    type: "Business Website",
    tools: ["React", "Tailwind CSS"],
    url: "https://conationfitness.com/",
  },
];

const WebsitePreview = ({ url, title }: { url: string; title: string }) => (
  <div className="relative w-full aspect-[16/10] bg-muted rounded-sm overflow-hidden border border-border">
    {/* Browser chrome */}
    <div className="absolute top-0 left-0 right-0 h-6 bg-secondary/80 backdrop-blur-sm flex items-center px-2 gap-1.5 z-10">
      <div className="w-2 h-2 rounded-full bg-red-400/60" />
      <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
      <div className="w-2 h-2 rounded-full bg-green-400/60" />
      <div className="flex-1 mx-2">
        <div className="bg-background/50 rounded-sm px-2 py-0.5 text-[8px] text-muted-foreground truncate">
          {url}
        </div>
      </div>
    </div>
    
    {/* Iframe container */}
    <div className="absolute top-6 left-0 right-0 bottom-0 overflow-hidden">
      <iframe
        src={url}
        title={title}
        className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
    
    {/* Hover overlay */}
    <div className="absolute inset-0 bg-primary/0 hover:bg-primary/5 transition-colors duration-300" />
  </div>
);

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

        {/* Grid layout with previews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group block"
            >
              {/* Website Preview */}
              <div className="mb-4 overflow-hidden rounded-sm transform group-hover:scale-[1.02] transition-transform duration-300">
                <WebsitePreview url={project.url} title={project.title} />
              </div>
              
              {/* Project info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {project.category}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1" />
                </div>
                
                {/* Type badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                    {project.type}
                  </span>
                </div>
                
                {/* Tools used */}
                <div className="flex flex-wrap gap-1">
                  {project.tools.map((tool) => (
                    <span 
                      key={tool} 
                      className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
