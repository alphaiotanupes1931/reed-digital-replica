import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "1 uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "1 number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "1 special character" },
];

const HomeOfficeResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The recovery link sets a temporary session; wait for auth to be ready
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!RULES.every((r) => r.test(password))) {
      toast({
        title: "Weak password",
        description: "8+ chars, 1 uppercase, 1 number, 1 special character.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated" });
      navigate("/home-office");
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Reset Password</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>
          </motion.div>

          {!ready ? (
            <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
              Validating reset link...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="border-2 border-foreground p-8 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand"
                  required
                  autoComplete="new-password"
                />
                <ul className="mt-3 space-y-1 text-[10px] uppercase tracking-widest">
                  {RULES.map((r) => {
                    const ok = r.test(password);
                    return (
                      <li key={r.label} className={ok ? "text-brand" : "text-muted-foreground"}>
                        [{ok ? "x" : " "}] {r.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Confirm</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand"
                  required
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-brand-foreground py-3 font-mono text-sm uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeOfficeResetPassword;