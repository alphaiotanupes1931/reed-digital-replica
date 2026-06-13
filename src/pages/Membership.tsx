import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const benefits = [
  "Home Office app included",
  "15% off all projects",
  "10% off maintenance (first 3 months)",
  "Free logo design",
  "Free training session",
  "Priority support",
  "Early access to new tools",
  "Quarterly merch kit",
];

const Membership = () => {
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!email.trim()) {
      toast({ title: "Enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("rdg-member-checkout", {
        body: { plan, email: email.trim() },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast({ title: "Checkout failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container max-w-md mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight">Become a Member</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Save on every project. Get the app free.
            </p>
          </motion.div>

          {/* Price card */}
          <div className="mt-10 border border-foreground/15 rounded-md p-6">
            {/* Plan toggle */}
            <div className="flex w-full border border-foreground/15 rounded-md overflow-hidden text-xs">
              {(["monthly", "annual"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`flex-1 py-2.5 transition-colors ${
                    plan === p ? "bg-foreground text-background" : "hover:bg-foreground/5"
                  }`}
                >
                  {p === "monthly" ? "Monthly" : "Yearly · save $80"}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="mt-6 text-center">
              <div className="text-5xl font-bold tracking-tight">
                ${plan === "monthly" ? "40" : "400"}
                <span className="text-base text-muted-foreground font-normal">
                  /{plan === "monthly" ? "mo" : "yr"}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Cancel anytime</p>
            </div>

            {/* Benefits */}
            <ul className="mt-6 space-y-2.5 text-sm">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="text-brand mt-1.5 h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Email + CTA */}
            <div className="mt-8 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                className="w-full border border-foreground/20 rounded-md px-4 py-3 text-sm focus:border-brand outline-none"
              />
              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full bg-brand text-brand-foreground py-3 rounded-md text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Loading…" : "Join Now"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/pricing" className="text-xs text-muted-foreground hover:text-brand">
              ← Back to pricing
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;