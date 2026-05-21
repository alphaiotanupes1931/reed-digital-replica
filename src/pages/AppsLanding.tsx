import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppsGlobe3D from "@/components/AppsGlobe3D";

const AppsLanding = () => {
  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />

      <main>
        {/* HERO — globe centerpiece */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* 3D Globe takes the whole hero */}
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <AppsGlobe3D />
            </Suspense>
          </div>

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />

          <div className="relative z-10 text-center px-4 pointer-events-none">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6"
            >
              Reed Digital Group
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-6xl md:text-8xl font-bold tracking-tight leading-none"
            >
              RDG APPS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm md:text-base text-muted-foreground mt-6 max-w-md mx-auto"
            >
              One account. Every tool we build. Members only.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3 justify-center mt-10 pointer-events-auto"
            >
              <Link
                to="/apps/login"
                className="bg-foreground text-background px-8 py-3 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/apps/login"
                className="border border-foreground px-8 py-3 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-[10px] uppercase tracking-widest text-muted-foreground mt-8 pointer-events-auto"
            >
              ↑ Drag the globe ↑
            </motion.p>
          </div>
        </section>

        {/* WHAT */}
        <section className="py-32 px-4">
          <div className="container max-w-3xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6">001 — What</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              A private suite of tools,
              <br />
              <span className="text-brand">built by RDG.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed">
              The Client Portal, Home Office, ROI tracking — every app we ship lives here.
              Members get full access.
            </p>
          </div>
        </section>

        {/* APPS LIST — minimal rows */}
        <section className="px-4 pb-32">
          <div className="container max-w-3xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand mb-8 text-center">002 — Inside</p>
            <div className="border-t border-foreground/20">
              {[
                { n: "01", t: "Client Portal", d: "Invoices, payments, project status" },
                { n: "02", t: "Home Office", d: "Bills, goals, daily notes — for the team" },
                { n: "03", t: "ROI Tracker", d: "Plaid-powered finance insights · soon" },
              ].map((row) => (
                <motion.div
                  key={row.n}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex items-baseline justify-between gap-6 py-6 border-b border-foreground/20 group hover:border-brand transition-colors"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="text-xs text-brand">{row.n}</span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-brand transition-colors">
                      {row.t}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground text-right hidden md:block">{row.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-32">
          <div className="container max-w-2xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6">003 — Join</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Become a member.
            </h2>
            <Link
              to="/apps/login"
              className="inline-block mt-8 bg-brand text-brand-foreground px-10 py-4 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLanding;