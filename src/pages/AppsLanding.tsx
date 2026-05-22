import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const apps = [
  { t: "Tax Tracker", d: "Expenses, mileage, invoices, 1099s, and tax-ready reports." },
  { t: "Invoice Studio", d: "Send invoices, accept Stripe payments, track what's owed." },
  { t: "Bills Tracker", d: "Monthly bills, recurring income, net profit at a glance." },
  { t: "Work Assistant", d: "Daily notes, standups, and goal tracking." },
  { t: "ROI Tracker", d: "Track investment performance across all accounts." },
  { t: "More coming", d: "New apps every quarter. No price hike for existing subscribers.", muted: true },
];

const pains = [
  { t: "Receipts disappear", d: "Glove box. Email. Crumpled in a drawer. Gone by January." },
  { t: "Expenses untracked", d: "You're leaving $5K–$12K of deductions on the table every year." },
  { t: "You don't know what you made", d: "Until your CPA tells you in April. Usually with a bill." },
];

const features = [
  ["Schedule C categories built in", "All 22 IRS lines, mapped automatically."],
  ["Snap-and-save receipts", "Mobile camera upload, 5GB included."],
  ["Mileage at the IRS rate", "Log a trip, get the deduction. Updated yearly."],
  ["1099 tracking for subcontractors", "Flagged when they hit the $600 threshold."],
  ["One-click tax package", "A ZIP your CPA will actually thank you for."],
];

