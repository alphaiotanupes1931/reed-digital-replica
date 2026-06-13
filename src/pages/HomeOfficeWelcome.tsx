import { Link } from "react-router-dom";

const features = [
  "Notes & daily planner",
  "Bills tracker",
  "Send invoices, get paid",
  "Client portal",
];

const HomeOfficeWelcome = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-brand transition-colors">
          ← RDG
        </Link>
        <Link
          to="/home-office/login"
          className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-brand transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Home Office
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Run your business in one app.
          </p>

          <ul className="text-sm text-foreground/80 space-y-2 mb-10 text-left max-w-xs mx-auto">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="text-brand">—</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/home-office/login?mode=signup"
            className="block w-full bg-brand text-brand-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-brand/90 transition-colors mb-3"
          >
            Try free for 7 days
          </Link>
          <Link
            to="/home-office/login"
            className="block w-full px-8 py-4 text-xs uppercase tracking-[0.25em] text-foreground/70 border border-border hover:border-foreground hover:text-foreground transition-colors"
          >
            I have an account
          </Link>

          <p className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground">
            $20 / month · Cancel anytime
          </p>
        </div>
      </main>

      <footer className="px-6 md:px-12 py-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center">
        © Reed Digital Group
      </footer>
    </div>
  );
};

export default HomeOfficeWelcome;