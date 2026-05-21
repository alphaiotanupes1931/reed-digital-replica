import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const apps = [
  {
    t: "Tax Tracker",
    d: "Expenses, mileage, invoices, 1099s, and tax-ready reports.",
    tag: "HEADLINE",
    headline: true,
  },
  {
    t: "Invoice Studio",
    d: "Send invoices, accept Stripe payments, track what's owed.",
  },
  {
    t: "Bills Tracker",
    d: "Monthly bills, recurring income, net profit at a glance.",
  },
  {
    t: "Work Assistant",
    d: "Daily notes, standups, and goal tracking.",
  },
  {
    t: "ROI Tracker",
    d: "Track investment performance across all accounts.",
    tag: "SOON",
  },
  {
    t: "More coming",
    d: "New apps every quarter. No price hike for existing subscribers.",
    muted: true,
  },
];

const pains = [
  {
    t: "Receipts disappear",
    d: "Glove box. Email. Crumpled in a drawer. Gone by January.",
  },
  {
    t: "Expenses untracked",
    d: "You're leaving $5K–$12K of deductions on the table every year.",
  },
  {
    t: "You don't know what you made",
    d: "Until your CPA tells you in April. Usually with a bill.",
  },
];

const features = [
  ["Schedule C categories built in", "All 22 IRS lines, mapped automatically."],
  ["Snap-and-save receipts", "Mobile camera upload, 5GB included."],
  ["Mileage at the IRS rate", "Log a trip, get the deduction. Updated yearly."],
  ["1099 tracking for subcontractors", "Flagged when they hit the $600 threshold."],
  ["One-click tax package", "A ZIP your CPA will actually thank you for."],
];

const planFeatures = [
  "All apps in the suite",
  "Unlimited expenses & invoices",
  "5GB receipt storage",
  "Annual tax package export",
  "Email support",
];

const Check = () => (
  <span className="inline-block w-3 h-3 mt-1.5 mr-3 border-l-2 border-b-2 border-brand rotate-[-45deg] shrink-0" />
);

