import { ArrowUpRight } from "lucide-react";
import TypedHeader from "@/components/TypedHeader";

const projects = [
  {
    title: "Enterprise SaaS Platform",
    category: "Web Application",
    year: "2024",
  },
  {
    title: "E-Commerce Experience",
    category: "Digital Commerce",
    year: "2024",
  },
  {
    title: "Healthcare Portal",
    category: "Web Application",
    year: "2023",
  },
  {
    title: "Financial Dashboard",
    category: "Data Visualization",
    year: "2023",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label font-mono">Portfolio</span>
          <TypedHeader text="Selected Work" className="mt-4 mb-6" />
        </div>

        {/* Projects List */}
        <div className="max-w-3xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group flex items-center justify-between py-6 border-b border-border cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-1">
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.year}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-medium group-hover:text-muted-foreground transition-colors">
                  {project.title}
                </h3>
              </div>
              <ArrowUpRight 
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
