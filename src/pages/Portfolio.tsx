import { useEffect, useState } from "react";
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
type AppProject = {
  title: string;
  category: string;
  developer: string;
  description: string;
  icon?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  liveDemoUrl?: string;
  status?: string;
};

const appProjects: AppProject[] = [
  {
    title: "DGM Consulting",
    category: "Business",
    developer: "DGM Consulting LLC",
    description: "DGM Consulting empowers business owners to safeguard their enterprises through comprehensive risk assessment and strategic planning. Our innovative app delivers personalized business protection solutions in an easy-to-use, interactive format.",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2d/b6/a8/2db6a896-060f-2a90-0e26-adc5d9a6b05f/AppIcon-0-0-1x_U007epad-0-1-85-220.png/400x400bb.webp",
    appStoreUrl: "https://apps.apple.com/us/app/dgm-consulting/id6749719732",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.dgmconsulting.app",
  },
  {
    title: "AIVA",
    category: "AI Assistant",
    developer: "Reed Digital Group",
    description: "AIVA is an AI-powered virtual assistant delivering intelligent, conversational experiences. Currently in live demo — not yet released to the public.",
    liveDemoUrl: "https://aiva-live-demo.vercel.app/",
    status: "Unreleased — Live Demo",
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

const StorePreview = ({ url, title }: { url: string; title: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="relative w-full h-full bg-muted">
      {!loaded && !failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mb-3" />
          <span className="text-xs text-muted-foreground font-mono">Loading preview...</span>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Store preview unavailable in this frame.</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-4 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
          >
            Open in new tab
          </a>
        </div>
      )}
      <iframe
        key={url}
        src={url}
        title={title}
        className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

const AppListing = ({ app }: { app: AppProject }) => {
  const hasStores = Boolean(app.appStoreUrl || app.playStoreUrl);
  const [activeStore, setActiveStore] = useState<"ios" | "android">(
    app.appStoreUrl ? "ios" : "android"
  );

  return (
    <div className="group block">
      {/* Tabbed store preview */}
      <div className="relative aspect-[16/10] mb-4 border border-border overflow-hidden bg-muted rounded-sm">
        {hasStores ? (
          <>
            {/* Browser chrome with tabs */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-secondary/80 backdrop-blur-sm flex items-end px-2 z-10">
              <div className="flex gap-1">
                {app.appStoreUrl && (
                  <button
                    onClick={() => setActiveStore("ios")}
                    className={`px-3 py-1.5 text-[10px] font-mono transition-colors ${
                      activeStore === "ios" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    App Store
                  </button>
                )}
                {app.playStoreUrl && (
                  <button
                    onClick={() => setActiveStore("android")}
                    className={`px-3 py-1.5 text-[10px] font-mono transition-colors ${
                      activeStore === "android" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Google Play
                  </button>
                )}
              </div>
            </div>

            <div className="absolute top-12 left-0 right-0 bottom-0">
              {activeStore === "ios" && app.appStoreUrl ? (
                <StorePreview url={app.appStoreUrl} title={`${app.title} - App Store`} />
              ) : app.playStoreUrl ? (
                <StorePreview url={app.playStoreUrl} title={`${app.title} - Google Play`} />
              ) : null}
            </div>
          </>
        ) : app.liveDemoUrl ? (
          <>
            <div className="absolute top-0 left-0 right-0 h-12 bg-secondary/80 backdrop-blur-sm flex items-end px-2 z-10">
              <div className="px-3 py-1.5 text-[10px] font-mono bg-background text-foreground">
                Live Demo
              </div>
            </div>
            <div className="absolute top-12 left-0 right-0 bottom-0">
              <StorePreview url={app.liveDemoUrl} title={`${app.title} - Live Demo`} />
            </div>
          </>
        ) : null}
      </div>

      {/* App info + store links */}
      <div className="flex items-start gap-4 mb-3">
        {app.icon ? (
          <img
            src={app.icon}
            alt={app.title}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-border bg-background"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl flex-shrink-0 border border-border bg-secondary flex items-center justify-center font-mono text-sm text-foreground">
            {app.title.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-xs text-muted-foreground font-mono block mb-0.5">{app.category}</span>
          <h4 className="text-lg font-medium leading-tight">{app.title}</h4>
          {app.status && (
            <span className="text-[10px] text-muted-foreground font-mono block mt-1 uppercase tracking-wider">
              {app.status}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{app.description}</p>
      <div className="flex flex-wrap gap-2">
        {app.appStoreUrl && (
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
          >
            App Store
          </a>
        )}
        {app.playStoreUrl && (
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
          >
            Google Play
          </a>
        )}
        {app.liveDemoUrl && (
          <a
            href={app.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
          >
            Open Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

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
