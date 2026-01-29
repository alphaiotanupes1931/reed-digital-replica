import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Enterprise SaaS Platform",
    category: "Web Application",
    description: "A comprehensive business management solution serving 10,000+ users.",
    year: "2024",
  },
  {
    title: "E-Commerce Experience",
    category: "Digital Commerce",
    description: "Modern shopping platform with seamless checkout and inventory management.",
    year: "2024",
  },
  {
    title: "Healthcare Portal",
    category: "Web Application",
    description: "HIPAA-compliant patient management system for medical practices.",
    year: "2023",
  },
  {
    title: "Financial Dashboard",
    category: "Data Visualization",
    description: "Real-time analytics platform for investment portfolio management.",
    year: "2023",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="section-label">Portfolio</span>
          <h2 className="text-display-sm md:text-display font-serif mt-4 mb-6">
            Selected Work
          </h2>
          <div className="flex justify-center mb-6">
            <div className="divider" />
          </div>
          <p className="text-muted-foreground leading-relaxed">
            A curated selection of projects that showcase our approach 
            to design and development.
          </p>
        </div>

        {/* Projects List */}
        <div className="max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group border-t border-border py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {project.year}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif group-hover:text-muted-foreground transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-2 md:hidden">
                  {project.description}
                </p>
              </div>
              <div className="hidden md:block flex-1 max-w-md">
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
              <ArrowUpRight 
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" 
              />
            </div>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
