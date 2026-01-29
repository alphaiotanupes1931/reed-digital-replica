import { ArrowUpRight } from "lucide-react";
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
    <section id="work" className="py-20 md:py-28 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase text-center mb-12">
            Portfolio
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          {projects.map((project, index) => (
            <ScrollReveal key={project.title} delay={index * 0.05}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex justify-between items-center py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-4 px-4"
              >
                <div>
                  <span className="font-medium group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </span>
                  <span className="text-xs text-muted-foreground ml-3 font-mono">
                    {project.category}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
