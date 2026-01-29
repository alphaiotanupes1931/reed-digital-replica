import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Enterprise SaaS Platform",
    category: "Web Application",
    year: "2024",
    description: "A comprehensive business management solution serving 10,000+ users with real-time collaboration features.",
  },
  {
    title: "E-Commerce Experience",
    category: "Digital Commerce",
    year: "2024",
    description: "Modern shopping platform with seamless checkout, inventory management, and analytics dashboard.",
  },
  {
    title: "Healthcare Portal",
    category: "Web Application",
    year: "2023",
    description: "HIPAA-compliant patient management system for medical practices with appointment scheduling.",
  },
  {
    title: "Financial Dashboard",
    category: "Data Visualization",
    year: "2023",
    description: "Real-time analytics platform for investment portfolio management with custom reporting.",
  },
  {
    title: "Government Agency Website",
    category: "Web Development",
    year: "2023",
    description: "Accessible, Section 508 compliant website for a federal agency with CMS integration.",
  },
  {
    title: "Mobile Banking App",
    category: "Mobile Development",
    year: "2022",
    description: "Cross-platform mobile application for a regional bank with biometric authentication.",
  },
];

const WorkPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">Portfolio</span>
              <TypedHeader text="Our Work" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                A selection of projects that showcase our approach to design and development.
              </p>
            </div>

            {/* Projects List */}
            <div>
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="group py-8 border-b border-border cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {project.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-medium mb-2 group-hover:text-muted-foreground transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <ArrowUpRight 
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkPage;
