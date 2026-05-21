import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppsHero3D from "@/components/AppsHero3D";
import { Suspense } from "react";

const features = [
  {
    title: "Client Portal",
    desc: "View invoices, pay securely, and track every project from one place.",
  },
  {
    title: "Home Office",
    desc: "Internal workspace for the RDG team — bills, goals, and daily notes.",
  },
  {
    title: "More Coming",
    desc: "ROI tracking, automated reporting, and AI-powered tooling on the way.",
  },
];

const points = [
  { k: "01", t: "Built for our clients", d: "Every app is shaped around how RDG actually delivers work — no bloat, no fluff." },
  { k: "02", t: "One login, every tool", d: "Sign in once and move between the portal, workspace, and future apps seamlessly." },
  { k: "03", t: "Private by default", d: "Your data stays yours. No analytics, no resale, no surprises." },
];

const AppsLanding = () => {
  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />

      <main className="pt-32 pb-24">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative border-b-2 border-foreground pb-16 mb-16 min-h-[70vh] flex flex-col justify-center overflow-hidden"
          >
            <Suspense fallback={null}>
              <AppsHero3D />
            </Suspense>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background pointer-events-none" />

            <p className="text-xs uppercase tracking-[0.3em] text-brand mb-6">RDG Apps · v1.0</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              The toolkit
              <br />
              behind every
              <br />
              <span className="text-brand">RDG project.</span>
            </h1>
            <p className="text-base text-muted-foreground mt-8 max-w-2xl">
              RDG Apps is a private suite of tools we built for our clients and our team —
              billing, project tracking, internal workflows. Lightweight, fast, and made to last.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/apps/login"
                className="group relative bg-foreground text-background px-8 py-4 text-sm uppercase tracking-widest overflow-hidden transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                <span className="relative z-10">Create Account</span>
              </Link>
              <Link
                to="/apps/login"
                className="border-2 border-foreground px-8 py-4 text-sm uppercase tracking-widest hover:border-brand hover:text-brand transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* What is RDG Apps */}
          <section className="mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">What is RDG Apps?</p>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <h2 className="md:col-span-5 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                A members-only platform
                <br />
                <span className="text-brand">built by Reed Digital Group.</span>
              </h2>
              <div className="md:col-span-7 space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  We build software for businesses every day — and we got tired of clients juggling
                  email threads, PDFs, and spreadsheets just to pay an invoice or check on a project.
                </p>
                <p>
                  <span className="text-foreground font-bold">RDG Apps</span> is the home for every tool
                  we ship: a Client Portal for invoices and project status, a Home Office for our
                  team, and new tools rolling out monthly — ROI tracking, AI assistants, and more.
                </p>
                <p>
                  One account. Every app. Designed, built, and maintained by RDG.
                </p>
              </div>
            </div>
          </section>

          {/* What's inside */}
          <section className="mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">What's inside</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border-2 border-foreground p-8 hover:border-brand hover:bg-brand/5 transition-all"
                >
                  <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Why it matters */}
          <section className="mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">Why it matters</p>
            <div className="space-y-px bg-foreground border-2 border-foreground">
              {points.map((p) => (
                <div key={p.k} className="bg-background p-8 grid grid-cols-12 gap-6 items-start">
                  <span className="col-span-2 md:col-span-1 text-brand text-sm">{p.k}</span>
                  <h4 className="col-span-10 md:col-span-3 text-base font-bold tracking-tight">{p.t}</h4>
                  <p className="col-span-12 md:col-span-8 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="border-2 border-foreground p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to get started?</h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              Create a free account to access the Client Portal and any apps we ship next.
            </p>
            <Link
              to="/apps/login"
              className="inline-block mt-8 bg-brand text-brand-foreground px-10 py-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              Create Account
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLanding;