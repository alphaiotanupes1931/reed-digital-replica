import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "rdg-member-popup-dismissed";

const RDGMemberPopup = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const blocked = ["/apps", "/admin", "/portal", "/home-office", "/invoice"];
    if (blocked.some((p) => location.pathname.startsWith(p))) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => setOpen(true), 6000);
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
          className="fixed bottom-4 right-4 z-[80] max-w-xs w-[calc(100vw-2rem)] sm:w-80 font-mono"
        >
          <div className="relative bg-background border border-foreground/15 shadow-xl rounded-md p-5">
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
            <div className="h-0.5 w-8 bg-brand mb-3" />
            <h2 className="text-sm font-bold tracking-tight">
              Are you an <span className="text-brand">RDG Member?</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed pr-4">
              Members get free access to RDG Apps and monthly business insights.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                to="/apps"
                onClick={close}
                className="flex-1 text-center bg-foreground text-background py-2 text-[10px] uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors rounded-sm"
              >
                Get Access
              </Link>
              <button
                onClick={close}
                className="flex-1 border border-foreground/20 py-2 text-[10px] uppercase tracking-widest hover:bg-muted/60 transition-colors rounded-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RDGMemberPopup;