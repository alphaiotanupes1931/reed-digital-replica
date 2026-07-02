import { Link } from "react-router-dom";

const features = [
  { t: "Notes & daily planner", d: "Capture every thought, plan the day, stay in motion." },
  { t: "Bills tracker", d: "See what's due, what's paid, what's coming next." },
  { t: "Send invoices, get paid", d: "Branded invoices, Stripe checkout, instant payouts." },
  { t: "Client portal", d: "One shared space for files, updates, and approvals." },
];

const HomeOfficeWelcome = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col">
      <nav className="border-b border-foreground/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← Reed Digital Group
        </Link>
        <Link
          to="/home-office/login"
          className="text-xs uppercase tracking-widest px-4 py-2 bg-foreground text-background hover:bg-foreground/85"
        >
          Sign in
        </Link>
      </nav>

      <main className="flex-1">
        <section className="px-6 py-16 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl tracking-tight font-bold">
            Run your business from one home office.
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Notes, bills, invoices, taxes, and a client portal — all in one place.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/home-office/login?mode=signup"
              className="px-6 py-3 bg-foreground text-background text-xs uppercase tracking-widest hover:bg-foreground/85"
            >
              Try free for 7 days
            </Link>
            <Link
              to="/home-office/login"
              className="px-6 py-3 border border-foreground/20 text-xs uppercase tracking-widest hover:border-foreground/50"
            >
              I have an account
            </Link>
          </div>
          <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
            $20 / month · Cancel anytime
          </p>
        </section>

        <section id="features" className="px-6 py-12 max-w-5xl mx-auto border-t border-foreground/10">
          <h2 className="text-xl md:text-2xl tracking-tight mb-6 font-bold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.t} className="border border-foreground/15 p-5">
                <h3 className="text-base mb-1 font-semibold">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-6 py-12 max-w-2xl mx-auto text-center border-t border-foreground/10">
          <h2 className="text-xl md:text-2xl tracking-tight mb-6 font-bold">One plan. One price.</h2>
          <div className="border border-foreground/15 p-6">
            <div className="text-4xl font-bold mb-1">$20<span className="text-base font-normal text-muted-foreground"> / month</span></div>
            <p className="text-sm text-muted-foreground mb-5">7-day free trial. Cancel anytime.</p>
            <ul className="text-left max-w-sm mx-auto space-y-1.5 mb-6 text-sm">
              {features.map((f) => (
                <li key={f.t}>— {f.t}</li>
              ))}
              <li>— Tax dashboard & accountant portal</li>
            </ul>
            <Link
              to="/home-office/login?mode=signup"
              className="inline-block px-6 py-3 bg-foreground text-background text-xs uppercase tracking-widest hover:bg-foreground/85"
            >
              Start free trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 border-t border-foreground/10 flex justify-end gap-6 text-xs uppercase tracking-widest text-muted-foreground">
        <Link to="/contact" className="hover:text-foreground">Contact</Link>
        <Link to="/apps/legal/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/apps/legal/privacy" className="hover:text-foreground">Privacy</Link>
      </footer>
    </div>
  );
};

export default HomeOfficeWelcome;