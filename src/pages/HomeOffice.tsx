import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tiles = [
  { label: "Work Assistant", desc: "Daily notes, goals & standups", href: "/home-office/work-assistant" },
  { label: "Invoices", desc: "Client portal & billing", href: "/invoice" },
  { label: "ROI Tracker", desc: "Coming Soon — Plaid integration", href: "/home-office/roi-tracker" },
  { label: "Help", desc: "Contact & support", href: "/home-office/help" },
];

const HomeOffice = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("ho-token")) navigate("/home-office/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden">
      {/* Gold top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />

      {/* RDG watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[20vw] font-bold text-foreground/[0.03] uppercase tracking-widest select-none">
          RDG
        </span>
      </div>

      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Link to="/home-office" className="inline-block">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight hover:text-brand transition-colors">Home Office</h1>
              <p className="text-sm text-brand italic mt-1">by RDG</p>
            </Link>
            <p className="text-muted-foreground text-sm mt-4">Welcome, Mr. Reed</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tiles.map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to={tile.href}
                  className="block border-2 border-foreground p-8 hover:border-brand hover:bg-brand/5 transition-all group"
                >
                  <h2 className="text-lg font-bold tracking-tight group-hover:text-brand transition-colors">
                    {tile.label}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2">{tile.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeOffice;
