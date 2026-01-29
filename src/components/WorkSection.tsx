import { ArrowUpRight } from "lucide-react";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";

const projects = [
  {
    title: "Wright Shade Creations",
    category: "Art",
    url: "https://wrightshadecreations.com/",
  },
  {
    title: "OQP Solutions",
    category: "Government",
    url: "https://oqpsolutions.com/",
  },
  {
    title: "AIN UPES 1931",
    category: "Finance",
    url: "https://ainupes1931.com/",
  },
  {
    title: "The Intern by Shilom",
    category: "Finance",
    url: "https://www.theinternbyshilom.com/",
  },
  {
    title: "VisionHeartz",
    category: "Clothing",
    url: "https://visionheartz.github.io/",
  },
  {
    title: "Call Us First",
    category: "Government",
    url: "https://callusfirst.world/",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        {/* Header */}
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="section-label font-mono">Portfolio</span>
            <TypedHeader text="Selected Work" className="mt-4 mb-6" />
          </div>
        </ScrollReveal>

        {/* Projects Grid with Live Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollReveal key={project.title} delay={index * 0.1}>
              <TiltCard>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {/* Live Preview Iframe */}
                  <div className="relative aspect-video mb-4 border border-border overflow-hidden bg-white">
                    <iframe
                      src={project.url}
                      title={project.title}
                      className="w-full h-full pointer-events-none scale-[0.5] origin-top-left"
                      style={{ width: '200%', height: '200%' }}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors" />
                  </div>
                  
                  {/* Project Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground font-mono block mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-medium group-hover:text-muted-foreground transition-colors hover-underline inline-block">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRight 
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" 
                    />
                  </div>
                </a>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;