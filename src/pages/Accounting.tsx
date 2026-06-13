import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Accounting = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("ho-token")) navigate("/home-office/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[20vw] font-bold text-foreground/[0.03] uppercase tracking-widest select-none">RDG</span>
      </div>
      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/home-office" className="text-xs text-muted-foreground hover:text-brand uppercase tracking-widest">← Home Office</Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Accounting</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>
            <div className="border-2 border-foreground/20 p-12 mt-12">
              <p className="text-lg font-bold">Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-3">
                Income, expenses, P&L, and tax-ready reports — all in one place.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accounting;
