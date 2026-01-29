import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    number: "01",
    category: "Web Development",
    title: "Evolve Connection",
    description: "Professional business website with modern design and seamless user experience.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "02",
    category: "Business Website",
    title: "DGM Consulting",
    description: "Corporate consulting website with clean aesthetics and professional branding.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "03",
    category: "Organization Website",
    title: "Alpha Iota",
    description: "Fraternity organization website with event management and member features.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
];

const WorkSection = () => {
  return (
    <section className="py-20 bg-background" id="work">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="section-label">Featured Work</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Recent projects</h2>
          </div>
          <Button variant="outline" className="btn-outline-dark mt-6 md:mt-0">
            View All Work
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.number}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-background font-medium flex items-center gap-2">
                    View Project <ArrowRight size={16} />
                  </span>
                </div>
              </div>
              <span className="number-badge">{project.number}</span>
              <p className="text-sm text-muted-foreground mt-2">{project.category}</p>
              <h3 className="font-display text-2xl font-semibold mt-1 mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