const plans = [
  {
    name: "Starter",
    price: 5,
    priceId: "price_1TZkBeLmYe19xWnILOPARN9c",
    tag: "Solo",
    features: [
      "Tax Tracker + Bills Tracker",
      "Up to 100 expenses / month",
      "1GB receipt storage",
      "CSV export",
      "Email support",
    ],
  },
  {
    name: "Suite",
    price: 10,
    priceId: "price_1TZkBfLmYe19xWnIDRoMFspp",
    tag: "Most popular",
    highlight: true,
    features: [
      "Every app in the suite",
      "Unlimited expenses & invoices",
      "5GB receipt storage",
      "Annual tax package export",
      "Stripe payments built in",
      "Priority email support",
    ],
  },
  {
    name: "Business",
    price: 15,
    priceId: "price_1TZkBfLmYe19xWnIwlTExp38",
    tag: "Teams",
    features: [
      "Everything in Suite",
      "25GB receipt storage",
      "1099 contractor portal",
      "Custom invoice branding",
      "Dedicated CPA handoff",
    ],
  },
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

const useTyping = (words: string[], speed = 90, pause = 1400) => {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    if (!del && text === word) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((p) => p + 1);
      return;
    }
    const t = setTimeout(() => {
      setText((p) => (del ? p.slice(0, -1) : word.slice(0, p.length + 1)));
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
};

const AppsLanding = () => {
  const typed = useTyping(["numbers.", "receipts.", "invoices.", "taxes.", "books."]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mouse-tracked 3D tilt for dashboard
  const dashRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 6, y: -8 });
  const handleDashMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = dashRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    setTilt({ x: -dy * 14, y: dx * 18 });
  };
  const resetTilt = () => setTilt({ x: 6, y: -8 });

  return (
    <div className="min-h-screen bg-background font-apps text-foreground">
      <Header />

      <main>
        {/* ====== HERO ====== */}
        <section className="px-6 md:px-12 pt-28 md:pt-36 pb-24 md:pb-32">
          <div className="max-w-5xl mx-auto w-full text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              Run your business.
              <br />
              We'll run the{" "}
              <span className="text-brand inline-block min-w-[1ch]">
                {typed}
                <span className="caret-blink inline-block w-[3px] h-[0.9em] bg-brand align-[-2px] ml-1" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mt-10 max-w-2xl mx-auto leading-relaxed"
            >
              A growing suite of business tools for freelancers and sole proprietors.
              One suite. One subscription.
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
                Log in or Sign up
              </Link>
              <a
                href="#suite"
                className="border border-foreground/20 px-7 py-3.5 text-xs uppercase tracking-widest hover:border-foreground transition-colors"
              >
                See what's included
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-[11px] uppercase tracking-widest text-muted-foreground mt-5"
            >
              14-day free trial · No credit card required
            </motion.p>

            {/* 3D Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-20 md:mt-24 perspective-1000"
              ref={dashRef}
              onMouseMove={handleDashMove}
              onMouseLeave={resetTilt}
            >
              <div
                className="preserve-3d mx-auto max-w-4xl transition-transform duration-200 ease-out"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
              >
                <div
                  className="bg-gradient-to-br from-background to-muted border border-foreground/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25),0_20px_40px_-10px_rgba(212,168,42,0.15)] rounded-lg overflow-hidden text-left"
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-foreground/[0.04] border-b border-foreground/10">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    <div className="flex-1 flex justify-center">
                      <div className="bg-background border border-foreground/10 rounded px-4 py-1 text-[11px] text-muted-foreground font-mono-num">
                        app.reeddigitalgroup.com/dashboard
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Dashboard</div>
                        <div className="text-xl font-bold mt-1">Welcome back, Elaine</div>
                      </div>
                      <div className="text-[11px] text-muted-foreground">May 2026</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                      {[
                        ["YTD income", "$42,180", false, "+12.4%"],
                        ["YTD expenses", "$11,940", false, "-3.1%"],
                        ["Net profit", "$30,240", true, "+18.2%"],
                      ].map(([l, v, hi, delta], i) => (
                        <div
                          key={i}
                          className={`p-3 md:p-4 rounded border ${
                            hi ? "bg-brand/10 border-brand/30" : "bg-background border-foreground/10"
                          }`}
                        >
                          <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{l}</div>
                          <div className="text-base md:text-2xl font-bold font-mono-num">{v}</div>
                          <div className={`text-[10px] mt-1 ${hi ? "text-brand" : "text-muted-foreground"}`}>{delta}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-end gap-1.5 md:gap-2 h-20 md:h-28">
                      {[35, 48, 60, 42, 70, 55, 80, 65, 90, 75, 95, 88].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 1 + i * 0.05 }}
                          className={`flex-1 rounded-t ${i >= 10 ? "bg-brand" : "bg-foreground/15"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====== PAIN ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32 bg-gradient-to-b from-muted/30 to-muted/60 border-y border-foreground/10">
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
                  className="bg-background border border-foreground/10 p-6 rounded"
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-brand mb-5 font-mono-num">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{p.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== TAX TRACKER ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="col-span-12 md:col-span-7"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Track every dollar.
                <br />
                Save thousands at tax time.
              </h2>
              <p className="text-base text-muted-foreground mt-6 max-w-xl leading-relaxed">
                Tax Tracker is built for the way self-employed people actually work
                — phone in one hand, receipt in the other.
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

            {/* 3D Receipt */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="col-span-12 md:col-span-5 perspective-1000"
            >
              <div className="animate-float-receipt preserve-3d">
                <div
                  className="bg-[#fafaf7] text-foreground mx-auto max-w-[320px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),0_15px_30px_-10px_rgba(0,0,0,0.15)] relative"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(0,0,0,0.04) 22px, rgba(0,0,0,0.04) 23px)",
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 8px), 95% 100%, 90% calc(100% - 8px), 85% 100%, 80% calc(100% - 8px), 75% 100%, 70% calc(100% - 8px), 65% 100%, 60% calc(100% - 8px), 55% 100%, 50% calc(100% - 8px), 45% 100%, 40% calc(100% - 8px), 35% 100%, 30% calc(100% - 8px), 25% 100%, 20% calc(100% - 8px), 15% 100%, 10% calc(100% - 8px), 5% 100%, 0 calc(100% - 8px))",
                  }}
                >
                  <div className="p-6 pb-10">
                    <div className="text-center mb-4">
                      <div className="text-base font-bold tracking-widest">CHIPOTLE</div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono-num">
                        1247 H ST NW · WASHINGTON DC
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono-num">
                        TEL (202) 555-0142
                      </div>
                    </div>

                    <div className="border-t border-dashed border-foreground/30 my-4" />

                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex justify-between font-mono-num">
                      <span>05/14/2026 12:48</span>
                      <span>#0421</span>
                    </div>

                    {[
                      ["Burrito Bowl", "11.45"],
                      ["Chips & Guac", "4.95"],
                      ["Iced Tea", "3.25"],
                      ["Burrito", "10.50"],
                    ].map(([n, p], i) => (
                      <div key={i} className="flex justify-between text-xs py-1 font-mono-num">
                        <span>{n}</span>
                        <span>{p}</span>
                      </div>
                    ))}

                    <div className="border-t border-dashed border-foreground/30 my-3" />

                    <div className="flex justify-between text-xs font-mono-num">
                      <span>SUBTOTAL</span>
                      <span>30.15</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono-num">
                      <span>TAX</span>
                      <span>1.81</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold mt-2 font-mono-num">
                      <span>TOTAL</span>
                      <span>$31.96</span>
                    </div>

                    <div className="border-t border-dashed border-foreground/30 my-4" />

                    <div className="text-center text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                      Thank you
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====== SUITE GRID ====== */}
        <section id="suite" className="px-6 md:px-12 py-24 md:py-32 bg-gradient-to-b from-muted/60 to-muted/30 border-y border-foreground/10">
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
                A growing toolkit. Built for self-employed work.
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
                  className={`p-6 border rounded transition-all hover:-translate-y-1 ${
                    a.muted
                      ? "border-dashed border-foreground/20 bg-transparent"
                      : "border-foreground/10 bg-background hover:border-brand/40 hover:shadow-lg"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4 font-mono-num">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{a.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== PRICING ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Pricing that fits the work.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-4">
                Start small. Grow into the suite. Cancel anytime.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {plans.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`relative p-8 rounded border transition-all ${
                    p.highlight
                      ? "border-brand bg-background shadow-[0_20px_50px_-15px_rgba(212,168,42,0.3)] md:scale-105"
                      : "border-foreground/10 bg-background hover:border-foreground/30"
                  }`}
                >
                  {p.tag && (
                    <div
                      className={`absolute -top-3 left-8 px-3 py-1 text-[10px] uppercase tracking-[0.25em] ${
                        p.highlight ? "bg-brand text-brand-foreground" : "bg-foreground text-background"
                      }`}
                    >
                      {p.tag}
                    </div>
                  )}
                  <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                    {p.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold tracking-tight font-mono-num">${p.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 min-h-[200px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start text-sm">
                        <Check />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/apps/login"
                    className={`block w-full text-center px-6 py-3 text-xs uppercase tracking-widest transition-colors ${
                      p.highlight
                        ? "bg-foreground text-background hover:bg-brand hover:text-brand-foreground"
                        : "border border-foreground/20 hover:border-foreground"
                    }`}
                  >
                    Start free trial
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center text-[11px] text-muted-foreground mt-8">
              14 days free on every plan · No credit card required
            </div>
          </div>
        </section>

        {/* ====== CTA ====== */}
        <section className="relative px-6 md:px-12 py-24 md:py-32 bg-gradient-to-b from-background via-muted/40 to-muted/70 border-t border-foreground/10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(var(--brand)) 0%, transparent 50%), radial-gradient(circle at 70% 50%, hsl(var(--brand)) 0%, transparent 55%)" }} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Stop dreading tax season
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-6">
              Start tracking today. Pay $0 for 14 days. Cancel anytime.
            </p>
            <Link
              to="/apps/login"
              className="inline-block mt-10 bg-foreground text-background px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
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
