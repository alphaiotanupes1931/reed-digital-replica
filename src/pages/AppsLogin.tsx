import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup";

const AppsLogin = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // FAKE AUTH — backlog: replace with Lovable Cloud auth (email/password + Google OAuth)
  const fakeAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = { email: email || "guest@rdg.app", phone, name: email.split("@")[0] || "Guest" };
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
            <Link to="/apps" className="text-xs uppercase tracking-[0.3em] text-brand hover:underline">
              ← RDG Apps
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
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
              className="w-full border-2 border-foreground py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 mb-6"
            >
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
                <label className="block text-xs uppercase tracking-widest mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm focus:outline-none focus:border-brand"
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

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest mt-6">
            Demo authentication · production auth coming soon
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppsLogin;