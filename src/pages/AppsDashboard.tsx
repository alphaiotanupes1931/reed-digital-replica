import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const apps = [
  { label: "Client Portal", desc: "View invoices, pay securely, track project status.", href: "/portal" },
  { label: "Home Office", desc: "Internal RDG workspace.", href: "/home-office/login" },
  { label: "ROI Tracker", desc: "Plaid-powered finance insights.", href: "#" },
];

const AppsDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("rdg-apps-user");
    if (!raw) {
      navigate("/apps/login");
      return;
    }
    setUser(JSON.parse(raw));
  }, [navigate]);

  const signOut = () => {
    localStorage.removeItem("rdg-apps-user");
    navigate("/apps");
  };

  return (
    <div className="min-h-screen bg-background font-apps">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-between border-b-2 border-foreground pb-8 mb-12"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, {user?.name || "Elaine"}
              </h1>
              {user?.email && (
                <p className="text-sm text-muted-foreground mt-3">Signed in as {user.email}</p>
              )}
            </div>
            <button
              onClick={signOut}
              className="text-xs uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Sign Out
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app, i) => {
              const inner = (
                <>
                  <h2 className="text-lg font-bold tracking-tight mb-4 group-hover:text-brand transition-colors">
                    {app.label}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
                </>
              );
              return (
                <motion.div
                  key={app.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {app.href === "#" ? (
                    <div className="block border-2 border-foreground p-8 opacity-60 cursor-not-allowed group">
                      {inner}
                    </div>
                  ) : (
                    <Link
                      to={app.href}
                      className="block border-2 border-foreground p-8 hover:border-brand hover:bg-brand/5 transition-all group"
                    >
                      {inner}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppsDashboard;