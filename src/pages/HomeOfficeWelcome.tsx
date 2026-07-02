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
        <section className="px-6 py-20 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold">
            Run your business from one home office.
          </h1>
          <p className="mt-6 text-base text-muted-foreground max-w-xl mx-auto">
            Notes, bills, invoices, taxes, and a client portal — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
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

        <section id="features" className="px-6 py-16 max-w-5xl mx-auto border-t border-foreground/10">
          <h2 className="text-2xl md:text-3xl tracking-tight mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.k} className="border border-foreground/15 p-6">
                <div className="text-xs uppercase tracking-widest text-brand mb-3">{f.k}</div>
                <h3 className="text-lg mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-6 py-16 max-w-2xl mx-auto text-center border-t border-foreground/10">
          <h2 className="text-2xl md:text-3xl tracking-tight mb-8">One plan. One price.</h2>
          <div className="border border-foreground/15 p-8">
            <div className="text-5xl font-bold mb-1">$20<span className="text-base font-normal text-muted-foreground"> / month</span></div>
            <p className="text-sm text-muted-foreground mb-6">7-day free trial. Cancel anytime.</p>
            <ul className="text-left max-w-sm mx-auto space-y-2 mb-8 text-sm">
              {features.map((f) => (
                <li key={f.k}>— {f.t}</li>
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