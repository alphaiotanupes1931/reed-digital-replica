import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import PricingCalculator from "@/components/PricingCalculator";

const packages = [
  { name: "Starter", price: "$1.5k - $3k", desc: "1-5 pages, responsive, basic SEO" },
  { name: "Business", price: "$3.5k - $7.5k", desc: "5-10 pages, CMS, blog, animations", popular: true },
  { name: "Professional", price: "$8k - $15k", desc: "10-20 pages, e-commerce, portals" },
  { name: "Enterprise", price: "$15k+", desc: "Complex integrations, APIs, multi-user" },
];

const mobilePackages = [
  { name: "MVP", price: "$5k - $12.5k", desc: "Single platform, core features" },
  { name: "Standard", price: "$12.5k - $25k", desc: "Auth, backend, push notifications" },
  { name: "Full-Featured", price: "$25k - $50k", desc: "iOS & Android, payments, admin" },
  { name: "Enterprise", price: "Custom", desc: "Multi-platform, advanced security" },
];

const seoRetainers = [
  { name: "Basic", price: "$500/mo", desc: "Keyword research, on-page optimization, monthly report" },
  { name: "Growth", price: "$1,000/mo", desc: "Content creation, link building, local SEO", popular: true },
  { name: "Premium", price: "$1,500/mo", desc: "Full-service SEO, competitive analysis" },
];

const socialMedia = [
  { name: "Starter", price: "$300/mo", desc: "3 posts/week, 1 platform" },
  { name: "Business", price: "$600/mo", desc: "5 posts/week, 2-3 platforms, stories", popular: true },
  { name: "Pro", price: "$1,000/mo", desc: "Daily posts, ads management, analytics" },
];

const maintenance = [
  { name: "Basic", price: "$100/mo", desc: "Updates, backups, security monitoring" },
  { name: "Plus", price: "$200/mo", desc: "Includes content updates, SEO tweaks" },
];

const extras = [
  { service: "Landing Page", price: "$300 - $600" },
  { service: "Website Redesign", price: "50% of build" },
  { service: "Cybersecurity Audit", price: "From $1,500" },
  { service: "IT Consulting", price: "$150/hr" },
];

const PricingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="section-label font-mono">Pricing</span>
                  <TypedHeader text="Simple, Honest Pricing" className="mt-4 mb-6" />
                  <p className="text-muted-foreground text-sm">
                    No hidden fees. Free consultation included.
                  </p>
                </div>
              </ScrollReveal>

              {/* Budget & Refund Promise */}
              <ScrollReveal delay={0.05}>
                <div className="mb-12 p-6 border-2 border-primary bg-primary/5 text-center">
                  <h3 className="text-lg font-medium mb-3">We Work With Your Budget</h3>
                  <p className="text-muted-foreground text-sm">
                    Every project is unique. Tell us your budget and goals — we'll find a solution that works for you.
                  </p>
                </div>
              </ScrollReveal>

              {/* Calculator */}
              <ScrollReveal delay={0.1}>
                <div className="mb-20">
                  <PricingCalculator />
                </div>
              </ScrollReveal>

              {/* Websites */}
              <ScrollReveal delay={0.15}>
                <div className="mb-16">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    Websites
                  </h3>
                  <div className="space-y-0">
                    {packages.map((pkg) => (
                      <div 
                        key={pkg.name} 
                        className={`flex items-center justify-between py-4 border-b border-border ${pkg.popular ? 'bg-muted/30 -mx-4 px-4' : ''}`}
                      >
                        <div>
                          <span className="font-medium">{pkg.name}</span>
                          {pkg.popular && <span className="text-xs text-muted-foreground ml-2">Popular</span>}
                          <p className="text-xs text-muted-foreground mt-0.5">{pkg.desc}</p>
                        </div>
                        <span className="font-mono text-sm">{pkg.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Mobile Apps */}
              <ScrollReveal delay={0.2}>
                <div className="mb-16">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    Mobile Apps
                  </h3>
                  <div className="space-y-0">
                    {mobilePackages.map((pkg) => (
                      <div key={pkg.name} className="flex items-center justify-between py-4 border-b border-border">
                        <div>
                          <span className="font-medium">{pkg.name}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{pkg.desc}</p>
                        </div>
                        <span className="font-mono text-sm">{pkg.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Monthly Recurring Services */}
              <ScrollReveal delay={0.25}>
                <div className="mb-16">
                  <div className="text-center mb-8 p-4 border-2 border-primary bg-primary/5">
                    <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
                      Monthly Recurring Services
                    </h3>
                  </div>

                  {/* SEO Retainers */}
                  <div className="mb-10">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                      SEO Retainer Packages
                    </h4>
                    <div className="space-y-0">
                      {seoRetainers.map((pkg) => (
                        <div 
                          key={pkg.name} 
                          className={`flex items-center justify-between py-4 border-b border-border ${pkg.popular ? 'bg-muted/30 -mx-4 px-4' : ''}`}
                        >
                          <div>
                            <span className="font-medium">{pkg.name}</span>
                            {pkg.popular && <span className="text-xs text-muted-foreground ml-2">Popular</span>}
                            <p className="text-xs text-muted-foreground mt-0.5">{pkg.desc}</p>
                          </div>
                          <span className="font-mono text-sm">{pkg.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Media Management */}
                  <div className="mb-10">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                      Social Media Management
                    </h4>
                    <div className="space-y-0">
                      {socialMedia.map((pkg) => (
                        <div 
                          key={pkg.name} 
                          className={`flex items-center justify-between py-4 border-b border-border ${pkg.popular ? 'bg-muted/30 -mx-4 px-4' : ''}`}
                        >
                          <div>
                            <span className="font-medium">{pkg.name}</span>
                            {pkg.popular && <span className="text-xs text-muted-foreground ml-2">Popular</span>}
                            <p className="text-xs text-muted-foreground mt-0.5">{pkg.desc}</p>
                          </div>
                          <span className="font-mono text-sm">{pkg.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Website Maintenance */}
                  <div>
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                      Website Maintenance
                    </h4>
                    <div className="space-y-0">
                      {maintenance.map((pkg) => (
                        <div key={pkg.name} className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <span className="font-medium">{pkg.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{pkg.desc}</p>
                          </div>
                          <span className="font-mono text-sm">{pkg.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Extras */}
              <ScrollReveal delay={0.3}>
                <div className="mb-16">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    À La Carte
                  </h3>
                  <div className="space-y-0">
                    {extras.map((item) => (
                      <div key={item.service} className="flex items-center justify-between py-3 border-b border-border text-sm">
                        <span className="text-muted-foreground">{item.service}</span>
                        <span className="font-mono">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* What's Included */}
              <ScrollReveal delay={0.35}>
                <div className="text-center mb-16 py-8 border-y border-border">
                  <p className="text-sm text-muted-foreground">
                    All projects include: Free consultation · Free mockups · Training · 30-day support
                  </p>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.4}>
                <div className="text-center">
                  <Link 
                    to="/contact" 
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    Get a Quote
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

export default PricingPage;