const AppsLanding = () => {
  return (
    <div className="min-h-screen bg-background font-apps text-foreground">
      <Header />

      <main>
        {/* ====== HERO ====== */}
        <section className="px-6 md:px-12 pt-28 md:pt-36 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block border border-foreground/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-10"
            >
              RDG Suite · New
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              Run your business.
              <br />
              We'll run the <span className="text-brand">numbers.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mt-10 max-w-2xl mx-auto leading-relaxed"
            >
              A growing suite of business tools for freelancers and sole proprietors.
              One subscription. Five dollars a month.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              <Link
                to="/apps/login"
                className="bg-foreground text-background px-7 py-3.5 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                Start 14-day free trial
              </Link>
              <a
                href="#suite"
                className="border border-foreground/20 px-7 py-3.5 text-xs uppercase tracking-widest hover:border-foreground transition-colors"
              >
                See what's included
              </a>
            </motion.div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 md:mt-20 bg-muted border border-foreground/10 p-5 md:p-8 text-left"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">
                  app.reeddigitalgroup.com/dashboard
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                {[
                  ["YTD income", "$42,180", false],
                  ["YTD expenses", "$11,940", false],
                  ["Net profit", "$30,240", true],
                ].map(([l, v, hi], i) => (
                  <div
                    key={i}
                    className={`p-4 border ${
                      hi ? "bg-brand/10 border-brand/30" : "bg-background border-foreground/10"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      {l}
                    </div>
                    <div className="text-xl md:text-2xl font-bold">{v}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-2 md:gap-3 h-24">
                {[40, 55, 65, 70, 50, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 1 + i * 0.08 }}
                    className={`flex-1 ${i === 5 ? "bg-brand" : "bg-foreground/15"}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====== PAIN ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32 bg-muted/60 border-y border-foreground/10">
          <div className="max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Tax season shouldn't be a panic attack
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-4">
                The three things your accountant wishes you'd fix.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pains.map((p, i) => (
                <motion.div
                  key={p.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background border border-foreground/10 p-6"
                >
                  <div className="w-6 h-6 mb-6 border border-destructive/40 flex items-center justify-center text-destructive text-xs">
                    !
                  </div>
                  <h3 className="text-lg font-bold mb-3">{p.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== HEADLINE APP ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="col-span-12 md:col-span-7"
            >
              <span className="inline-block bg-brand/15 text-brand px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] mb-6">
                Headline App
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Track every dollar.
                <br />
                Save thousands at tax time.
              </h2>
              <p className="text-base text-muted-foreground mt-6 max-w-xl leading-relaxed">
                Tax Tracker is the headline app in RDG Suite. Built for the way
                self-employed people actually work — phone in one hand, receipt in the other.
              </p>

              <ul className="mt-10 space-y-5">
                {features.map(([t, d]) => (
                  <li key={t} className="flex">
                    <Check />
                    <div>
                      <div className="text-sm font-bold">{t}</div>
                      <div className="text-sm text-muted-foreground">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="col-span-12 md:col-span-5 bg-muted border border-foreground/10 p-6"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
                Expenses · May 2026
              </div>
              {[
                ["Adobe Creative Cloud", "Office expense", "$54.99"],
                ["Shell — fuel", "Car & truck", "$62.40"],
                ["Chipotle — client lunch", "Meals · 50% deductible", "$28.15"],
                ["USPS — shipping", "Office expense", "$14.20"],
              ].map(([n, c, p], i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center justify-between py-4 border-t border-foreground/10"
                >
                  <div>
                    <div className="text-sm font-bold">{n}</div>
                    <div className="text-[11px] text-muted-foreground">{c}</div>
                  </div>
                  <div className="text-sm font-bold">{p}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ====== SUITE GRID ====== */}
        <section id="suite" className="px-6 md:px-12 py-24 md:py-32 bg-muted/60 border-y border-foreground/10">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                One subscription. Every app.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-4">
                Five dollars a month unlocks the whole suite.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((a, i) => (
                <motion.div
                  key={a.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`p-6 border transition-colors ${
                    a.headline
                      ? "border-brand bg-background"
                      : a.muted
                      ? "border-dashed border-foreground/20 bg-transparent"
                      : "border-foreground/10 bg-background hover:border-foreground/30"
                  }`}
                >
                  {a.tag && (
                    <span
                      className={`inline-block px-2 py-1 text-[10px] uppercase tracking-[0.25em] mb-5 ${
                        a.headline ? "bg-brand/15 text-brand" : "border border-foreground/15 text-muted-foreground"
                      }`}
                    >
                      {a.tag}
                    </span>
                  )}
                  {!a.tag && <div className="h-[26px] mb-5" />}
                  <h3 className="text-xl font-bold mb-3">{a.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== PRICING ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto border border-foreground/15 p-10 text-center"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
              RDG Suite
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-3">
              <span className="text-6xl font-bold tracking-tight">$5</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <div className="text-xs text-muted-foreground mb-8">
              Billed monthly. Cancel anytime.
            </div>

            <ul className="text-left space-y-3 mb-10">
              {planFeatures.map((f) => (
                <li key={f} className="flex items-start text-sm">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/apps/login"
              className="block w-full bg-foreground text-background px-7 py-3.5 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
            >
              Start 14-day free trial
            </Link>
            <div className="text-[11px] text-muted-foreground mt-4">
              No credit card required
            </div>
          </motion.div>
        </section>

        {/* ====== CTA ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32 bg-foreground text-background">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Stop dreading tax season
            </h2>
            <p className="text-sm md:text-base text-background/60 mt-6">
              Start tracking today. Pay $0 for 14 days. Cancel anytime.
            </p>
            <Link
              to="/apps/login"
              className="inline-block mt-10 bg-brand text-brand-foreground px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
            >
              Create your free account
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLanding;
