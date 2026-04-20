import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import TypedHeader from "@/components/TypedHeader";

interface Plan {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  bestFor: string;
  popular?: boolean;
}

const cmsPlans: Plan[] = [
  {
    name: "Standard",
    price: 200,
    tagline: "Keeps your website up and running.",
    features: [
      "Your website stays online 24/7",
      "You can still update your menu, hours, and photos yourself",
      "We keep your site safe and backed up",
      "If something breaks, we fix it",
      "Email support (2 business day response)",
      "1 update per month done for you",
    ],
      bestFor: "Businesses that want a website that just works.",
  },
  {
    name: "Growth",
    price: 300,
    tagline: "The plan built for active businesses.",
    features: [
      "Everything in Standard",
      "Text support, same-day response",
      "3 updates per month done for you",
      "Monthly report on how your site is performing",
      "We manage your email newsletter",
      "Daily backups",
      "24/7 site monitoring",
    ],
    bestFor: "Businesses that want their site to actually bring in customers.",
    popular: true,
  },
  {
    name: "Pro",
    price: 400,
    tagline: "For businesses that want their website to sell for them.",
    features: [
      "Everything in Growth",
      "Unlimited updates",
      "1 newsletter email a month, fully done for you",
      "Seasonal homepage updates",
      "Google search ranking help",
      "Instagram feed tuning",
    ],
    bestFor: "Businesses running specials, events, or promotions.",
  },
  {
    name: "Elite",
    price: 500,
    tagline: "Hands off. We handle everything.",
    features: [
      "Everything in Pro",
      "2 newsletter emails a month",
      "Monthly strategy call with Terell",
      "Yearly website refresh",
      "Small new features added free",
      "Call or text anytime during business hours",
      "Google Business Profile management",
      "20% off future add-ons",
    ],
    bestFor: "Businesses that want to focus on operations, not websites.",
  },
];

const smbPlans: Plan[] = [
  {
    name: "Standard",
    price: 100,
    tagline: "Keeps your site live.",
    features: [
      "Website hosting and security",
      "Weekly backups",
      "We fix things if they break",
      "Email support (2 business day response)",
      "1 text or image change per month",
    ],
    bestFor: "Businesses with a simple site they rarely change.",
  },
  {
    name: "Growth",
    price: 200,
    tagline: "The plan most small businesses need.",
    features: [
      "Everything in Standard",
      "Text support, same-day response",
      "3 content changes per month",
      "Monthly performance report",
      "Daily backups",
      "24/7 site monitoring",
      "Help with Google search visibility",
    ],
    bestFor: "Businesses that want their site to stay fresh and help them grow.",
    popular: true,
  },
  {
    name: "Pro",
    price: 300,
    tagline: "Full-service for growing businesses.",
    features: [
      "Everything in Growth",
      "Unlimited content changes",
      "Quarterly site refresh",
      "1 newsletter email a month done for you",
      "Google Business Profile management",
      "Direct phone support",
    ],
    bestFor: "Businesses using their website as a serious marketing tool.",
  },
];

const landingPlans: Plan[] = [
  {
    name: "Standard",
    price: 50,
    tagline: "Keeps your page online.",
    features: [
      "Hosting and security",
      "Monthly backups",
      "Fixes if something breaks",
      "Email support",
    ],
    bestFor: "Landing pages that don't change often.",
  },
  {
    name: "Growth",
    price: 100,
    tagline: "For pages that need to stay sharp.",
    features: [
      "Everything in Standard",
      "Text changes and image swaps done for you",
      "Monthly performance report",
      "Form and analytics tracking",
      "Same-day text support",
    ],
    bestFor: "Landing pages actively driving signups, leads, or bookings.",
    popular: true,
  },
];

