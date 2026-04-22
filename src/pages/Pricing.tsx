import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";


const managedPlans = [
  {
    name: "Launch",
    price: "$300",
    features: [
      "Up to 5 pages, fully responsive",
      "Hosting, domain management, SSL, backups",
      "Basic SEO setup",
      "2 content updates per month",
      "48-hour response time",
      "12-month minimum",
    ],
  },
  {
    name: "Grow",
    price: "$500",
    popular: true,
    features: [
      "Up to 10 pages, CMS, blog",
      "Hosting, security, backups, monitoring",
      "On-page SEO + monthly performance report",
      "5 content or design updates per month",
      "24-hour response time",
      "Quarterly strategy call",
      "12-month minimum",
    ],
  },
  {
    name: "Scale",
    price: "$700",
    features: [
      "Up to 20 pages, e-commerce or client portal",
      "Everything in Grow",
      "Unlimited minor changes, priority queue",
      "Same-day response on urgent fixes",
      "Monthly strategy call",
      "Analytics and conversion reporting",
      "12-month minimum",
    ],
  },
];

const packages = [
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

const seoRetainers = [
  { name: "Basic", price: "$300/mo", desc: "Keyword research, on-page optimization, monthly report" },
  { name: "Growth", price: "$600/mo", desc: "Content creation, link building, local SEO", popular: true },
  { name: "Premium", price: "$1,000/mo", desc: "Full-service SEO, competitive analysis" },
];

const socialMedia = [
  { name: "Starter", price: "$300/mo", desc: "3 posts/week, 1 platform" },
  { name: "Business", price: "$600/mo", desc: "5 posts/week, 2-3 platforms, stories", popular: true },
  { name: "Pro", price: "$1,000/mo", desc: "Daily posts, ads management, analytics" },
];

const extras = [
  { service: "Landing Page", price: "$300 - $600" },
  { service: "Website Redesign", price: "50% of original build cost" },
  { service: "Custom Business Apparel", price: "From $20/shirt (12-shirt min, $50 setup)" },
  { service: "Cybersecurity Audit", price: "From $1,500" },
  { service: "IT Consulting", price: "$150/hr" },
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
  const [ownOpen, setOwnOpen] = useState(false);
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
                  <TypedHeader text="Your Website, Handled Monthly" className="mt-4 mb-6" />
                  <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
                    No big upfront cost. No surprise invoices. One flat monthly fee and we build, host, maintain, and update your site for as long as you need it.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-block bg-brand text-brand-foreground px-8 py-3 text-sm font-medium hover:bg-brand/90 transition-colors"
                  >
                    Book Free Consultation →
                  </Link>
                </div>
              </ScrollReveal>

              {/* Managed Website Plans */}
              <ScrollReveal delay={0.05}>
                <div className="mb-8">
                  <div className="text-center mb-8">
                    <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-2">
                      Managed Website Plans
                    </h3>
                    <p className="text-xs text-muted-foreground">All-inclusive monthly plans. Build, host, maintain, update.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {managedPlans.map((plan) => (
                      <div
                        key={plan.name}
                        className={`p-6 border-2 flex flex-col ${plan.popular ? 'border-primary bg-primary/5 md:scale-105' : 'border-border'}`}
                      >
                        <div className="flex items-baseline justify-between mb-4">
                          <h4 className="text-lg font-medium">{plan.name}</h4>
                          {plan.popular && (
                            <span className="text-[10px] font-mono uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="mb-6">
                          <span className="font-mono text-3xl">{plan.price}</span>
                          <span className="text-muted-foreground text-sm font-mono">/mo</span>
                        </div>
                        <ul className="space-y-2 mb-6 flex-1">
                          {plan.features.map((f) => (
                            <li key={f} className="text-xs text-muted-foreground leading-relaxed">· {f}</li>
                          ))}
                        </ul>
                        <Link
                          to="/contact"
                          className={`block text-center px-4 py-2.5 text-sm font-medium transition-colors ${
                            plan.popular
                              ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                              : 'border border-foreground hover:bg-foreground hover:text-background'
                          }`}
                        >
                          Get Started
                        </Link>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-6 font-mono">
                    One-time setup fee: $500 (waived on 24-month agreements)
                  </p>
                </div>
              </ScrollReveal>

              {/* Value Comparison */}
              <ScrollReveal delay={0.1}>
                <div className="mb-16 mt-12 p-6 border-2 border-primary bg-primary/5 text-center">
                  <p className="text-sm leading-relaxed">
                    A custom <span className="font-mono">$6,000</span> website plus <span className="font-mono">$200/mo</span> maintenance equals <span className="font-mono">$8,400</span> in year one.
                    <br />
                    Our <span className="font-medium">Grow</span> plan is <span className="font-mono">$6,000</span> in year one, with nothing out of pocket upfront.
                  </p>
                </div>
              </ScrollReveal>

              {/* Prefer to Own Your Site Outright? (collapsible) */}
              <ScrollReveal delay={0.15}>
                <div className="mb-16 border-y border-border">
                  <button
                    onClick={() => setOwnOpen(!ownOpen)}
                    className="w-full flex items-center justify-between py-6 text-left hover:opacity-70 transition-opacity"
                  >
                    <div>
                      <h3 className="text-sm font-mono uppercase tracking-wider">
                        Prefer to Own Your Site Outright?
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Some clients prefer a one-time build with no ongoing commitment. We offer that too.
                      </p>
                    </div>
                    <span className="font-mono text-2xl">{ownOpen ? '−' : '+'}</span>
                  </button>
                  {ownOpen && (
                    <div className="pb-6 space-y-0">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.name}
                          className={`flex items-center justify-between py-4 border-t border-border ${pkg.popular ? 'bg-muted/30 -mx-4 px-4' : ''}`}
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
                  )}
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
                  <p className="text-sm text-muted-foreground mt-6 text-center italic">
                    App pricing varies based on scope and complexity. Book a free consultation to discuss your project and get an accurate quote tailored to your needs.
                  </p>
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
                  <div className="text-center mb-8 p-4 border-2 border-primary bg-primary/5">
                    <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
                      Other Monthly Services
                    </h3>
                  </div>

                  {/* SEO */}
                  <div className="mb-10">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                      SEO Retainer Packages
                    </h4>
                    <div className="space-y-0">
                      {seoRetainers.map((pkg) => (
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
              <ScrollReveal delay={0.38}>
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
