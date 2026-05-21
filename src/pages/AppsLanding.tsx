import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppsGlobe3D from "@/components/AppsGlobe3D";

const features = [
  {
    pill: "MEMBERS ONLY",
    pillBg: "bg-brand text-brand-foreground",
    title: "Client Portal",
    desc: "Pay invoices, view receipts, and track every project — all in one secure place.",
    cardBg: "bg-[#f4ede0]",
  },
  {
    pill: "TEAM",
    pillBg: "bg-foreground text-background",
    title: "Home Office",
    desc: "Internal workspace for RDG staff. Bills, goals, daily notes, and AI assistants.",
    cardBg: "bg-[#e8e8e8]",
  },
  {
    pill: "SOON",
    pillBg: "bg-brand/20 text-brand",
    title: "ROI Tracker",
    desc: "Plaid-powered financial insights so you always know what your investment is returning.",
    cardBg: "bg-[#f0eadf]",
  },
];

const benefits = [
  {
    pill: "ONE LOGIN",
    title: "Every tool, one account",
    desc: "Sign in once and jump between the Client Portal, Home Office, and every app we ship next.",
    cardBg: "bg-[#1a1a1a] text-background",
    pillBg: "bg-brand text-brand-foreground",
  },
  {
    pill: "PRIVATE",
    title: "Your data stays yours",
    desc: "No analytics resale, no third-party tracking. Built by RDG, hosted on infrastructure we trust.",
    cardBg: "bg-[#f4ede0]",
    pillBg: "bg-foreground text-background",
  },
  {
    pill: "MONTHLY",
    title: "Free insights, every month",
    desc: "Members get a private monthly brief: industry trends, growth ideas, and tools we recommend.",
    cardBg: "bg-[#e8e8e8]",
    pillBg: "bg-brand text-brand-foreground",
  },
];

const AppsLanding = () => {
  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />

      <main>
        {/* ====== HERO ====== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-background">
          {/* Subtle 3D globe in background */}
          <div className="absolute inset-0 opacity-60">
            <Suspense fallback={null}>
              <AppsGlobe3D />
            </Suspense>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-[#0a0a0a] pointer-events-none" />

          <div className="relative z-10 text-center px-4 pointer-events-none max-w-5xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[10px] uppercase tracking-[0.5em] text-brand mb-8"
            >
              Reed Digital Group
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[18vw] md:text-[12rem] font-bold tracking-tight leading-[0.85]"
            >
              RDG{" "}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "200% 50%" }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="bg-[linear-gradient(90deg,#d4a82a,#ffe8a3,#d4a82a,#8a6a14,#d4a82a)] bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                APPS
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-sm md:text-lg text-background/70 mt-10 max-w-xl mx-auto leading-relaxed"
            >
              The members-only platform powering every tool Reed Digital Group builds —
              billing, projects, and the apps we ship next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap gap-3 justify-center mt-10 pointer-events-auto"
            >
              <Link
                to="/apps/login"
                className="bg-brand text-brand-foreground px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/apps/login"
                className="border border-background/40 px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-background/40"
          >
            scroll
          </motion.div>
        </section>

        {/* ====== FEATURES TAILORED ====== */}
        <section className="py-24 md:py-32 px-4 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="container max-w-6xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Apps tailored to your workflow
            </h2>
          </motion.div>

          <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className={`${f.cardBg} p-8 md:p-10 relative overflow-hidden group transition-shadow hover:shadow-2xl`}
              >
                <div className="flex items-start justify-end mb-12">
                  <span className={`${f.pillBg} text-[10px] uppercase tracking-widest px-3 py-1`}>
                    {f.pill}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-foreground/70 mt-4 leading-relaxed min-h-[4rem]">
                  {f.desc}
                </p>

                {/* Mini visual mock */}
                <div className="mt-8 bg-background border border-foreground/10 p-4 group-hover:border-brand/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase tracking-widest text-foreground/50">
                      {f.title}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-brand" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-foreground/10 w-3/4" />
                    <div className="h-2 bg-foreground/10 w-1/2" />
                    <div className="h-2 bg-brand/40 w-2/3 mt-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====== WHY MEMBERS ====== */}
        <section className="py-24 md:py-32 px-4 bg-[#f7f3eb]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container max-w-6xl mx-auto mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand mb-4">Why members</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
              Built for the people we build with.
            </h2>
          </motion.div>

          <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`${b.cardBg} p-8 md:p-10 transition-shadow hover:shadow-2xl`}
              >
                <span className={`${b.pillBg} text-[10px] uppercase tracking-widest px-3 py-1 inline-block`}>
                  {b.pill}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-12">
                  {b.title}
                </h3>
                <p className="text-sm opacity-70 mt-4 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====== CTA STRIP ====== */}
        <section className="py-24 md:py-32 px-4 bg-[#0a0a0a] text-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              Ready to <span className="text-brand">join?</span>
            </h2>
            <p className="text-sm md:text-base text-background/60 mt-6 max-w-md mx-auto">
              Create a free RDG account to access every app on the platform.
            </p>
            <Link
              to="/apps/login"
              className="inline-block mt-10 bg-brand text-brand-foreground px-12 py-4 text-xs uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
            >
              Create Account
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLanding;