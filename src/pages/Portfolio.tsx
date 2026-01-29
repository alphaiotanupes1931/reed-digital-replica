import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import PageTransition from "@/components/PageTransition";
import PortfolioFilter from "@/components/PortfolioFilter";
import PortfolioSkeleton from "@/components/PortfolioSkeleton";
// Website projects with live iframe previews
const websiteProjects = [
  { title: "Shilom AI", category: "Technology", url: "https://shilomai.com/", slug: "shilom-ai" },
  { title: "DGM Consulting", category: "Consulting", url: "https://dgmconsulting.info/", slug: "dgm-consulting" },
  { title: "The Intern by Shilom", category: "Finance", url: "https://www.theinternbyshilom.com/" },
  { title: "Wright Shade Creations", category: "Art", url: "https://wrightshadecreations.com/" },
  { title: "Evolve Connection", category: "Wellness", url: "https://www.evolveconnection.com/" },
  { title: "OQP Solutions", category: "Government", url: "https://oqpsolutions.com/", slug: "oqp-solutions" },
  { title: "Lez Tea Shop", category: "E-Commerce", url: "https://leztea.shop/" },
  { title: "AIN UPES 1931", category: "Finance", url: "https://ainupes1931.com/" },
  { title: "VisionHeartz", category: "Clothing", url: "https://visionheartz.github.io/" },
  { title: "Call Us First", category: "Government", url: "https://callusfirst.world/" },
];

// Get unique categories
const allCategories = ["All", ...new Set(websiteProjects.map(p => p.category))];

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? websiteProjects 
    : websiteProjects.filter(p => p.category === activeCategory);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="section-label font-mono">Portfolio</span>
              <TypedHeader text="Our Work" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                A showcase of projects we've brought to life.
              </p>
            </div>

            {/* Filter */}
            <PortfolioFilter 
              categories={allCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Websites Section */}
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-8 text-center">
              Websites
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProjects.map((project, index) => (
                <ScrollReveal key={project.title} delay={index * 0.05}>
                  <TiltCard>
                    <div className="group block">
                      {/* Live Preview Iframe with Skeleton */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PortfolioSkeleton src={project.url} title={project.title}>
                          <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors" />
                        </PortfolioSkeleton>
                      </a>
                      
                      {/* Project Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">
                            {project.category}
                          </span>
                          {project.slug ? (
                            <Link 
                              to={`/case-study/${project.slug}`}
                              className="text-lg font-medium hover:text-muted-foreground transition-colors hover-underline inline-block"
                            >
                              {project.title}
                            </Link>
                          ) : (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-medium hover:text-muted-foreground transition-colors hover-underline inline-block"
                            >
                              {project.title}
                            </a>
                          )}
                        </div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ArrowUpRight 
                            className="w-5 h-5 text-muted-foreground hover:text-foreground hover:translate-x-0.5 hover:-translate-y-0.5 transition-all" 
                          />
                        </a>
                      </div>
                      {project.slug && (
                        <Link 
                          to={`/case-study/${project.slug}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 inline-block"
                        >
                          View Case Study →
                        </Link>
                      )}
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PortfolioPage;
