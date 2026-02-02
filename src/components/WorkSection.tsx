import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const projects = [
  { title: "Wright Shade Creations", category: "Art", url: "https://wrightshadecreations.com/", color: "from-pink-500 to-rose-500" },
  { title: "OQP Solutions", category: "Government", url: "https://oqpsolutions.com/", color: "from-blue-500 to-cyan-500" },
  { title: "The Intern by Shilom", category: "Finance", url: "https://www.theinternbyshilom.com/", color: "from-green-500 to-emerald-500" },
  { title: "VisionHeartz", category: "Clothing", url: "https://visionheartz.github.io/", color: "from-purple-500 to-violet-500" },
  { title: "Call Us First", category: "Government", url: "https://callusfirst.world/", color: "from-orange-500 to-amber-500" },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-sm font-mono tracking-widest uppercase text-center mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Work
          </motion.p>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Portfolio
          </motion.h2>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ x: 10 }}
              className="group block relative"
            >
              <div className="relative flex justify-between items-center py-5 px-6 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-transparent transition-all duration-500 overflow-hidden">
                {/* Animated gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className={`absolute inset-[1px] bg-background rounded-xl`} />
                
                {/* Gradient line on left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex items-center gap-4">
                  {/* Color dot */}
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${project.color} opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`} />
                  <span className="font-medium text-lg group-hover:text-foreground transition-colors">
                    {project.title}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono px-2 py-1 rounded-full bg-muted/50">
                    {project.category}
                  </span>
                </div>
                <ArrowUpRight className="relative z-10 w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
