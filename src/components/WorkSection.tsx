import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Evolve Connection",
    category: "Web Platform",
    description: "Professional networking platform with real-time messaging and event management.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tech: ["React", "Node.js", "PostgreSQL"],
    featured: true,
  },
  {
    title: "DGM Consulting",
    category: "Corporate Website",
    description: "Modern consulting firm website with booking system and client portal.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tech: ["Next.js", "Stripe", "CMS"],
    featured: true,
  },
  {
    title: "Alpha Iota Portal",
    category: "Member Platform",
    description: "Organization management with events, dues tracking, and member directory.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    tech: ["React", "Firebase", "PWA"],
    featured: false,
  },
  {
    title: "InsuranceHub",
    category: "E-commerce",
    description: "Multi-product insurance quote and purchase platform.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    tech: ["Vue.js", "Python", "AWS"],
    featured: false,
  },
];

const WorkSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-32 relative bg-card/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-2xl">
            <p className="section-label">Selected Work</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
              Projects that <span className="text-gradient">deliver</span>
            </h2>
          </div>
          <a href="#contact" className="btn-ghost mt-6 lg:mt-0 flex items-center gap-2 w-fit">
            View All Work <ExternalLink size={16} />
          </a>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {projects.filter(p => p.featured).map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-primary text-sm font-medium mb-2">{project.category}</p>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" />
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.filter(p => !p.featured).map((project, index) => (
            <div
              key={index}
              className="card-dark p-6 group cursor-pointer flex gap-6"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <p className="text-primary text-xs font-medium mb-1">{project.category}</p>
                <h3 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
