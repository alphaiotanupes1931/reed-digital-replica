import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";


// Build pricing — websites AND apps combined, one-time fee
const buildPackages = [
  { name: "Starter", price: "$700 - $1.5k", desc: "1-5 page site or simple single-screen app" },
  { name: "Business", price: "$2k - $5k", desc: "Up to 10 pages or small app with auth", popular: true },
  { name: "Professional", price: "$6k - $12k", desc: "E-commerce, client portal, or multi-screen app with backend" },
  { name: "Scale", price: "$15k - $30k", desc: "Custom platforms, integrations, iOS + Android apps" },
  { name: "Enterprise", price: "$30k+", desc: "Multi-site, multi-user platforms, advanced security" },
];

// Maintenance plans — monthly recurring (formerly "managed" plans)
const maintenancePlans = [
  {
    name: "Starter",
    price: "$300",
    tagline: "Up to 5 pages · hosting, SSL, basic SEO · 2 updates/mo",
  },
  {
    name: "Business",
    price: "$400",
    popular: true,
    tagline: "Up to 10 pages + CMS · monitoring · 5 updates/mo · 24hr response",
  },
  {
    name: "Professional",
    price: "$500",
    tagline: "Up to 20 pages, e-com/portal · unlimited minor changes · monthly strategy call",
  },
  {
    name: "Scale",
    price: "$600",
    tagline: "Unlimited pages + integrations · dedicated PM · bi-weekly calls",
  },
  {
    name: "Enterprise",
    price: "$700",
    tagline: "Custom platforms · SLA · dedicated team · compliance reviews",
  },
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
                  <h1 className="mt-4 mb-6 text-4xl md:text-5xl font-bold tracking-tight">
                    Simple Pricing
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
                    Pick a plan. We handle the rest. Starts at <span className="text-foreground font-medium">$300/mo</span>.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-block bg-brand text-brand-foreground px-8 py-3 text-sm font-medium hover:bg-brand/90 transition-colors"
                  >
                    Book Free Call →
                  </Link>
                </div>
              </ScrollReveal>

              {/* Three rungs — moved to top, primary choice */}
              <ScrollReveal delay={0.05}>
                <div className="mb-16 grid md:grid-cols-3 gap-4">
                  {[
                    {
                      t: "App Only",
                      p: "$20",
                      sub: "/mo",
                      d: "Home Office app — invoices, bills, client portal.",
                      cta: "Start Free Trial",
                      href: "/home-office/welcome",
                    },
                    {
                      t: "Member",
                      p: "$40",
                      sub: "/mo",
                      d: "App + 15% off projects + free logo + perks.",
                      cta: "Join Now",
                      href: "/membership",
                      popular: true,
                    },
                    {
                      t: "Project",
                      p: "$700+",
                      sub: "",
                      d: "Full website or app build. Members save 15%.",
                      cta: "Book Call",
                      href: "/contact",
                    },
                  ].map((r) => (
                    <div
                      key={r.t}
                      className={`border rounded-md p-6 flex flex-col ${
                        r.popular ? "border-brand border-2" : "border-border"
                      }`}
                    >
                      {r.popular && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand mb-2">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-lg font-bold">{r.t}</h3>
                      <div className="mt-3">
                        <span className="text-3xl font-bold">{r.p}</span>
                        <span className="text-sm text-muted-foreground">{r.sub}</span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground flex-1">{r.d}</p>
                      <Link
                        to={r.href}
                        className={`mt-5 inline-block text-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          r.popular
                            ? "bg-brand text-brand-foreground hover:bg-brand/90"
                            : "border border-foreground hover:bg-foreground hover:text-background"
                        }`}
                      >
                        {r.cta}
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Details disclosure */}
              <ScrollReveal delay={0.08}>
                <details className="mb-12 border border-border rounded-md">
                  <summary className="cursor-pointer px-5 py-4 text-sm font-medium hover:bg-muted/30 select-none">
                    See all plans & detailed pricing
                  </summary>
                  <div className="px-5 pb-6 pt-2 border-t border-border">

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

              {/* FAQ */}
              <ScrollReveal delay={0.36}>
                <div className="mb-16">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-0">
                    {faqs.map((faq, i) => (
                      <div key={faq.q} className="border-b border-border">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between py-4 text-left hover:opacity-70 transition-opacity"
                        >
                          <span className="text-sm font-medium pr-4">{faq.q}</span>
                          <span className="font-mono text-lg flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                        </button>
                        {openFaq === i && (
                          <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.a}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Three rungs */}
                  </div>
                </details>
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
