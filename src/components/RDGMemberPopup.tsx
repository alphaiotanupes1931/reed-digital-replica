import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RDGMemberPopup = () => {
  // Membership program retired — App subscription now grants member benefits.
  return null;
  // eslint-disable-next-line no-unreachable
  return (
    <AnimatePresence>
      {false && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="fixed bottom-4 right-4 z-[80] max-w-xs w-[calc(100vw-2rem)] sm:w-80 font-mono"
        >
          <div className="relative bg-background border border-foreground/15 shadow-xl rounded-md p-5">
            <div className="h-0.5 w-8 bg-brand mb-3" />
            <h2 className="text-sm font-bold tracking-tight">
              Are you an <span className="text-brand">RDG Member?</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Members get free access to RDG Apps and monthly business insights.
            </p>
            <div className="mt-4">
              <Link
                to="/membership"
                className="block w-full text-center bg-foreground text-background py-2 text-[10px] uppercase tracking-widest hover:bg-brand hover:text-brand-foreground transition-colors rounded-sm"
              >
                Join Now
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RDGMemberPopup;