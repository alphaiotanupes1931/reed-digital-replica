import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Text scramble effect hook
const useTextScramble = (finalText: string, trigger: boolean, speed = 30) => {
  const [display, setDisplay] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        finalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iteration += 1 / speed;
      if (iteration >= finalText.length) {
        clearInterval(interval);
        setDisplay(finalText);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, finalText, speed]);

  return display;
};

const HomeOfficeWelcome = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [scrambleTrigger, setScrambleTrigger] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const heroScroll = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll.scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(heroScroll.scrollYProgress, [0, 1], [1, 0.2]);
  const markerX = useTransform(heroScroll.scrollYProgress, [0, 1], ["0%", "60%"]);
  const heroScale = useTransform(heroScroll.scrollYProgress, [0, 1], [1, 0.9]);

  const scrambledTitle = useTextScramble("HOME OFFICE BY RDG", scrambleTrigger, 2.5);

  useEffect(() => {
    const timer = setTimeout(() => setScrambleTrigger(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax for glows
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 30);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 30);
  };

  const glowX = useTransform(mouseX, (v) => v);
  const glowY = useTransform(mouseY, (v) => v);

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative" onMouseMove={handleMouseMove}>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background watermark with parallax */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: heroY }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <motion.span
          initial={{ opacity: 0, rotateX: 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[28vw] font-bold text-white/[0.03] tracking-widest select-none"
          style={{ perspective: 1000 }}
        >
          RDG
        </motion.span>
      </motion.div>

      {/* Animated gold glow - follows mouse slightly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-brand/20 blur-[140px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{ x: useTransform(mouseX, (v) => -v), y: useTransform(mouseY, (v) => -v) }}
        className="pointer-events-none absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-brand/15 blur-[140px]"
      />

      {/* Floating grid lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.03 }}
            transition={{ duration: 1.5, delay: 0.8 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 h-px bg-white"
            style={{ top: `${15 + i * 14}%` }}
          />
        ))}
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <motion.div
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link to="/" className="text-[11px] uppercase tracking-[0.3em] text-white/60 hover:text-brand transition-colors">
            ← Reed Digital Group
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/home-office/login"
            className="text-[11px] uppercase tracking-[0.3em] text-white/60 hover:text-brand transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
      </motion.nav>

      {/* Hero */}
      <main className="relative z-10 px-6 md:px-12">
        <section ref={heroRef} className="max-w-5xl mx-auto pt-20 md:pt-32 pb-24 relative">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
            {/* Label with typewriter feel */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6"
            >
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ●
              </motion.span>{" "}
              Private Workspace
            </motion.p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] overflow-hidden">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%", rotateX: -80 }}
                  animate={{ y: "0%", rotateX: 0 }}
                  transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                  style={{ perspective: 1000 }}
                >
                  {scrambleTrigger ? scrambledTitle : "HOME OFFICE BY RDG"}
                </motion.span>
              </span>
            </h1>

            {/* Animated underline with glow */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left", x: markerX }}
              className="mt-6 h-[2px] w-32 bg-brand relative"
            >
              <motion.div
                className="absolute inset-0 bg-brand blur-md"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 max-w-xl text-sm md:text-base text-white/60 leading-relaxed"
            >
              A focused suite for solo operators and small teams. Notes, bills,
              invoices, and reporting — designed to disappear when you're
              working.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/home-office/login?mode=signup"
                  className="group inline-block bg-brand text-brand-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-brand/90 transition-colors relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="relative z-10">Start 7-day free trial →</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/home-office/login"
                  className="px-8 py-4 text-xs uppercase tracking-[0.25em] text-white/70 border border-white/15 hover:border-white hover:text-white transition-colors"
                >
                  I have an account
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-6 text-[11px] uppercase tracking-widest text-white/40"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                $20 / month after trial · Cancel anytime
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-24 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            <motion.span
              animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            <span>Scroll to explore</span>
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto border-t border-white/10 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 30, skewX: -3 }}
            whileInView={{ opacity: 1, y: 0, skewX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-12"
          >
            Everything inside.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {features.map((f, i) => (
              <motion.div
                key={f.k}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-black p-8 md:p-10 group relative overflow-hidden cursor-default"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  style={{ transformOrigin: "left" }}
                  className="absolute top-0 left-0 h-[1px] w-full bg-brand/40"
                />
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="text-[10px] uppercase tracking-[0.3em] text-brand mb-6"
                >
                  {f.k}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight group-hover:text-brand transition-colors duration-300">
                  {f.title}
                </h3>
                <motion.p
                  initial={{ opacity: 0.5 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="text-sm text-white/55 leading-relaxed"
                >
                  {f.body}
                </motion.p>

                {/* Corner accent on hover */}
                <motion.div
                  className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-brand/0 group-hover:border-brand/40 transition-colors duration-500"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-3xl mx-auto py-24 text-center relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.05]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.4em] text-brand mb-6"
          >
            Pricing
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className="border border-white/15 p-10 md:p-14 relative overflow-hidden group"
          >
            {/* Animated border glow on hover */}
            <motion.div
              className="absolute inset-0 border border-brand/0 group-hover:border-brand/30 transition-colors duration-500"
            />

            <div className="flex items-baseline justify-center gap-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl md:text-7xl font-bold tracking-tight"
              >
                $20
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-white/50 uppercase tracking-widest"
              >
                / month
              </motion.span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 text-sm text-white/60"
            >
              Free for 7 days. Then $20/month. Cancel anytime.
            </motion.p>
            <motion.ul
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="mt-10 space-y-3 text-sm text-white/70 text-left max-w-sm mx-auto"
            >
              {[
                "Full Work Assistant access",
                "Unlimited bills & income tracking",
                "Invoice admin & Stripe billing",
                "All future tools included",
              ].map((t) => (
                <motion.li key={t} variants={staggerItem} className="flex items-start gap-3">
                  <motion.span
                    className="text-brand mt-0.5"
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    —
                  </motion.span>
                  <span>{t}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 inline-block"
            >
              <Link
                to="/home-office/login?mode=signup"
                className="inline-block bg-brand text-brand-foreground px-10 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-brand/90 transition-colors relative overflow-hidden group/btn"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-200%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="relative z-10">Start free trial</span>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto py-10 border-t border-white/10 text-[10px] uppercase tracking-[0.3em] text-white/40 flex justify-between items-center"
        >
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            © Reed Digital Group
          </motion.span>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/home-office/login" className="hover:text-brand transition-colors">
              Sign in →
            </Link>
          </motion.div>
        </motion.footer>
      </main>
    </div>
  );
};

export default HomeOfficeWelcome;
