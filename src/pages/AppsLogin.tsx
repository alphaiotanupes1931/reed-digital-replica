import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logo from "@/assets/rdg-header-logo.png";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.9 13.2-5.1l-6.1-5c-2 1.4-4.5 2.1-7.1 2.1-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.4l6.1 5c-.4.4 6.7-4.9 6.7-14.4 0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

type Mode = "login" | "signup";

const AppsLogin = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");

  // Forgot password modal
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const startCheckout = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("apps-subscribe", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
        return true;
      }
      throw new Error("No checkout URL returned");
    } catch (err: any) {
      toast({ title: "Could not start checkout", description: err.message, variant: "destructive" });
      return false;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        if (planParam) {
          startCheckout(planParam);
        } else {
          navigate("/apps/dashboard", { replace: true });
        }
      }
    });
  }, []);

  // 3D interactive logo tilt
  const logoRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onLogoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = logoRef.current?.getBoundingClientRect();
    if (!r) return;
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    setTilt({ x: -dy * 22, y: dx * 28 });
  };
  const onLogoLeave = () => setTilt({ x: 0, y: 0 });

  // Password complexity checks (signup only)
  const pwChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const pwScore = Object.values(pwChecks).filter(Boolean).length;
  const pwStrong = pwScore === 5;
  const pwMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Email and password required", variant: "destructive" });
      return;
    }
    if (mode === "signup") {
      if (!pwStrong) {
        toast({ title: "Password too weak", description: "Use 8+ chars with upper, lower, number, and symbol.", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        return;
      }
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/apps/dashboard` },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Check your inbox to confirm, or sign in if confirmation is disabled." });
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (planParam) {
            const ok = await startCheckout(planParam);
            if (!ok) navigate("/apps/dashboard");
          } else {
            navigate("/apps/dashboard");
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (planParam) {
          const ok = await startCheckout(planParam);
          if (!ok) navigate("/apps/dashboard");
        } else {
          navigate("/apps/dashboard");
        }
      }
    } catch (err: any) {
      toast({ title: "Authentication failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const redirectPath = planParam
        ? `/apps/login?plan=${encodeURIComponent(planParam)}`
        : `/apps/dashboard`;
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}${redirectPath}`,
      });
      if (result.error) throw result.error;
      if (!result.redirected) navigate("/apps/dashboard");
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const openForgot = () => {
    setForgotEmail(email);
    setForgotSent(false);
    setForgotError(null);
    setForgotOpen(true);
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError("Please enter your email address.");
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/apps/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || "Could not send reset email.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-apps flex flex-col">
      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
        <div />
        <div className="text-xs text-muted-foreground">
          {mode === "login" ? "New to RDG? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-foreground font-medium hover:text-brand transition-colors"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* 3D interactive logo */}
          <div className="flex justify-center mb-10 perspective-1000">
            <div
              ref={logoRef}
              onMouseMove={onLogoMove}
              onMouseLeave={onLogoLeave}
              className="preserve-3d transition-transform duration-200 ease-out"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            >
              <img
                src={logo}
                alt="RDG"
                className="h-14 w-auto"
                style={{ filter: "drop-shadow(0 10px 20px hsl(var(--brand) / 0.25)) drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            {mode === "signup" && (
              <div className="inline-flex items-center gap-2 border border-brand/30 bg-brand/5 text-brand px-3 py-1 rounded-full text-[10px] uppercase tracking-widest mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                14-day free trial · No card required
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login"
                ? "Welcome back. Enter your details below."
                : "Get full access to every app for 14 days, free."}
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full border border-foreground/15 bg-background hover:bg-muted/60 py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 rounded-md text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-foreground/80">Password</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={openForgot}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 rounded-md text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 rounded-md text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                  {confirmPassword.length > 0 && !pwMatch && (
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
                            i <= pwScore
                              ? pwScore <= 2 ? "bg-destructive" : pwScore <= 4 ? "bg-brand/60" : "bg-brand"
                              : "bg-foreground/10"
                          }`}
                        />
                      ))}
                    </div>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                      {[
                        { ok: pwChecks.length, label: "8+ characters" },
                        { ok: pwChecks.upper, label: "Uppercase letter" },
                        { ok: pwChecks.lower, label: "Lowercase letter" },
                        { ok: pwChecks.number, label: "Number" },
                        { ok: pwChecks.symbol, label: "Symbol" },
                      ].map((c) => (
                        <li key={c.label} className={c.ok ? "text-foreground/80" : "text-muted-foreground/70"}>
                          <span className="mr-1.5">{c.ok ? "✓" : "·"}</span>{c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-2.5 rounded-md text-sm font-medium hover:bg-brand hover:text-brand-foreground transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-[11px] text-muted-foreground text-center mt-8 leading-relaxed">
            By continuing, you agree to RDG's{" "}
            <Link to="/apps/legal/terms" className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline">Terms</Link> and{" "}
            <Link to="/apps/legal/privacy" className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline">Privacy Policy</Link>.
          </p>
        </motion.div>
      </main>

      <footer className="px-6 md:px-10 py-6 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>© 2026 Reed Digital Group</span>
        <div className="flex gap-5">
          <Link to="/apps/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/apps/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <span className="hover:text-foreground cursor-pointer transition-colors">Support</span>
        </div>
      </footer>

      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
          onClick={() => !forgotLoading && setForgotOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] bg-background border border-foreground/15 rounded-lg shadow-2xl p-7"
          >
            {!forgotSent ? (
              <>
                <h2 className="text-xl font-semibold tracking-tight">Reset your password</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter the email on your account and we'll send you a secure link to set a new password.
                </p>
                <form onSubmit={submitForgot} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">Email</label>
                    <input
                      type="email"
                      autoFocus
                      placeholder="you@company.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full border border-foreground/15 bg-background px-3.5 py-2.5 rounded-md text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                    />
                  </div>
                  {forgotError && (
                    <p className="text-[11px] text-destructive">{forgotError}</p>
                  )}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(false)}
                      disabled={forgotLoading}
                      className="flex-1 border border-foreground/15 py-2.5 rounded-md text-sm font-medium hover:bg-muted/60 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 bg-foreground text-background py-2.5 rounded-md text-sm font-medium hover:bg-brand hover:text-brand-foreground transition-colors disabled:opacity-50"
                    >
                      {forgotLoading ? "Sending…" : "Send reset link"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold tracking-tight">Check your inbox</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  If an account exists for <span className="text-foreground font-medium">{forgotEmail}</span>,
                  you'll receive an email with a link to reset your password within a few minutes.
                </p>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Didn't get it? Check your spam folder, or wait a minute and try again.
                </p>
                <button
                  onClick={() => setForgotOpen(false)}
                  className="w-full mt-6 bg-foreground text-background py-2.5 rounded-md text-sm font-medium hover:bg-brand hover:text-brand-foreground transition-colors"
                >
                  Done
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AppsLogin;