const faqs = [
  {
    q: "What happens if I cancel my plan?",
    a: "If maintenance stops, your website goes offline after a 14-day grace period. Hosting, CMS access, newsletter tools, and support all end. You keep your content and domain, but re-launching the site somewhere else would be your responsibility.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade anytime with 30 days notice.",
  },
  {
    q: "What counts as an 'update'?",
    a: "Any small change — new photos, updated text, changing hours or contact info, adding a testimonial, swapping a headline, or refreshing a section. Big changes like new pages or new features are separate projects.",
  },
  {
    q: "Do I have to sign a contract?",
    a: "No long-term contract. Month-to-month. Cancel anytime.",
  },
  {
    q: "What if I have a different type of website?",
    a: "Reach out and we'll build you a custom plan.",
  },
];

const Check = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className="mt-1 flex-shrink-0 text-primary"
    aria-hidden="true"
  >
    <path
      d="M2 7L6 11L12 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

const PlanCard = ({ plan, gridCols }: { plan: Plan; gridCols: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className={`relative flex flex-col border-2 p-6 md:p-8 bg-card transition-all ${
      plan.popular
        ? "border-primary shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.35)] md:scale-[1.03] z-10"
        : "border-border hover:border-foreground/30"
    }`}
  >
    {plan.popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-mono uppercase tracking-widest font-bold whitespace-nowrap">
        Most Popular
      </div>
    )}

    <div className="mb-4">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
        {plan.name}
      </p>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-4xl md:text-5xl font-mono font-bold text-foreground">
          ${plan.price}
        </span>
        <span className="text-sm font-mono text-muted-foreground">/month</span>
      </div>
      <p className="text-sm font-mono text-foreground/80 leading-relaxed">
        {plan.tagline}
      </p>
    </div>

    <div className="h-px bg-border my-4" />

    <ul className="space-y-3 mb-6 flex-1">
      {plan.features.map((feature, i) => (
        <li key={i} className="flex gap-2 text-sm font-mono text-foreground/85 leading-relaxed">
          <Check />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <div className="pt-4 border-t border-border">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
        Best for
      </p>
      <p className="text-sm font-mono text-foreground/80 leading-relaxed">
        {plan.bestFor}
      </p>
    </div>
  </motion.div>
);

const PlanSection = ({
  id,
  label,
  title,
  subhead,
  plans,
  recommendation,
}: {
  id: string;
  label: string;
  title: string;
  subhead: string;
  plans: Plan[];
  recommendation?: string;
}) => {
  const cols =
    plans.length === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : plans.length === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2 max-w-4xl mx-auto";

  return (
    <section id={id} className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
            {label}
          </p>
          <h2 className="text-3xl md:text-5xl font-mono font-bold text-foreground mb-4 max-w-3xl leading-tight">
            {title}
          </h2>
          <p className="text-base md:text-lg font-mono text-muted-foreground max-w-2xl mb-12 md:mb-16 leading-relaxed">
            {subhead}
          </p>
        </ScrollReveal>

        <div className={`grid grid-cols-1 ${cols} gap-6 md:gap-8 items-stretch`}>
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} gridCols={plans.length} />
          ))}
        </div>

        {recommendation && (
          <ScrollReveal>
            <div className="mt-12 max-w-3xl border-l-2 border-primary pl-6 py-2">
              <p className="text-sm font-mono text-foreground/80 leading-relaxed">
                {recommendation}
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

const MaintenancePlans = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToPlans = () => {
    document.getElementById("cms-plans")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageTransition>
      <Header />

      <main className="pt-24 md:pt-32">
        {/* HERO */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <ScrollReveal>
            <TypedHeader text="Maintenance" className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-foreground leading-[1.05] max-w-5xl mb-8">
              Maintenance Plans That Keep Your Website Working for You
            </h1>
            <p className="text-lg md:text-xl font-mono text-muted-foreground max-w-3xl leading-relaxed mb-10">
              Your website is an investment. Our maintenance plans keep it secure, updated, and actually driving customers to your business. Pick the plan that fits your goals.
            </p>
            <button
              onClick={scrollToPlans}
              data-magnetic
              className="inline-flex items-center gap-3 bg-foreground text-background px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              See Plans Below
              <span aria-hidden="true">↓</span>
            </button>
          </ScrollReveal>
        </section>

        {/* INTRO */}
        <section className="container mx-auto px-6 py-12 md:py-16 border-t border-border">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="text-base md:text-lg font-mono text-foreground/85 leading-relaxed mb-6">
                Reed Digital Group offers different maintenance tiers based on the type of website you have. CMS-driven sites need more hands-on care. Small business sites need steady upkeep. Landing pages need lighter, focused support. Below you'll find the right plans for each.
              </p>
              <div className="border border-border bg-secondary/40 p-5">
                <p className="text-sm font-mono text-foreground/80 leading-relaxed">
                  <span className="text-primary font-bold">Note:</span> Not sure which category your website falls under? <Link to="/contact" className="underline underline-offset-4 hover:text-primary transition-colors">Contact us</Link> and we'll help you figure it out.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* SECTION 1 — CMS */}
        <PlanSection
          id="cms-plans"
          label="Section 01 — Brochure + CMS"
          title="For Brochure Websites with a Custom CMS"
          subhead="Multi-page websites with a custom admin panel for managing content, photos, and information. Ideal for established businesses that need ongoing content updates."
          plans={cmsPlans}
          recommendation="Most clients with a CMS-driven site pick the Pro plan. At $400/month it's the sweet spot — unlimited updates, seasonal refreshes, search ranking help, and newsletter management. The lower tiers keep the lights on; Pro is what turns your website into a working part of the business."
        />

        {/* SECTION 2 — SMB */}
        <PlanSection
          id="smb-plans"
          label="Section 02 — Small Business"
          title="For Small Business Brochure Websites"
          subhead="Multi-page informational websites without a custom CMS. Ideal for service businesses, consultants, and local shops."
          plans={smbPlans}
          recommendation="The Pro plan is the recommended choice for most small businesses. At $300/month you get unlimited content changes, quarterly refreshes, monthly newsletter, Google Business Profile management, and direct phone support — full-service care for a site that's actively driving your business."
        />

        {/* SECTION 3 — Landing */}
        <PlanSection
          id="landing-plans"
          label="Section 03 — Landing Pages"
          title="For Landing Pages and One-Page Websites"
          subhead="Single-page websites designed for one clear goal. Ideal for personal brands, coming-soon pages, or focused campaigns."
          plans={landingPlans}
        />

        {/* COMPARISON */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
                Quick Comparison
              </p>
              <h2 className="text-3xl md:text-5xl font-mono font-bold text-foreground mb-12 max-w-3xl leading-tight">
                Recommended Plan by Website Type
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border max-w-5xl">
              {[
                { type: "Brochure Website with CMS", tier: "Pro", price: 400 },
                { type: "Small Business Website", tier: "Pro", price: 300 },
                { type: "Landing Page", tier: "Growth", price: 100 },
              ].map((item, i) => (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-card p-8 md:p-10"
                >
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    {item.type}
                  </p>
                  <p className="text-sm font-mono text-foreground/70 mb-6">
                    Recommended → <span className="text-primary font-bold">{item.tier}</span>
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                      ${item.price}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">/month</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
                FAQ
              </p>
              <h2 className="text-3xl md:text-5xl font-mono font-bold text-foreground mb-12 max-w-3xl leading-tight">
                Common Questions
              </h2>
            </ScrollReveal>

            <div className="max-w-3xl border-t border-border">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 md:py-6 text-left hover:text-primary transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-base md:text-lg font-mono font-medium text-foreground pr-6">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl font-mono text-primary flex-shrink-0"
                    >
                      +
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? "auto" : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm md:text-base font-mono text-muted-foreground leading-relaxed max-w-2xl">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 md:py-32 border-t border-border bg-secondary/30">
          <div className="container mx-auto px-6 text-center">
            <ScrollReveal>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mb-6">
                Get Started
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-mono font-bold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
                Not sure which plan is right for you?
              </h2>
              <p className="text-base md:text-lg font-mono text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
                Text Terell directly and we'll figure it out together.
              </p>
              <Link
                to="/contact"
                data-magnetic
                className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contact Us
                <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default MaintenancePlans;
