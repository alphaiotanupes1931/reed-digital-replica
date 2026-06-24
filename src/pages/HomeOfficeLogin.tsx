import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup";

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "1 uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "1 number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "1 special character" },
];

const validatePassword = (p: string) => PASSWORD_RULES.every((r) => r.test(p));

const inputCls =
  "w-full bg-transparent border-0 border-b border-foreground/15 text-foreground px-0 py-3 font-mono text-base focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground";
const btnCls =
  "w-full bg-foreground text-background py-4 font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-foreground/85 transition-colors disabled:opacity-50";

const clearStoredAuth = () => {
  sessionStorage.removeItem("ho-token");
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore storage access errors
  }
};



const HomeOfficeLogin = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Send users to the right place only after they enter credentials.
  const routeAfterAuth = async (accessToken: string, userId: string) => {
    sessionStorage.setItem("ho-token", accessToken);
    // Owner bypass — skip onboarding/paywall entirely
    const { data: u } = await supabase.auth.getUser();
    if (u.user?.email?.toLowerCase() === "terellebony@gmail.com" || u.user?.email?.toLowerCase() === "kimorataylor294@gmail.com") {
      navigate("/home-office");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("user_id", userId)
      .maybeSingle();
    navigate(profile?.onboarded ? "/home-office" : "/home-office/onboarding");
  };

  useEffect(() => {
    clearStoredAuth();
    supabase.auth.signOut({ scope: "global" } as any).catch(() => undefined);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) await routeAfterAuth(data.session.access_token, data.session.user.id);
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
        await routeAfterAuth(data.session.access_token, data.session.user.id);
      } else {
        toast({ title: "Account created", description: "Log in to continue." });
        setMode("login");
      }
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = mode === "login" ? handleLogin : handleSignup;

  return (
    <div className="min-h-screen bg-background font-mono text-foreground flex flex-col">
      {/* Top bar */}
      <nav className="border-b border-foreground/10 px-6 md:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
          ← Reed Digital Group
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Home Office
        </span>
      </nav>

      {/* Main */}
      <main className="flex-1 grid md:grid-cols-2">
        {/* LEFT — editorial pane */}
        <div className="hidden md:flex flex-col justify-between border-r border-foreground/10 p-12 lg:p-16 bg-foreground/[0.015]">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            01 — Workspace
          </div>

          <div>
            <h2 className="text-4xl lg:text-6xl tracking-[-0.04em] leading-[1.02] font-medium">
              A quiet system
              <br />
              for <span className="italic text-brand">running</span>
              <br />
              your business.
            </h2>
            <p className="mt-8 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Bills, notes, goals, taxes, and invoices — collected in one place,
              styled the way you'd actually use them.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>© Reed Digital Group</span>
            <span>v 1.0</span>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex items-center justify-center px-6 md:px-12 py-16">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {mode === "login" ? "Sign in" : "Get started"}
              </div>
              <h1 className="text-4xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
                {mode === "login" ? (
                  <>Welcome <span className="italic text-brand">back.</span></>
                ) : (
                  <>Create your <span className="italic text-brand">account.</span></>
                )}
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your Home Office."
                  : "Set up your private workspace in under a minute."}
              </p>
            </motion.div>

            {/* Tabs — minimal underline */}
            <div className="flex gap-8 mb-10 text-[10px] uppercase tracking-[0.3em] border-b border-foreground/10">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`pb-3 -mb-px border-b transition-colors ${
                    mode === m
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={onSubmit}
              className="space-y-8"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="you@studio.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                {mode === "signup" && (
                  <ul className="mt-4 space-y-1 text-[10px] uppercase tracking-[0.25em]">
                    {PASSWORD_RULES.map((r) => {
                      const ok = r.test(password);
                      return (
                        <li key={r.label} className={ok ? "text-brand" : "text-muted-foreground"}>
                          [{ok ? "x" : " "}] {r.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button type="submit" disabled={loading} className={btnCls}>
                {loading
                  ? "Working..."
                  : mode === "login"
                  ? "Sign in →"
                  : "Create account →"}
              </button>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] pt-2">
                {mode === "login" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate("/home-office/forgot-password")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Create account →
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    ← I already have an account
                  </button>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeOfficeLogin;
