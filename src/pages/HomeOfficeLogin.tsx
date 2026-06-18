import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  "w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand transition-colors";
const btnCls =
  "w-full bg-brand text-brand-foreground py-3 font-mono text-sm uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50";

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

const BlinkingEye = () => {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const schedule = () => {
      const timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 180);
        schedule();
      }, 2500 + Math.random() * 4000);
      return timer;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <g>
      {/* sclera — blends into the dark background */}
      <ellipse cx="0" cy="0" rx="70" ry="38" fill="black" stroke="white" strokeOpacity="0.22" strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="70" ry="38" fill="url(#scleraGrad)" opacity="0.15" />
      <ellipse cx="0" cy="-10" rx="56" ry="20" fill="white" opacity="0.08" />
      {/* iris */}
      <circle cx="0" cy="0" r="24" fill="url(#irisGrad)" />
      <circle cx="0" cy="0" r="20" fill="none" stroke="#143326" strokeWidth="1.2" opacity="0.5" />
      <circle cx="0" cy="0" r="16" fill="none" stroke="#1a3a2f" strokeWidth="0.8" opacity="0.4" />
      <circle cx="0" cy="0" r="12" fill="none" stroke="#143326" strokeWidth="0.6" opacity="0.3" />
      {/* pupil */}
      <circle cx="0" cy="0" r="10" fill="#050505" />
      <circle cx="0" cy="0" r="6" fill="#000000" />
      {/* highlights */}
      <circle cx="6" cy="-6" r="3.5" fill="white" opacity="0.95" />
      <circle cx="6" cy="-6" r="1.8" fill="white" opacity="1" />
      <circle cx="-4" cy="5" r="1.8" fill="white" opacity="0.35" />
      {/* crease */}
      <path d="M -80 -4 Q 0 -48 80 -4" fill="none" stroke="white" strokeWidth="1" opacity="0.12" />
      {/* upper eyelid — translateY blink */}
      <motion.path
        d="M -80 -4 Q 0 -52 80 -4 L 80 -60 L -80 -60 Z"
        fill="black"
        initial={{ y: 0 }}
        animate={{ y: blink ? 52 : 0 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      />
      {/* lower eyelid */}
      <motion.path
        d="M -80 4 Q 0 34 80 4 L 80 60 L -80 60 Z"
        fill="black"
        initial={{ y: 0 }}
        animate={{ y: blink ? -34 : 0 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      />
      {/* lashes */}
      <line x1="-65" y1="-10" x2="-75" y2="-22" stroke="white" strokeWidth="0.8" opacity="0.2" />
      <line x1="-50" y1="-18" x2="-56" y2="-30" stroke="white" strokeWidth="0.7" opacity="0.18" />
      <line x1="50" y1="-18" x2="56" y2="-30" stroke="white" strokeWidth="0.7" opacity="0.18" />
      <line x1="65" y1="-10" x2="75" y2="-22" stroke="white" strokeWidth="0.8" opacity="0.2" />
    </g>
  );
};

// Animated concentric rings of vertical dashes — built from SVG
const AnimatedRings = () => {
  const rings = useMemo(() => {
    return [
      { r: 80, count: 16, len: 16, dur: 40, dir: 1 },
      { r: 150, count: 28, len: 20, dur: 60, dir: -1 },
      { r: 230, count: 40, len: 22, dur: 80, dir: 1 },
      { r: 320, count: 54, len: 24, dur: 100, dir: -1 },
      { r: 420, count: 70, len: 26, dur: 120, dir: 1 },
      { r: 530, count: 88, len: 28, dur: 140, dir: -1 },
    ];
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg viewBox="-600 -600 1200 1200" className="w-full h-full">
        <defs>
          <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a5a4a" />
            <stop offset="60%" stopColor="#1a3a2f" />
            <stop offset="100%" stopColor="#0d1f18" />
          </radialGradient>
          <radialGradient id="scleraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="#b0aea9" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {rings.map((ring, ri) => (
          <motion.g
            key={ri}
            animate={{ rotate: ring.dir * 360 }}
            transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0 0" }}
          >
            {Array.from({ length: ring.count }).map((_, i) => {
              const angle = (i / ring.count) * Math.PI * 2;
              const x = Math.cos(angle) * ring.r;
              const y = Math.sin(angle) * ring.r;
              const rot = (angle * 180) / Math.PI + 90;
              return (
                <motion.rect
                  key={i}
                  x={-1}
                  y={-ring.len / 2}
                  width={2}
                  height={ring.len}
                  rx={1}
                  fill="white"
                  transform={`translate(${x}, ${y}) rotate(${rot})`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: (i / ring.count) * 2 + ri * 0.2,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.g>
        ))}
        <BlinkingEye />
      </svg>
    </div>
  );
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
    <div className="min-h-screen grid md:grid-cols-2 bg-black font-mono text-white">
      {/* LEFT — animated rings */}
      <div className="relative hidden md:block bg-black overflow-hidden">
        <AnimatedRings />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-8 left-8 z-10"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">RDG</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand mt-1">Home Office</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-8 z-10 max-w-xs"
        >
          <p className="text-xs text-white/50 leading-relaxed">
            Internal workspace. Track bills, notes, goals, taxes, and invoices —
            all in one quiet system.
          </p>
        </motion.div>
      </div>

      {/* RIGHT — form */}
      <div className="flex items-center justify-center px-6 py-12 md:py-0">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "login"
                ? "Log in to Home Office"
                : "Create your account"}
            </h1>
            <p className="text-xs text-white/50 mt-2">
              {mode === "login"
                ? "Welcome back."
                : "Set up your private workspace."}
            </p>
          </motion.div>

          <div className="flex gap-1 mb-6 text-[10px] uppercase tracking-widest">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 border transition-colors ${
                  mode === m
                    ? "border-brand text-brand"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">
                Password
              </label>
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
                      <li key={r.label} className={ok ? "text-brand" : "text-white/40"}>
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
                ? "Log In"
                : "Sign Up"}
            </button>

            {mode === "login" && (
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/home-office/forgot-password")}
                  className="text-white/50 hover:text-brand transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-white/50 hover:text-brand transition-colors"
                >
                  Create account
                </button>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default HomeOfficeLogin;
