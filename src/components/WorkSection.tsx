import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Evolve Connection",
    category: "Web Application",
    description: "A professional networking platform with real-time features and modern UI.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    title: "DGM Consulting",
    category: "Corporate Website",
    description: "Clean, professional website with integrated booking and client portal.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["Next.js", "Stripe", "CMS"],
  },
  {
    title: "InsuranceHub",
    category: "E-commerce Platform",
    description: "Multi-product insurance platform with quote engine and checkout flow.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Vue.js", "Python", "AWS"],
  },
];

const WorkSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-24 md:py-32 bg-secondary/50">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="max-w-xl">
            <p className="section-label mb-4">Selected Work</p>
            <h2 className="text-display-sm md:text-display font-bold">
              Projects we're proud of
            </h2>
          </div>
          <a href="#contact" className="btn-ghost mt-6 md:mt-0 w-fit">
            View all projects <ExternalLink size={16} />
          </a>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredIndex === index ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <p className="text-sm text-muted-foreground mb-2">{project.category}</p>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-3">
                    {project.title}
                    <ArrowUpRight className={`w-6 h-6 transition-all duration-300 ${
                      hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    }`} />
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
