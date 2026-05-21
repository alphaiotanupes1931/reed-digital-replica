import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const apps = [
  {
    n: "01",
    t: "Client Portal",
    d: "Invoices, payments, contracts, and project status — every active engagement in a single workspace.",
    s: "Available",
    mock: "portal",
  },
  {
    n: "02",
    t: "Home Office",
    d: "The internal workspace our team runs on. Tasks, briefs, and the work assistant built in.",
    s: "Staff",
    mock: "office",
  },
  {
    n: "03",
    t: "ROI Tracker",
    d: "Plaid-powered financial insights. See spend, return, and cash flow across every channel.",
    s: "Soon",
    mock: "roi",
  },
];

const PortalMock = () => (
  <div className="w-full aspect-[4/3] bg-foreground/[0.03] border border-foreground/10 p-6 flex flex-col gap-3">
    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
      <span>Invoice #RDG-0421</span>
      <span className="text-brand">Paid</span>
    </div>
    <div className="text-3xl font-bold tracking-tight">$4,820.00</div>
    <div className="h-px bg-foreground/10 my-2" />
    {["Website redesign", "Hosting · 12 mo", "Strategy session"].map((l, i) => (
      <div key={i} className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{l}</span>
        <span className="font-mono">${[3200, 1140, 480][i]}.00</span>
      </div>
    ))}
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="h-[2px] bg-brand mt-auto"
    />
  </div>
);

const OfficeMock = () => (
  <div className="w-full aspect-[4/3] bg-foreground/[0.03] border border-foreground/10 p-6 flex flex-col gap-2">
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
      Today · 6 tasks
    </div>
    {[
      ["Draft Q3 proposal", "shell"],
      ["Review Plaid integration", "0616"],
      ["Capability Statement v4", "shell"],
      ["Invoice batch — Friday", "0616"],
    ].map(([task, who], i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 + i * 0.08 }}
        className="flex items-center gap-3 py-2 border-t border-foreground/10"
      >
        <span className="w-3 h-3 border border-foreground/30" />
        <span className="text-xs flex-1">{task}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{who}</span>
      </motion.div>
    ))}
  </div>
);

const RoiMock = () => (
  <div className="w-full aspect-[4/3] bg-foreground/[0.03] border border-foreground/10 p-6 flex flex-col">
    <div className="flex items-baseline justify-between mb-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">ROI · 30d</span>
      <span className="text-brand text-xs">+18.2%</span>
    </div>
    <div className="text-3xl font-bold tracking-tight mb-4">$12,940</div>
    <svg viewBox="0 0 200 80" className="w-full flex-1">
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        d="M0,60 L25,55 L50,50 L75,40 L100,42 L125,30 L150,28 L175,18 L200,10"
        fill="none"
        stroke="hsl(var(--brand))"
        strokeWidth="1.5"
      />
      <line x1="0" y1="79" x2="200" y2="79" stroke="currentColor" strokeOpacity="0.1" />
    </svg>
  </div>
);

const mocks: Record<string, () => JSX.Element> = {
  portal: PortalMock,
  office: OfficeMock,
  roi: RoiMock,
};

const AppsLanding = () => {
  return (
    <div className="min-h-screen bg-background font-mono text-foreground">
      <Header />

      <main>
        {/* ====== HERO ====== */}
        <section className="relative px-6 md:px-12 pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden">
          <div className="max-w-6xl mx-auto w-full">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-8"
            >
              RDG Apps — v1.0
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[8.5rem] font-bold tracking-tight leading-[0.92] max-w-5xl"
            >
              The members system <span className="text-brand">for everything</span> we build.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mt-8 max-w-xl leading-relaxed"
            >
              One account. Every app Reed Digital Group ships. Free for members.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-6 mt-10"
            >
              <Link
                to="/apps/login"
                className="bg-foreground text-background px-7 py-3 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/apps/login"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Sign in →
              </Link>
            </motion.div>

            {/* Animated product preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mt-20 md:mt-28 grid grid-cols-12 gap-4"
            >
              <div className="col-span-12 md:col-span-7 bg-foreground/[0.03] border border-foreground/10 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-3">apps.reeddigitalgroup.com</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Welcome back, shell</div>
                <div className="text-2xl md:text-4xl font-bold tracking-tight mb-8">3 apps · 2 active</div>
                <div className="grid grid-cols-3 gap-3">
                  {apps.map((a, i) => (
                    <motion.div
                      key={a.n}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="aspect-square border border-foreground/10 p-3 flex flex-col justify-between hover:border-brand transition-colors"
                    >
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{a.n}</span>
                      <span className="text-xs font-bold leading-tight">{a.t}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <PortalMock />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====== TRUSTED ====== */}
        <section className="px-6 md:px-12 py-12 border-t border-foreground/10">
          <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-y-4 gap-x-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Built by Reed Digital Group
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
              <span>Stripe</span>
              <span>Plaid</span>
              <span>Supabase</span>
              <span>Google</span>
              <span>Resend</span>
            </div>
          </div>
        </section>

        {/* ====== FEATURE BLOCKS ====== */}
        {apps.map((app, i) => {
          const Mock = mocks[app.mock];
          const reverse = i % 2 === 1;
          return (
            <section
              key={app.n}
              className="px-6 md:px-12 py-24 md:py-32 border-t border-foreground/10"
            >
              <div className="max-w-6xl mx-auto w-full grid grid-cols-12 gap-6 md:gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`col-span-12 md:col-span-6 ${reverse ? "md:order-2" : ""}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
                    {app.n} — {app.s}
                  </p>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] mb-6">
                    {app.t}
                  </h2>
                  <p className="text-base text-muted-foreground max-w-md leading-relaxed">
                    {app.d}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`col-span-12 md:col-span-6 ${reverse ? "md:order-1" : ""}`}
                >
                  <Mock />
                </motion.div>
              </div>
            </section>
          );
        })}

        {/* ====== PULL STATEMENT ====== */}
        <section className="px-6 md:px-12 py-32 md:py-48 border-t border-foreground/10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
              The point
            </p>
            <p className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Stop chasing invoices in email. Stop hunting for files in Drive.
              <span className="text-muted-foreground"> One login. Every app we ship. Always free for members.</span>
            </p>
          </motion.div>
        </section>

        {/* ====== CTA ====== */}
        <section className="px-6 md:px-12 py-32 md:py-48 border-t border-foreground/10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto w-full"
          >
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-[0.92]">
              Become a <span className="text-brand">member.</span>
            </h2>
            <p className="text-base text-muted-foreground mt-8 max-w-md">
              Free account. Takes a minute. Access every app we ship.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-12">
              <Link
                to="/apps/login"
                className="bg-foreground text-background px-7 py-3 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/apps/login"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                I already have one →
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLanding;