import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const inputCls =
  "w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand transition-colors";
const btnCls =
  "w-full bg-brand text-brand-foreground py-3 font-mono text-sm uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50";

const REFERRAL_OPTIONS = [
  "Google search",
  "Social media",
  "Friend or colleague",
  "Existing RDG client",
  "Other",
];

const HomeOfficeOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [referral, setReferral] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/home-office/login");
        return;
      }
      setUserId(data.user.id);
      supabase
        .from("profiles")
        .select("full_name, onboarded")
        .eq("user_id", data.user.id)
        .maybeSingle()
        .then(({ data: p }) => {
          if (p?.onboarded) navigate("/home-office");
          if (p?.full_name) setFullName(p.full_name);
        });
    });
  }, [navigate]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setStep(2);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referral || !userId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName.trim(),
            referral_source: referral,
            onboarded: true,
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      navigate("/home-office");
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand">
            Step {step} of 2
          </p>
        </motion.div>

        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleNext}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                What's your name?
              </h1>
              <p className="text-xs text-white/50 mt-2">
                We'll use this across your Home Office.
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputCls}
                required
                autoFocus
              />
            </div>
            <button type="submit" className={btnCls}>
              Continue
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleFinish}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                How did you find us?
              </h1>
              <p className="text-xs text-white/50 mt-2">
                Helps us know what's working.
              </p>
            </div>
            <div className="space-y-2">
              {REFERRAL_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setReferral(opt)}
                  className={`w-full text-left px-4 py-3 text-sm border transition-colors ${
                    referral === opt
                      ? "border-brand text-brand"
                      : "border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button type="submit" disabled={loading || !referral} className={btnCls}>
              {loading ? "Saving..." : "Enter Home Office"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default HomeOfficeOnboarding;