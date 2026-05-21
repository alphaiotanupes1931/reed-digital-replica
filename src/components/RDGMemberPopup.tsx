import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import logo from "@/assets/rdg-header-logo.png";

const STORAGE_KEY = "rdg-member-popup-dismissed";

const RDGMemberPopup = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't show on app routes or admin/home-office/portal flows
    const blocked = ["/apps", "/admin", "/portal", "/home-office", "/invoice"];
    if (blocked.some((p) => location.pathname.startsWith(p))) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background border-2 border-foreground max-w-md w-full p-8 md:p-10"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 p-1 hover:text-brand transition-colors"
            >
              <X size={18} />
            </button>

            <div className="h-1 w-12 bg-brand mb-6" />

            <img src={logo} alt="RDG" className="h-9 w-auto mb-6" />

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              Are you an
              <br />
              <span className="text-brand">RDG Member?</span>
            </h2>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Members get exclusive access to RDG Apps and free monthly insights
              tailored to your business.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground border-l-2 border-brand pl-4">
              <li>· Access to RDG Apps (Client Portal & more)</li>
              <li>· Free monthly business insights</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                to="/apps"
                onClick={close}
                className="flex-1 text-center bg-brand text-brand-foreground py-3 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
              >
                Sign Me Up
              </Link>
              <button
                onClick={close}
                className="flex-1 border-2 border-foreground py-3 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
              >
                Not Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RDGMemberPopup;