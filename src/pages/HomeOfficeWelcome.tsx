import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    k: "01",
    title: "Work Assistant",
    body: "Daily notes, goals, and standups in one focused workspace.",
  },
  {
    k: "02",
    title: "Bills Tracker",
    body: "Monthly bills vs. maintenance income, side by side.",
  },
  {
    k: "03",
    title: "Invoice Admin",
    body: "Send invoices, accept cards, track every payment.",
  },
  {
    k: "04",
    title: "ROI Tracker",
    body: "Plaid-connected income & expense reporting (soon).",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const HomeOfficeWelcome = () => {
  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-50" />

      {/* Background watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="text-[28vw] font-bold text-white/[0.025] tracking-widest select-none">
          RDG
        </span>
      </motion.div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <Link to="/" className="text-[11px] uppercase tracking-[0.3em] text-white/60 hover:text-brand transition-colors">
          ← Reed Digital Group
        </Link>
        <Link
          to="/home-office/login"
          className="text-[11px] uppercase tracking-[0.3em] text-white/60 hover:text-brand transition-colors"
        >
          Sign In
        </Link>
      </motion.nav>

      {/* Hero */}
      <main className="relative z-10 px-6 md:px-12">
        <section className="max-w-5xl mx-auto pt-20 md:pt-32 pb-24">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6"
          >
            Home Office — Private Workspace
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
          >
            Run your business
            <br />
            <span className="text-brand">from one quiet room.</span>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-xl text-sm md:text-base text-white/60 leading-relaxed"
          >
            A focused suite for solo operators and small teams. Notes, bills,
            invoices, and reporting — designed to disappear when you're
            working.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/home-office/login?mode=signup"
              className="group bg-brand text-brand-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-brand/90 transition-colors"
            >
              Start 7-day free trial →
            </Link>
            <Link
              to="/home-office/login"
              className="px-8 py-4 text-xs uppercase tracking-[0.25em] text-white/70 border border-white/15 hover:border-white hover:text-white transition-colors"
            >
              I have an account
            </Link>
          </motion.div>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 text-[11px] uppercase tracking-widest text-white/40"
          >
            $20 / month after trial · Cancel anytime
          </motion.p>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto border-t border-white/10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {features.map((f, i) => (
              <motion.div
                key={f.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-black p-8 md:p-10"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand mb-6">
                  {f.k}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-3xl mx-auto py-24 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6"
          >
            Pricing
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border border-white/15 p-10 md:p-14"
          >
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl md:text-7xl font-bold tracking-tight">
                $20
              </span>
              <span className="text-sm text-white/50 uppercase tracking-widest">
                / month
              </span>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Free for 7 days. Then $20/month. Cancel anytime.
            </p>
            <ul className="mt-10 space-y-3 text-sm text-white/70 text-left max-w-sm mx-auto">
              {[
                "Full Work Assistant access",
                "Unlimited bills & income tracking",
                "Invoice admin & Stripe billing",
                "All future tools included",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="text-brand mt-0.5">—</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/home-office/login?mode=signup"
              className="mt-10 inline-block bg-brand text-brand-foreground px-10 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-brand/90 transition-colors"
            >
              Start free trial
            </Link>
          </motion.div>
        </section>

        <footer className="max-w-5xl mx-auto py-10 border-t border-white/10 text-[10px] uppercase tracking-[0.3em] text-white/40 flex justify-between">
          <span>© Reed Digital Group</span>
          <Link to="/home-office/login" className="hover:text-brand">Sign in</Link>
        </footer>
      </main>
    </div>
  );
};

export default HomeOfficeWelcome;