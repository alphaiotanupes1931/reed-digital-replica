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

const maintenancePlans: Plan[] = [
  {
    name: "Basic",
    price: 150,
    tagline: "Keeps your website online and protected.",
    features: [
      "Hosting, SSL, and security monitoring",
      "Weekly backups",
      "We fix things if they break",
      "Email support (2 business day response)",
      "1 content update per month",
    ],
    bestFor: "Businesses with a simple site they rarely change.",
  },
  {
    name: "Standard",
    price: 300,
    tagline: "The plan most small businesses need.",
    features: [
      "Everything in Basic",
      "3 content updates per month",
      "Uptime monitoring",
      "Daily backups",
      "Same-day text support (48hr response)",
      "Monthly performance report",
    ],
    bestFor: "Businesses that want their site to stay fresh and help them grow.",
    popular: true,
  },
  {
    name: "Premium",
    price: 500,
    tagline: "Hands off. We handle everything.",
    features: [
      "Everything in Standard",
      "Unlimited minor updates",
      "Priority support",
      "Monthly performance report",
      "Quarterly site refresh",
      "Google Business Profile management",
    ],
    bestFor: "Businesses using their website as a serious marketing tool.",
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
                Reed Digital Group offers three straightforward maintenance tiers. Pick the one that matches how active your site is. Already on a monthly Website or App plan? Maintenance is included free.
              </p>
              <div className="border border-border bg-secondary/40 p-5">
                <p className="text-sm font-mono text-foreground/80 leading-relaxed">
                  <span className="text-primary font-bold">Note:</span> Not sure which plan fits your site? <Link to="/contact" className="underline underline-offset-4 hover:text-primary transition-colors">Contact us</Link> and we'll help you figure it out.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* PLANS */}
        <PlanSection
          id="cms-plans"
          label="Maintenance Plans"
          title="Three Plans. Pick What Fits."
          subhead="Hosting, security, backups, and updates handled monthly. Or skip this entirely — every monthly Website or App plan already includes maintenance free."
          plans={maintenancePlans}
          recommendation="Most small businesses pick the Standard plan at $300/month. It's the sweet spot — three updates a month, daily backups, uptime monitoring, and same-day text support. Heavier sites should look at Premium for unlimited minor updates and quarterly refreshes."
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
                { type: "Simple / Landing Page", tier: "Basic", price: 150 },
                { type: "Small Business Website", tier: "Standard", price: 300 },
                { type: "Active / E-commerce Site", tier: "Premium", price: 500 },
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
