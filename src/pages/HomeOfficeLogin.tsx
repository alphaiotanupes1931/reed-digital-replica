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
  "w-full bg-background border border-foreground/20 text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground";
const btnCls =
  "w-full bg-foreground text-background py-3 font-mono text-xs uppercase tracking-widest hover:bg-foreground/85 transition-colors disabled:opacity-50";

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
      <nav className="border-b border-foreground/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← Reed Digital Group
        </Link>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Home Office</span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl tracking-tight font-bold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {mode === "login" ? "Sign in to your Home Office." : "Set up your workspace in under a minute."}
            </p>
          </div>

          <div className="flex gap-6 mb-6 text-xs uppercase tracking-widest border-b border-foreground/15">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`pb-2 -mb-px border-b-2 transition-colors ${
                  mode === m
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
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
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
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
                <ul className="mt-3 space-y-1 text-xs">
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
              {loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
            </button>

            <div className="flex items-center justify-between text-xs uppercase tracking-widest pt-2">
              {mode === "login" ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/home-office/forgot-password")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-muted-foreground hover:text-foreground ml-auto"
                >
                  ← I already have an account
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default HomeOfficeLogin;
