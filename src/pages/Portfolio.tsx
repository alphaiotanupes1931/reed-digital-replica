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
import jessicaPreview from "@/assets/jessica-showell-preview.png";
import auntieSamPreview from "@/assets/auntie-sam-preview.png";
// App projects with store links and listing previews
const appProjects = [
  {
    title: "DGM Consulting",
    category: "Business",
    developer: "DGM Consulting LLC",
    description: "DGM Consulting empowers business owners to safeguard their enterprises through comprehensive risk assessment and strategic planning. Our innovative app delivers personalized business protection solutions in an easy-to-use, interactive format.",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2d/b6/a8/2db6a896-060f-2a90-0e26-adc5d9a6b05f/AppIcon-0-0-1x_U007epad-0-1-85-220.png/400x400bb.webp",
    appStoreUrl: "https://apps.apple.com/us/app/dgm-consulting/id6749719732",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.dgmconsulting.app",
  },
];

// Website projects with live iframe previews

const websiteProjects = [
  { title: "Reed Digital Group", category: "Agency", url: "https://reeddigitalgroup.com/" },
  { title: "Young ExeKutive", category: "Personal Brand", url: "https://youngexekutive.com/" },
  { title: "Auntie Sam", category: "Food & Beverage", url: "https://auntiesam.vercel.app/", image: auntieSamPreview },
  { title: "Build With Marcus", category: "Home Services", url: "https://buildwithmarcus.com/" },
  { title: "Friends of Jessica Showell", category: "Political", url: "https://friendsofjessicashowell.com/", image: jessicaPreview },
  { title: "Shilom AI", category: "Technology", url: "https://shilomai.com/", slug: "shilom-ai" },
  { title: "DGM Consulting", category: "Consulting", url: "https://consultdgm.com/", slug: "dgm-consulting" },
  { title: "The Intern by Shilom", category: "Finance", url: "https://www.theinternbyshilom.com/" },
  { title: "Wright Shade Creations", category: "Art", url: "https://wrightshadecreations.com/" },
  { title: "OQP Solutions", category: "Government", url: "https://oqpsolutions.com/", slug: "oqp-solutions" },
  { title: "Kappa Alpha Psi Fraternity Inc.", category: "Organization", url: "https://ainupes1931.com/" },
  { title: "VisionHeartz", category: "Clothing", url: "https://visionheartz.github.io/" },
  { title: "Conation Fitness", category: "Fitness", url: "https://conationfitness.com/" },
  { title: "Alpha Iota 95th Anniversary", category: "Organization", url: "https://alphaiota95.com/" },
  { title: "Alpha Iota Merch", category: "E-Commerce", url: "https://alphaiotamerch.com/" },
  { title: "Call Us First", category: "Government", url: "https://www.callusfirst.world/" },
  { title: "Got Tint", category: "Automotive", url: "https://got-tint-redesign.vercel.app/" },
  { title: "Luxury Courier Club", category: "Lifestyle", url: "https://luxurycourier.club/" },
];

const AppListing = ({ app }: { app: typeof appProjects[0] }) => (
  <div className="group block">
    {/* App store listing preview */}
    <div className="relative aspect-[16/10] mb-4 border border-border overflow-hidden bg-muted rounded-sm">
      {/* Browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-secondary/80 backdrop-blur-sm flex items-center px-2 gap-1.5 z-10">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
        <div className="flex-1 mx-2">
          <div className="bg-background/50 rounded-sm px-2 py-0.5 text-[8px] text-muted-foreground truncate">
            apps.apple.com
          </div>
        </div>
      </div>

      {/* Listing content */}
      <div className="absolute top-6 left-0 right-0 bottom-0 p-5 md:p-6 flex flex-col sm:flex-row gap-5 overflow-hidden">
        <img
          src={app.icon}
          alt={app.title}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 border border-border bg-background"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-base sm:text-lg font-medium leading-tight">{app.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{app.developer}</p>
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded mt-2 inline-block">
            {app.category}
          </span>
          <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{app.description}</p>
        </div>
      </div>
    </div>

    {/* Store links */}
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="text-xs text-muted-foreground font-mono block mb-1">{app.category}</span>
        <span className="text-lg font-medium">{app.title}</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
        <a
          href={app.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono text-center"
        >
          App Store
        </a>
        <a
          href={app.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono text-center"
        >
          Google Play
        </a>
      </div>
    </div>
  </div>
);

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
              <TypedHeader text="Featured Projects" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                A showcase of featured projects we've brought to life.
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
                        <PortfolioSkeleton src={project.url} title={project.title} image={(project as any).image}>
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

            {/* Apps Section */}
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-8 text-center">
              Apps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appProjects.map((app, index) => (
                <ScrollReveal key={app.title} delay={index * 0.05}>
                  <TiltCard>
                    <AppListing app={app} />
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
