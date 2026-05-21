import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // FAKE AUTH — backlog: replace with Lovable Cloud auth (email/password + Google OAuth)
  const fakeAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = { email: email || "guest@rdg.app", name: email.split("@")[0] || "Guest" };
      localStorage.setItem("rdg-apps-user", JSON.stringify(user));
      setLoading(false);
      toast({ title: mode === "signup" ? "Account created" : "Welcome back", description: "Redirecting…" });
      navigate("/apps/dashboard");
    }, 500);
  };

  const fakeGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      const user = { email: "you@gmail.com", name: "Google User" };
      localStorage.setItem("rdg-apps-user", JSON.stringify(user));
      navigate("/apps/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-4">
              <img src={logo} alt="RDG" className="h-20 md:h-24 w-auto" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">RDG APPS</h2>
            <Link
              to="/apps"
              className="inline-block mt-4 text-[10px] uppercase tracking-[0.3em] text-brand hover:underline"
            >
              ← Back to overview
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-6">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login" ? "Welcome back to RDG Apps." : "Get access to the Client Portal and more."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-foreground p-8"
          >
            <button
              onClick={fakeGoogle}
              disabled={loading}
              className="w-full border-2 border-foreground py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 mb-6 flex items-center justify-center gap-3"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-foreground/20" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-foreground/20" />
            </div>

            <form onSubmit={fakeAuth} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm focus:outline-none focus:border-brand"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm focus:outline-none focus:border-brand"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-brand-foreground py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              {mode === "login" ? "New here? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-brand hover:underline uppercase tracking-widest"
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLogin;