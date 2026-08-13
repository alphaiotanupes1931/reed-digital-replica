import { Link } from "react-router-dom";

const features = [
  { t: "Notes & daily planner", d: "Capture every thought, plan the day, stay in motion." },
  { t: "Bills tracker", d: "See what's due, what's paid, what's coming next." },
  { t: "Send invoices, get paid", d: "Branded invoices, Stripe checkout, instant payouts." },
  { t: "Client portal", d: "One shared space for files, updates, and approvals." },
  { t: "Tax dashboard", d: "Income, expenses, mileage — organized all year." },
  { t: "Accountant access", d: "Share a clean snapshot with your accountant instantly." },
];

const stats = [
  { k: "5 min", v: "To set up" },
  { k: "1 place", v: "For everything" },
  { k: "$20", v: "Per month" },
];

const HomeOfficeWelcome = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Reed Digital Group
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/home-office/login"
            className="text-sm px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/home-office/login?mode=signup"
            className="text-sm px-4 py-2 bg-foreground text-background rounded-full hover:bg-foreground/85 transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full opacity-[0.14] blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--primary)), transparent)" }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              7-day free trial · no card tricks
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Run your business from one home office.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
              Notes, bills, invoices, taxes, and a client portal — quietly organized in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/home-office/login?mode=signup"
                className="px-7 py-3.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors"
              >
                Try free for 7 days
              </Link>
              <Link
                to="/home-office/login"
                className="px-7 py-3.5 border border-border rounded-full text-sm font-medium hover:border-foreground/40 transition-colors"
              >
                I have an account
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {stats.map((s) => (
                <div key={s.k} className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-xl md:text-2xl font-bold tracking-tight">{s.k}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-16 md:py-20 max-w-5xl mx-auto border-t border-border">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Everything inside</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              The whole back office, minus the busywork.
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.t}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/25"
              >
                <h3 className="text-base font-semibold tracking-tight">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-16 md:py-20 max-w-2xl mx-auto border-t border-border">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">One plan. One price.</p>
            <div className="mt-5 flex items-end justify-center gap-1">
              <span className="text-6xl font-bold tracking-tight">$20</span>
              <span className="pb-2 text-sm text-muted-foreground">/ month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">7-day free trial. Cancel anytime.</p>
            <ul className="mt-8 text-left max-w-sm mx-auto space-y-3 text-sm">
              {features.map((f) => (
                <li key={f.t} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{f.t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/home-office/login?mode=signup"
              className="mt-9 inline-block w-full sm:w-auto px-8 py-3.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>Home Office</span>
        <div className="flex gap-6">
        <Link to="/contact" className="hover:text-foreground">Contact</Link>
        <Link to="/apps/legal/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/apps/legal/privacy" className="hover:text-foreground">Privacy</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomeOfficeWelcome;