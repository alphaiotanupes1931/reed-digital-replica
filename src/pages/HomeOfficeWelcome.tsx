import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
    title: "Client Portal",
    body: "Give clients a private window into projects, invoices, and updates.",
  },
  {
    k: "05",
    title: "ROI Tracker",
    body: "Plaid-connected income & expense reporting (soon).",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const HomeOfficeWelcome = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const markerX = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-50" />

      {/* Background watermark with parallax */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: heroY }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="text-[28vw] font-bold text-white/[0.03] tracking-widest select-none">
          RDG
        </span>
      </motion.div>

      {/* Animated gold glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-brand/20 blur-[140px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="pointer-events-none absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-brand/15 blur-[140px]"
      />

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
        <section ref={heroRef} className="max-w-5xl mx-auto pt-20 md:pt-32 pb-24 relative">
          <motion.div style={{ opacity: heroOpacity }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] overflow-hidden">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Home Office by RDG
              </motion.span>
            </span>
          </h1>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left", x: markerX }}
            className="mt-6 h-[2px] w-32 bg-brand"
          />

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
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/home-office/login?mode=signup"
                className="group inline-block bg-brand text-brand-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-brand/90 transition-colors"
              >
                Start 7-day free trial →
              </Link>
            </motion.div>
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
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-24 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            <motion.span
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            <span>Scroll to explore</span>
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto border-t border-white/10 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-12"
          >
            Everything inside.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {features.map((f, i) => (
              <motion.div
                key={f.k}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="bg-black p-8 md:p-10 group relative overflow-hidden"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                  style={{ transformOrigin: "left" }}
                  className="absolute top-0 left-0 h-[1px] w-full bg-brand/40"
                />
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand mb-6">
                  {f.k}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight group-hover:text-brand transition-colors">
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