import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const rotators = ["websites.", "mobile apps.", "branding.", "web apps.", "digital products."];

const HeroSection = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % rotators.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative bg-background border-b border-foreground/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-44 pb-24 md:pb-32 relative">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-10"
        >
          <span className="h-1.5 w-1.5 bg-brand" />
          Remote agency · Washington DC
          <span className="hidden md:inline">— available for Q3 projects</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[0.92] tracking-[-0.045em] font-medium max-w-5xl"
        >
          We design and build
          <br />
          <span className="inline-flex items-baseline">
            <span className="italic text-brand mr-3">{rotators[i]}</span>
          </span>
          <br />
          <span className="text-muted-foreground">for ambitious teams.</span>
        </motion.h1>

        {/* Sub + actions */}
        <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="md:col-span-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md"
          >
            Websites and apps for businesses that want to look great online —
            crafted in the open, priced fairly, shipped without drama.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-6 flex flex-wrap gap-3 md:justify-end"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-foreground/85 transition-colors"
            >
              Start a project →
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 border border-foreground/15 px-7 py-4 text-[11px] uppercase tracking-[0.3em] hover:border-foreground/40 transition-colors"
            >
              View work
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 border border-foreground/15 px-7 py-4 text-[11px] uppercase tracking-[0.3em] hover:border-foreground/40 transition-colors"
            >
              Pricing
            </Link>
          </motion.div>
        </div>

        {/* Bottom meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10"
        >
          {[
            { k: "120+", v: "Projects shipped" },
            { k: "8 yrs", v: "Building on the web" },
            { k: "30+", v: "Active clients" },
            { k: "DC ↔ remote", v: "Anywhere you are" },
          ].map((m) => (
            <div key={m.v} className="bg-background p-6 md:p-7">
              <div className="text-2xl md:text-3xl tracking-tight">{m.k}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {m.v}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
