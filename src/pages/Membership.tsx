import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const benefits = [
  "Full access to the Home Office app",
  "15% off all website & app projects",
  "10% off first 3 months of maintenance",
  "Free post-launch training session",
  "Priority support — front of the line",
  "Early access to new tools & features",
  "Quarterly kit: branded shirt + stickers of your own logo",
  "Free logo design when you join",
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
        <div className="container max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand mb-4">Rung 02 — RDG Member</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Become a Member.</h1>
            <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
              The app, plus everything that makes working with RDG cheaper and faster. Members save
              on every project and get the inside track.
            </p>
          </motion.div>

          {/* Plan toggle */}
          <div className="mt-12 inline-flex border-2 border-foreground">
            {(["monthly", "annual"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors ${
                  plan === p ? "bg-foreground text-background" : "hover:bg-foreground/5"
                }`}
              >
                {p === "monthly" ? "$40 / mo" : "$400 / yr  · save $80"}
              </button>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-px bg-foreground/10 border-2 border-foreground">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-background p-6"
              >
                <span className="text-brand text-[10px] uppercase tracking-[0.3em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm">{b}</p>
              </motion.div>
            ))}
          </div>

          {/* Checkout */}
          <div className="mt-12 border-2 border-foreground p-8">
            <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourbusiness.com"
              className="mt-3 w-full bg-transparent border-b-2 border-foreground/30 focus:border-brand outline-none py-2 font-mono"
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              className="mt-8 w-full bg-brand text-brand-foreground px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading…" : `Join — ${plan === "monthly" ? "$40 / month" : "$400 / year"}`}
            </button>
            <p className="mt-4 text-[11px] text-muted-foreground text-center">
              Cancel anytime. Discounts apply on your next invoice.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link to="/pricing" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-brand">
              ← See all three rungs
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;