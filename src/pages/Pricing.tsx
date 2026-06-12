import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import PricingRecommender from "@/components/PricingRecommender";


const managedPlans = [
  {
    name: "Starter",
    price: "$300",
    tagline: "Perfect for new businesses",
    features: [
      "No build fee",
      "Up to 5 pages",
      "Hosting, SSL, backups",
      "Basic SEO",
      "2 updates / month",
      "48hr response",
    ],
  },
  {
    name: "Business",
    price: "$400",
    popular: true,
    tagline: "Most small businesses pick this",
    features: [
      "No build fee",
      "Up to 10 pages + CMS / blog",
      "Hosting, security, monitoring",
      "On-page SEO + monthly report",
      "5 updates / month",
      "24hr response",
    ],
  },
  {
    name: "Professional",
    price: "$500",
    tagline: "For growing brands",
    features: [
      "Everything in Business",
      "Up to 20 pages, e-com or portal",
      "Unlimited minor changes",
      "Same-day urgent response",
      "Monthly strategy call",
      "Analytics + conversion reports",
    ],
  },
  {
    name: "Scale",
    price: "$600",
    tagline: "High-traffic, high-touch",
    features: [
      "Everything in Professional",
      "Unlimited pages + integrations",
      "Dedicated project manager",
      "7-day priority support",
      "Bi-weekly strategy calls",
      "Custom analytics dashboard",
    ],
  },
  {
    name: "Enterprise",
    price: "$700",
    tagline: "Multi-site, custom platforms",
    features: [
      "Custom architecture + APIs",
      "Multi-user / multi-site",
      "SLA-backed uptime",
      "Dedicated team",
      "Compliance + security reviews",
    ],
  },
];

const buyOutrightPackages = [
  { name: "Starter", price: "$1.5k - $3k", desc: "1-5 pages, responsive, basic SEO" },
  { name: "Business", price: "$3.5k - $7.5k", desc: "5-10 pages, CMS, blog, animations", popular: true },
  { name: "Professional", price: "$8k - $15k", desc: "10-20 pages, e-commerce, portals" },
  { name: "Enterprise", price: "$15k+", desc: "Complex integrations, APIs, multi-user" },
];

const mobilePackages = [
  { name: "MVP", price: "$10k - $20k", desc: "Single platform, core features" },
  { name: "Standard", price: "$20k - $40k", desc: "Auth, backend, push notifications" },
  { name: "Full-Featured", price: "$40k - $75k", desc: "iOS & Android, payments, admin" },
  { name: "Enterprise", price: "Custom Quote", desc: "Multi-platform, advanced security" },
];

const managedAppPlans = [
  {
    name: "Starter",
    price: "$500",
    tagline: "Solo founders launching a single-platform MVP",
  },
  {
    name: "Business",
    price: "$600",
    popular: true,
    tagline: "Most small businesses launching their first app",
  },
  {
    name: "Professional",
    price: "$700",
    tagline: "Growing apps with auth, backend, and push",
  },
  {
    name: "Scale",
    price: "$800",
    tagline: "iOS & Android with payments and admin tools",
  },
  {
    name: "Enterprise",
    price: "$900",
    tagline: "Multi-platform apps with advanced security",
  },
];

const maintenancePlans = [
  { name: "Basic", price: "$150/mo", desc: "Hosting, SSL, backups, security monitoring, 1 update/mo" },
  { name: "Standard", price: "$300/mo", desc: "Everything in Basic, 3 updates/mo, uptime monitoring, 48hr response", popular: true },
  { name: "Premium", price: "$500/mo", desc: "Unlimited minor updates, priority support, monthly performance report" },
];

const socialMedia = [
  { name: "Starter", price: "$150/mo", desc: "3 posts/week, 1 platform" },
  { name: "Business", price: "$300/mo", desc: "5 posts/week, 2-3 platforms, stories", popular: true },
  { name: "Pro", price: "$600/mo", desc: "Daily posts, ads management, analytics" },
];

const extras = [
  { service: "Landing Page", price: "$300 - $600" },
  { service: "Website Redesign", price: "Free with any monthly Website or App plan · 50% of original build cost otherwise" },
  { service: "Custom Business Apparel", price: "From $20/shirt" },
  { service: "Cybersecurity Audit", price: "From $1,500" },
  { service: "IT Consulting", price: "$50/hr" },
];

const faqs = [
  {
    q: "What happens to my website if I cancel?",
    a: "You keep your domain and all your content. The website design and codebase stay with RDG unless you purchase a buyout (typically 6 months of your plan rate or a flat fee).",
  },
  {
    q: "Do I own the content and domain?",
    a: "Yes. Your domain is registered in your name and all content is yours.",
  },
  {
    q: "Why monthly instead of one-time?",
    a: "Most small businesses cannot afford a 6K to 10K upfront build. Monthly plans make professional web presence accessible and keep your site current without surprise invoices.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can upgrade anytime. Downgrades take effect at the next renewal.",
  },
  {
    q: "What counts as a content update?",
    a: "Text changes, image swaps, adding or removing sections, publishing blog posts, updating business hours, menu changes, etc. Full redesigns or new page templates are scoped separately.",
  },
];

