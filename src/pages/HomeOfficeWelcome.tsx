import { Link } from "react-router-dom";

const features = [
  { k: "01", t: "Notes & daily planner", d: "Capture every thought, plan the day, stay in motion." },
  { k: "02", t: "Bills tracker", d: "See what's due, what's paid, what's coming next." },
  { k: "03", t: "Send invoices, get paid", d: "Branded invoices, Stripe checkout, instant payouts." },
  { k: "04", t: "Client portal", d: "One shared space for files, updates, and approvals." },
];

const HomeOfficeWelcome = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col">
      {/* Top nav — Framer-style sticky pill */}
      <nav className="sticky top-0 z-40 w-full border-b border-x-0 border-t-0 border-foreground/10 bg-background/80 backdrop-blur-xl px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
          ← Reed Digital Group
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
        <Link
          to="/home-office/login"
          className="text-[10px] uppercase tracking-[0.3em] px-4 py-2 bg-foreground text-background hover:bg-foreground/85 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative px-6 md:px-12 pt-20 md:pt-28 pb-24 max-w-6xl mx-auto">
          {/* Eyebrow chip */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-3 border border-foreground/15 bg-foreground/[0.03] px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              New · v1 release
            </span>
          </div>

          <h1 className="text-center text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.04em] font-medium max-w-4xl mx-auto">
            Run your business
            <br />
            from one <span className="italic text-brand">home office.</span>
          </h1>

          <p className="mt-8 text-center text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Notes, bills, invoices, and a client portal — quietly powerful, beautifully simple.
            Built for independents who'd rather be working.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/home-office/login?mode=signup"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-foreground text-background text-[11px] uppercase tracking-[0.25em] hover:bg-foreground/85 transition-colors"
            >
              Try free for 7 days
            </Link>
            <Link
              to="/home-office/login"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-foreground/15 text-[11px] uppercase tracking-[0.25em] text-foreground/80 hover:border-foreground/40 hover:text-foreground transition-colors"
            >
              I have an account
            </Link>
          </div>

          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            $20 / month · Cancel anytime · No card required
          </p>

          {/* Browser-style preview card */}
          <div className="mt-20 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]">
            <div className="rounded-xl bg-background border border-foreground/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="ml-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">home-office / dashboard</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {[
                  { label: "MTD Revenue", value: "$12,480" },
                  { label: "Open Invoices", value: "4" },
                  { label: "Bills due (7d)", value: "$1,250" },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg border border-foreground/10 p-5">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{m.label}</div>
                    <div className="mt-3 text-3xl tracking-tight">{m.value}</div>
                    <div className="mt-4 h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: "62%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 md:px-12 py-24 max-w-6xl mx-auto border-t border-foreground/10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Features</div>
              <h2 className="text-3xl md:text-5xl tracking-tight leading-[1.05] max-w-xl">
                Everything you need.
                <br />
                <span className="text-muted-foreground">Nothing you don't.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
            {features.map((f) => (
              <div key={f.k} className="bg-background p-8 md:p-10 hover:bg-foreground/[0.02] transition-colors">
                <div className="text-[10px] uppercase tracking-[0.3em] text-brand mb-6">{f.k}</div>
                <h3 className="text-xl md:text-2xl tracking-tight mb-3">{f.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 md:px-12 py-24 max-w-3xl mx-auto text-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Pricing</div>
          <h2 className="text-3xl md:text-5xl tracking-tight mb-10">One plan. One price.</h2>

          <div className="rounded-2xl border border-foreground/10 p-10 bg-foreground/[0.02]">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl md:text-7xl tracking-tight">$20</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">7-day free trial. Cancel anytime.</p>

            <ul className="text-left max-w-sm mx-auto space-y-3 mb-10 text-sm">
              {features.map((f) => (
                <li key={f.k} className="flex items-start gap-3">
                  <span className="text-brand mt-0.5">—</span>
                  <span>{f.t}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <span className="text-brand mt-0.5">—</span>
                <span>Tax dashboard & accountant portal</span>
              </li>
            </ul>

            <Link
              to="/home-office/login?mode=signup"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-foreground text-background text-[11px] uppercase tracking-[0.25em] hover:bg-foreground/85 transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 md:px-12 py-10 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>© Reed Digital Group</span>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="/apps/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/apps/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeOfficeWelcome;