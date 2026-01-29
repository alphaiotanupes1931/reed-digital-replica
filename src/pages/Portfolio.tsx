import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import dgmAppStore from "@/assets/dgm-app-store.png";

// Website projects with live iframe previews
const websiteProjects = [
  { title: "Shilom AI", category: "Technology", url: "https://shilomai.com/" },
  { title: "DGM Consulting", category: "Consulting", url: "https://dgmconsulting.info/" },
  { title: "The Intern by Shilom", category: "Finance", url: "https://www.theinternbyshilom.com/" },
  { title: "Wright Shade Creations", category: "Art", url: "https://wrightshadecreations.com/" },
  { title: "Evolve Connection", category: "Wellness", url: "https://www.evolveconnection.com/" },
  { title: "OQP Solutions", category: "Government", url: "https://oqpsolutions.com/" },
  { title: "Lez Tea Shop", category: "E-Commerce", url: "https://leztea.shop/" },
  { title: "AIN UPES 1931", category: "Finance", url: "https://ainupes1931.com/" },
  { title: "VisionHeartz", category: "Clothing", url: "https://visionheartz.github.io/" },
  { title: "Call Us First", category: "Government", url: "https://callusfirst.world/" },
];

// Mobile app projects with screenshots
const appProjects = [
  { 
    title: "DGM Consulting", 
    category: "Mobile App", 
    url: "https://apps.apple.com/app/dgm-consulting/id6740583498",
    image: dgmAppStore,
    platform: "iOS"
  },
];

const PortfolioPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-label font-mono">Portfolio</span>
            <TypedHeader text="Our Work" className="mt-4 mb-6" />
            <p className="text-muted-foreground">
              A showcase of projects we've brought to life.
            </p>
          </div>

          {/* Mobile Apps Section */}
          <div className="mb-16">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-8 text-center">
              Mobile Applications
            </h3>
            <div className="max-w-4xl mx-auto">
              {appProjects.map((project, index) => (
                <ScrollReveal key={project.title} delay={index * 0.05}>
                  <TiltCard>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="relative aspect-video mb-4 border border-border overflow-hidden bg-background rounded-sm">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">
                            {project.category} · {project.platform}
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

          {/* Websites Section */}
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-8 text-center">
            Websites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websiteProjects.map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 0.05}>
                <TiltCard>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {/* Live Preview Iframe */}
                    <div className="relative aspect-video mb-4 border border-border overflow-hidden bg-white rounded-sm">
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
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