const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "outright">("monthly");
  const [appBilling, setAppBilling] = useState<"monthly" | "outright">("monthly");
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* Hero */}
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="section-label font-mono">Pricing</span>
                  <TypedHeader text="Your Website, Handled Monthly" className="mt-4 mb-6" />
                  <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
                    No build fee. No surprise invoices. Get a website for as little as <span className="text-foreground font-medium">$300/month</span> — we build, host, maintain, and update it for as long as you need.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-block bg-brand text-brand-foreground px-8 py-3 text-sm font-medium hover:bg-brand/90 transition-colors"
                  >
                    Book Free Consultation →
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.02}>
                <div className="mb-12 border-2 border-primary bg-primary/5 p-5 md:p-6">
                  <div className="flex items-baseline justify-between gap-4 mb-2 flex-wrap">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-primary">
                      Important Notice
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Estimates only
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    All prices listed on this page are <span className="font-medium">estimates</span> and may not reflect the final cost of your project. Actual pricing depends on scope, integrations, timeline, and ongoing requirements. For an accurate quote tailored to your needs, please contact the developer directly at{" "}
                    <a
                      href="mailto:reeddigitalgroup@gmail.com"
                      className="font-mono text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      reeddigitalgroup@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </ScrollReveal>

              {/* Plan Finder — interactive recommender */}
              <ScrollReveal delay={0.03}>
                <div className="mb-20">
                  <PricingRecommender />
                </div>
              </ScrollReveal>

              {/* Website Plans — unified Monthly / One-time toggle */}
              <ScrollReveal delay={0.05}>
                <div className="mb-20">
                  <div className="text-center mb-8">
                    <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
                      Website Plans
                    </h3>
                    <div className="inline-flex border border-border p-1">
                      <button
                        onClick={() => setBilling("monthly")}
                        className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          billing === "monthly"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Monthly · No build fee
                      </button>
                      <button
                        onClick={() => setBilling("outright")}
                        className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          billing === "outright"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Buy Outright
                      </button>
                    </div>
                  </div>

                  {billing === "monthly" ? (
                    <>
                      <div className="border-t border-border">
                        {managedPlans.map((plan) => (
                          <div
                            key={plan.name}
                            className={`flex items-center justify-between gap-6 py-5 border-b border-border ${
                              plan.popular ? "bg-primary/5 -mx-4 px-4" : ""
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-baseline gap-3">
                                <span className="font-medium">{plan.name}</span>
                                {plan.popular && (
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {plan.tagline}
                              </p>
                            </div>
                            <div className="flex items-baseline gap-4 flex-shrink-0">
                              <span className="font-mono text-lg">
                                {plan.price}
                                <span className="text-xs text-muted-foreground">/mo</span>
                              </span>
                              <Link
                                to="/contact"
                                className="text-[11px] font-mono uppercase tracking-wider border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                              >
                                Choose
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground text-center mt-4 font-mono">
                        12-month minimum · Includes free maintenance — the cheapest, smartest, and recommended option · See full features in Plan Finder above
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-border">
                        {buyOutrightPackages.map((pkg) => (
                          <div
                            key={pkg.name}
                            className={`flex items-center justify-between gap-6 py-5 border-b border-border ${
                              pkg.popular ? "bg-primary/5 -mx-4 px-4" : ""
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-baseline gap-3">
                                <span className="font-medium">{pkg.name}</span>
                                {pkg.popular && (
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{pkg.desc}</p>
                            </div>
                            <div className="flex items-baseline gap-4 flex-shrink-0">
                              <span className="font-mono text-lg">{pkg.price}</span>
                              <Link
                                to="/contact"
                                className="text-[11px] font-mono uppercase tracking-wider border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                              >
                                Quote
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground text-center mt-4 italic">
                        One-time builds do not include hosting, updates, or maintenance. Bundle a managed plan to waive the build fee.
                      </p>
                    </>
                  )}
                </div>
              </ScrollReveal>

              {/* Mobile Apps */}
              <ScrollReveal delay={0.2}>
                <div className="mb-16">
                  <div className="text-center mb-8">
                    <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
                      Mobile App Plans
                    </h3>
                    <div className="inline-flex border border-border p-1">
                      <button
                        onClick={() => setAppBilling("monthly")}
                        className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          appBilling === "monthly"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Monthly · No build fee
                      </button>
                      <button
                        onClick={() => setAppBilling("outright")}
                        className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          appBilling === "outright"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Buy Outright
                      </button>
                    </div>
                  </div>

                  {appBilling === "monthly" ? (
                    <>
                      <div className="border-t border-border">
                        {managedAppPlans.map((plan) => (
                          <div
                            key={plan.name}
                            className={`flex items-center justify-between gap-6 py-5 border-b border-border ${
                              plan.popular ? "bg-primary/5 -mx-4 px-4" : ""
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-baseline gap-3">
                                <span className="font-medium">{plan.name}</span>
                                {plan.popular && (
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{plan.tagline}</p>
                            </div>
                            <div className="flex items-baseline gap-4 flex-shrink-0">
                              <span className="font-mono text-lg">
                                {plan.price}
                                <span className="text-xs text-muted-foreground">/mo</span>
                              </span>
                              <Link
                                to="/contact"
                                className="text-[11px] font-mono uppercase tracking-wider border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                              >
                                Choose
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground text-center mt-4 font-mono">
                        12-month minimum · Includes free maintenance — the cheapest, smartest, and recommended option · No build fee
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-border">
                        {mobilePackages.map((pkg) => (
                          <div key={pkg.name} className="flex items-center justify-between gap-6 py-5 border-b border-border">
                            <div className="min-w-0">
                              <span className="font-medium">{pkg.name}</span>
                              <p className="text-xs text-muted-foreground mt-1">{pkg.desc}</p>
                            </div>
                            <div className="flex items-baseline gap-4 flex-shrink-0">
                              <span className="font-mono text-lg">{pkg.price}</span>
                              <Link
                                to="/contact"
                                className="text-[11px] font-mono uppercase tracking-wider border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                              >
                                Quote
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground text-center mt-4 italic">
                        One-time builds do not include hosting, updates, or store maintenance. Bundle a managed app plan to waive the build fee.
                      </p>
                    </>
                  )}

                  <div className="text-center mt-6">
                    <Link
                      to="/contact"
                      className="inline-block bg-brand text-brand-foreground px-8 py-3 text-sm font-medium hover:bg-brand/90 transition-colors"
                    >
                      Get a Quote →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* Monthly Recurring Services */}
              <ScrollReveal delay={0.25}>
                <div className="mb-16">
                  <div className="text-center mb-8">
                    <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
                      Other Monthly Services
                    </h3>
                  </div>

                  {/* Maintenance */}
                  <div className="mb-10">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                      Maintenance Plans
                    </h4>
                    <div className="space-y-0">
                      {maintenancePlans.map((pkg) => (
                        <div key={pkg.name} className={`flex items-center justify-between py-4 border-b border-border ${pkg.popular ? 'bg-muted/30 -mx-4 px-4' : ''}`}>
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

                  {/* Social Media */}
                  <div>
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                      Social Media Management
                    </h4>
                    <div className="space-y-0">
                      {socialMedia.map((pkg) => (
                        <div key={pkg.name} className={`flex items-center justify-between py-4 border-b border-border ${pkg.popular ? 'bg-muted/30 -mx-4 px-4' : ''}`}>
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
                </div>
              </ScrollReveal>

              {/* À La Carte */}
              <ScrollReveal delay={0.3}>
                <div className="mb-16">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    À La Carte Services
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
                    All projects include: Free consultation · Initial design concepts · Training session · 30-day bug fix support
                  </p>
                </div>
              </ScrollReveal>

              {/* Three rungs */}
              <ScrollReveal delay={0.38}>
                <div className="mb-16 grid md:grid-cols-3 gap-px bg-foreground/10 border-2 border-foreground">
                  {[
                    {
                      k: "Rung 01",
                      t: "Home Office App",
                      p: "$20 / mo",
                      d: "The front door. Get the Home Office app — invoices, bills, work assistant, client portal. Self-serve, cancel anytime.",
                      cta: "Start free trial",
                      href: "/home-office/welcome",
                    },
                    {
                      k: "Rung 02",
                      t: "RDG Member",
                      p: "$40 / mo · $400 / yr",
                      d: "App + 15% off projects + 10% off first 3 months of maintenance + free post-launch training + priority support + quarterly kit + free logo design.",
                      cta: "Become a member",
                      href: "/membership",
                      popular: true,
                    },
                    {
                      k: "Rung 03",
                      t: "Project Client",
                      p: "$700 – $2K sites · $5K+ apps",
                      d: "Full build. 50% deposit before work starts. Members save 15% — that $2,000 site is $1,700.",
                      cta: "Book consultation",
                      href: "/contact",
                    },
                  ].map((r) => (
                    <div
                      key={r.k}
                      className={`bg-background p-6 md:p-8 flex flex-col ${
                        r.popular ? "ring-2 ring-brand -m-px relative z-10" : ""
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand">
                        {r.k}
                      </span>
                      <h3 className="mt-3 text-2xl font-bold tracking-tight">{r.t}</h3>
                      <p className="mt-2 text-sm font-mono">{r.p}</p>
                      <p className="mt-4 text-sm text-muted-foreground flex-1">{r.d}</p>
                      <Link
                        to={r.href}
                        className={`mt-6 inline-block text-center px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors ${
                          r.popular
                            ? "bg-brand text-brand-foreground hover:bg-brand/90"
                            : "border-2 border-foreground hover:bg-foreground hover:text-background"
                        }`}
                      >
                        {r.cta} →
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.4}>
                <div className="text-center">
                  <Link 
                    to="/contact" 
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    Book Free Consultation
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
