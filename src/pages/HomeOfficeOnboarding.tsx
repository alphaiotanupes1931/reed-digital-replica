import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [params] = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [referral, setReferral] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/home-office/login");
        return;
      }
      // Owner bypass — skip onboarding/paywall entirely
      if (data.user.email?.toLowerCase() === "terellebony@gmail.com") {
        navigate("/home-office", { replace: true });
        return;
      }
      setUserId(data.user.id);
      supabase
        .from("profiles")
        .select("full_name, onboarded, subscribed")
        .eq("user_id", data.user.id)
        .maybeSingle()
        .then(({ data: p }) => {
          if (p?.full_name) setFullName(p.full_name);
          // Returning from Stripe checkout
          if (params.get("checkout") === "success") {
            setStep(3);
            verifyAndEnter();
            return;
          }
          if (params.get("step") === "paywall" || p?.onboarded) {
            setStep(3);
          }
        });
    });
  }, [navigate]);

  const verifyAndEnter = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("ho-check-subscription");
      if (error) throw error;
      if (data?.subscribed) {
        // mark onboarded if not already
        const { data: u } = await supabase.auth.getUser();
        if (u.user) {
          await supabase
            .from("profiles")
            .update({ onboarded: true })
            .eq("user_id", u.user.id);
        }
        navigate("/home-office", { replace: true });
      } else {
        toast({
          title: "Subscription not active yet",
          description: "If you just paid, give it a moment and retry.",
        });
      }
    } catch (err: any) {
      toast({ title: "Couldn't verify", description: err.message, variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setStep(2);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
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
            onboarded: false,
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      setStep(3);
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ho-create-subscription");
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      toast({ title: "Couldn't start checkout", description: err.message, variant: "destructive" });
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand">
            Step {step} of 3
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
        ) : step === 2 ? (
          <motion.form
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSaveProfile}
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
              {loading ? "Saving..." : "Continue"}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                One last step.
              </h1>
              <p className="text-xs text-white/50 mt-2">
                Start your 7-day free trial. Cancel anytime before it ends and you won't be charged.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="border border-white/15 p-6"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">$20</span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">/ month</span>
              </div>
              <p className="mt-2 text-xs text-brand uppercase tracking-widest">7 days free</p>
              <ul className="mt-5 space-y-2 text-xs text-white/70">
                {[
                  "Full Home Office suite",
                  "Work Assistant, Bills, Invoices",
                  "Client Portal for your clients",
                  "All future tools included",
                  "Cancel anytime",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-brand">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {params.get("checkout") === "success" ? (
              <button
                onClick={verifyAndEnter}
                disabled={verifying}
                className={btnCls}
              >
                {verifying ? "Verifying..." : "Enter Home Office"}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={checkoutLoading}
                className={btnCls}
              >
                {checkoutLoading ? "Loading checkout..." : "Start Free Trial"}
              </button>
            )}

            {params.get("checkout") === "cancel" && (
              <p className="text-[11px] text-white/40 text-center">
                Checkout canceled. You can try again above.
              </p>
            )}

            <div className="flex items-center justify-between pt-2 text-[10px] uppercase tracking-widest">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-white/50 hover:text-brand transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => navigate("/home-office/welcome")}
                className="text-white/50 hover:text-brand transition-colors"
              >
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomeOfficeOnboarding;