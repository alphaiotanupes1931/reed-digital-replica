import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const apps = [
  { n: "01", t: "Client Portal", d: "Invoices, payments, and project status.", s: "Available" },
  { n: "02", t: "Home Office", d: "Internal workspace for the RDG team.", s: "Staff" },
  { n: "03", t: "ROI Tracker", d: "Plaid-powered financial insights.", s: "Soon" },
];

const AppsLanding = () => {
  return (
    <div className="min-h-screen bg-background font-mono text-foreground">
      <Header />

      <main>
        {/* ====== HERO ====== */}
        <section className="min-h-[92vh] flex flex-col justify-center px-6 md:px-12">
          <div className="max-w-5xl mx-auto w-full">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-10"
            >
              Reed Digital Group — Apps
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              Every tool we build,
              <br />
              <span className="text-brand">in one place.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mt-10 max-w-xl leading-relaxed"
            >
              RDG Apps is the members-only platform for our clients.
              One account. Every app. Free to join.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-6 mt-12"
            >
              <Link
                to="/apps/login"
                className="bg-foreground text-background px-7 py-3 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/apps/login"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Sign in →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ====== APPS LIST ====== */}
        <section className="px-6 md:px-12 py-24 md:py-32 border-t border-foreground/10">
          <div className="max-w-5xl mx-auto w-full">
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-12">
              Inside the platform
            </p>

            <div>
              {apps.map((app, i) => (
                <motion.div
                  key={app.n}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="grid grid-cols-12 gap-4 md:gap-8 py-8 border-t border-foreground/10 last:border-b group cursor-default"
                >
                  <span className="col-span-2 md:col-span-1 text-xs text-muted-foreground pt-2">
                    {app.n}
                  </span>
                  <h3 className="col-span-10 md:col-span-4 text-2xl md:text-3xl font-bold tracking-tight group-hover:text-brand transition-colors">
                    {app.t}
                  </h3>
                  <p className="col-span-12 md:col-span-5 text-sm text-muted-foreground pt-2 leading-relaxed">
                    {app.d}
                  </p>
                  <span className="col-span-12 md:col-span-2 text-[10px] uppercase tracking-widest text-muted-foreground md:text-right pt-3">
                    {app.s}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== CTA ====== */}
        <section className="px-6 md:px-12 py-32 md:py-48 border-t border-foreground/10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto w-full"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
              Become a
              <br />
              <span className="text-brand">member.</span>
            </h2>
            <p className="text-base text-muted-foreground mt-8 max-w-md">
              Free account. Takes a minute. Access every app we ship.
            </p>
            <Link
              to="/apps/login"
              className="inline-block mt-12 bg-foreground text-background px-7 py-3 text-xs uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors"
            >
              Create Account
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLanding;