import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Mode = "login" | "signup" | "forgot";

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "1 uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "1 number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "1 special character" },
];

const validatePassword = (p: string) => PASSWORD_RULES.every((r) => r.test(p));

const inputCls =
  "w-full border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand";
const btnCls =
  "w-full bg-brand text-brand-foreground py-3 font-mono text-sm uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50";

const HomeOfficeLogin = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // If already signed in, send them in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        sessionStorage.setItem("ho-token", data.session.access_token);
        navigate("/home-office");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) sessionStorage.setItem("ho-token", data.session.access_token);
      navigate("/home-office");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast({
        title: "Weak password",
        description: "Must have 8+ chars, 1 uppercase, 1 number, 1 special character.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/home-office` },
      });
      if (error) throw error;
      if (data.session) {
        sessionStorage.setItem("ho-token", data.session.access_token);
        navigate("/home-office");
      } else {
        toast({ title: "Account created", description: "Check your email to confirm, then log in." });
        setMode("login");
      }
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/home-office/reset-password`,
      });
      if (error) throw error;
      toast({ title: "Reset email sent", description: "Check your inbox for the reset link." });
      setMode("login");
    } catch (err: any) {
      toast({ title: "Couldn't send reset", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit =
    mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot;

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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Home Office</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>
          </motion.div>

          <div className="flex border-2 border-foreground mb-6">
            {(["login", "signup", "forgot"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${
                  mode === m ? "bg-foreground text-background" : "hover:bg-foreground/5"
                }`}
              >
                {m === "forgot" ? "Forgot" : m}
              </button>
            ))}
          </div>

          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            className="border-2 border-foreground p-8 space-y-6"
          >
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
                autoComplete="email"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                {mode === "signup" && (
                  <ul className="mt-3 space-y-1 text-[10px] uppercase tracking-widest">
                    {PASSWORD_RULES.map((r) => {
                      const ok = r.test(password);
                      return (
                        <li
                          key={r.label}
                          className={ok ? "text-brand" : "text-muted-foreground"}
                        >
                          [{ok ? "x" : " "}] {r.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className={btnCls}>
              {loading
                ? "Working..."
                : mode === "login"
                ? "Log In"
                : mode === "signup"
                ? "Sign Up"
                : "Send Reset Link"}
            </button>

            {mode === "login" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </motion.form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeOfficeLogin;
