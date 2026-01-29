import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const projects = [
  { title: "Shilom AI", category: "Technology", year: "2024" },
  { title: "DGM Consulting", category: "Consulting", year: "2024" },
  { title: "OQP Solutions", category: "Government", year: "2024" },
  { title: "The Intern by Shilom", category: "Finance", year: "2024" },
  { title: "Evolve Connection", category: "Wellness", year: "2023" },
  { title: "Wright Shade Creations", category: "Art", year: "2023" },
];

const WorkPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="section-label font-mono">Work</span>
                  <TypedHeader text="Selected Projects" className="mt-4 mb-6" />
                </div>
              </ScrollReveal>

              {/* Projects */}
              <div>
                {projects.map((project, index) => (
                  <ScrollReveal key={project.title} delay={index * 0.05}>
                    <div className="py-5 border-b border-border flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          {project.category}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground font-mono">
                        {project.year}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* CTA */}
              <ScrollReveal delay={0.3}>
                <div className="text-center mt-16">
                  <Link 
                    to="/portfolio"
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    View Full Portfolio
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default WorkPage;