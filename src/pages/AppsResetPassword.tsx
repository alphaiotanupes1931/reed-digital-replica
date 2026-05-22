import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/rdg-header-logo.png";

const AppsResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase auto-detects the recovery token in the URL hash and creates a session
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const strong = score === 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strong) {
      toast({ title: "Password too weak", description: "Use 8+ chars with upper, lower, number, and symbol.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You're all set. Redirecting…" });
      setTimeout(() => navigate("/apps/dashboard"), 800);
    } catch (err: any) {
      toast({ title: "Could not update password", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-apps flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          <div className="flex justify-center mb-10">
            <img src={logo} alt="RDG" className="h-14 w-auto" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Set a new password
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {ready ? "Choose a strong password to secure your account." : "Verifying your reset link…"}
            </p>
          </div>

          {ready && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1.5">New password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1.5">Confirm password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                />
                {confirm.length > 0 && confirm !== password && (
                  <p className="mt-1.5 text-[11px] text-destructive">Passwords do not match</p>
                )}
              </div>
              {password.length > 0 && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= score
                            ? score <= 2 ? "bg-destructive" : score <= 4 ? "bg-brand/60" : "bg-brand"
                            : "bg-foreground/10"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                    {[
                      { ok: checks.length, label: "8+ characters" },
                      { ok: checks.upper, label: "Uppercase letter" },
                      { ok: checks.lower, label: "Lowercase letter" },
                      { ok: checks.number, label: "Number" },
                      { ok: checks.symbol, label: "Symbol" },
                    ].map((c) => (
                      <li key={c.label} className={c.ok ? "text-foreground/80" : "text-muted-foreground/70"}>
                        <span className="mr-1.5">{c.ok ? "✓" : "·"}</span>{c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background py-2.5 rounded-md text-sm font-medium hover:bg-brand hover:text-brand-foreground transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AppsResetPassword;