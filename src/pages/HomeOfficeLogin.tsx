import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomeOfficeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("home-office-auth", {
        body: { action: "login", username, password },
      });
      if (error || data?.error) throw new Error(data?.error || "Login failed");
      sessionStorage.setItem("ho-token", data.token);
      navigate("/home-office");
    } catch (err: any) {
      toast({ title: "Access Denied", description: err.message, variant: "destructive" });
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
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Home Office</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleLogin}
            className="border-2 border-foreground p-8 space-y-6"
          >
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-brand-foreground py-3 font-mono text-sm uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Enter"}
            </button>
          </motion.form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeOfficeLogin;
