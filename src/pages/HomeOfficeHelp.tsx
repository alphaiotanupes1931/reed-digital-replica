import { useEffect } from"react";
import { useNavigate, Link } from"react-router-dom";
import BackLink from"@/components/BackLink";
import { motion } from"framer-motion";
import Header from"@/components/Header";
import Footer from"@/components/Footer";

const HomeOfficeHelp = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("ho-token")) navigate("/home-office/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6">
              <BackLink />
            </div>
            <Link to="/home-office" className="block">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight hover:text-brand transition-colors">Help</h1>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">Home Office by RDG</p>

            <div className="mt-10 space-y-4">
              <div className="border border-border rounded-2xl p-6">
                <h2 className="text-xs uppercase tracking-widest font-bold mb-3 text-muted-foreground">Contact</h2>
                <a href="mailto:reeddigitalgroup@gmail.com" className="text-sm hover:text-brand transition-colors">
                  reeddigitalgroup@gmail.com
                </a>
              </div>
              <div className="border border-border rounded-2xl p-6">
                <h2 className="text-xs uppercase tracking-widest font-bold mb-3 text-muted-foreground">Support</h2>
                <p className="text-sm text-muted-foreground">
                  For technical issues or feature requests, email the address above.
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
