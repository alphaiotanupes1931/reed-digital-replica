import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomeOfficeHelp = () => {
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
        <div className="container max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Help</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>

            <div className="mt-12 space-y-6">
              <div className="border-2 border-foreground p-6">
                <h2 className="text-xs uppercase tracking-widest font-bold mb-3">Contact</h2>
                <div className="space-y-3">
                  <a href="mailto:reeddigitalgroup@gmail.com" className="block text-sm hover:text-brand transition-colors">
                    reeddigitalgroup@gmail.com
                  </a>
                  <a href="mailto:info@reeddigitalgroup.com" className="block text-sm hover:text-brand transition-colors">
                    info@reeddigitalgroup.com
                  </a>
                </div>
              </div>
              <div className="border-2 border-foreground/20 p-6">
                <h2 className="text-xs uppercase tracking-widest font-bold mb-3">Support</h2>
                <p className="text-sm text-muted-foreground">
                  For technical issues or feature requests, email the addresses above.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeOfficeHelp;
