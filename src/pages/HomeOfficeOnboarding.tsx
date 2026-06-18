import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SECURITY_QUESTIONS, hashAnswer } from "@/lib/security-questions";

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

const PAYMENT_OPTIONS: { value: "zelle" | "cashapp"; label: string; placeholder: string }[] = [
  { value: "zelle", label: "Zelle", placeholder: "Email or phone for Zelle" },
  { value: "cashapp", label: "Cash App", placeholder: "$yourtag" },
];

const HomeOfficeOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [q1, setQ1] = useState("");
  const [a1, setA1] = useState("");
  const [q2, setQ2] = useState("");
  const [a2, setA2] = useState("");
  const [methods, setMethods] = useState<string[]>([]);
  const [zelle, setZelle] = useState("");
  const [cashapp, setCashapp] = useState("");
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
      if (data.user.email?.toLowerCase() === "terellebony@gmail.com" || data.user.email?.toLowerCase() === "kimorataylor294@gmail.com") {
        navigate("/home-office", { replace: true });
        return;
      }
      setUserId(data.user.id);
      supabase
        .from("profiles")
        .select("full_name, business_name, onboarded, subscribed")
        .eq("user_id", data.user.id)
        .maybeSingle()
        .then(({ data: p }) => {
          if (p?.full_name) setFullName(p.full_name);
          if (p?.business_name) setBusinessName(p.business_name);
          // Returning from Stripe checkout
          if (params.get("checkout") === "success") {
            setStep(7);
            verifyAndEnter();
            return;
          }
          if (params.get("step") === "paywall" || p?.onboarded) {
            setStep(7);
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

  const handleBirthPhoneNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthdate || !phone.trim()) return;
    setStep(3);
  };

  const handleSecurityNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1 || !q2 || !a1.trim() || !a2.trim()) return;
    if (q1 === q2) {
      toast({ title: "Pick two different questions", variant: "destructive" });
      return;
    }
    setStep(4);
  };

  const handleBusinessNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setStep(5);
  };

  const handlePaymentsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(6);
  };

  const toggleMethod = (m: string) =>
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referral || !userId) return;
    setLoading(true);
    try {
      const [h1, h2] = await Promise.all([hashAnswer(a1), hashAnswer(a2)]);
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName.trim(),
            business_name: businessName.trim() || null,
            birthdate,
            phone: phone.trim(),
            security_question_1: q1,
            security_answer_1_hash: h1,
            security_question_2: q2,
            security_answer_2_hash: h2,
            recovery_setup_complete: true,
            zelle_handle: zelle.trim() || null,
            cashapp_handle: cashapp.trim() || null,
            payment_methods: methods,
            referral_source: referral,
            onboarded: false,
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      setStep(7);
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
            Step {step} of 7
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
            onSubmit={handleBirthPhoneNext}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">A few recovery details.</h1>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                Please enter your <span className="text-brand">correct birthdate</span> — this will be used in password recovery if you ever get locked out.
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Birthdate</label>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Phone number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="(555) 555-5555" required />
              <p className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">Used for recovery only.</p>
            </div>
            <button type="submit" className={btnCls}>Continue</button>
          </motion.form>
        ) : step === 3 ? (
          <motion.form
            key="step3sec"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSecurityNext}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Pick 2 security questions.</h1>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                If you forget your password we'll ask these along with your email and birthdate. Answers are hashed before storage.
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Question 1</label>
              <select value={q1} onChange={(e) => setQ1(e.target.value)} className={inputCls} required>
                <option value="" className="bg-black">Select a question…</option>
                {SECURITY_QUESTIONS.filter((q) => q !== q2).map((q) => (
                  <option key={q} value={q} className="bg-black">{q}</option>
                ))}
              </select>
              <input value={a1} onChange={(e) => setA1(e.target.value)} className={`${inputCls} mt-2`} placeholder="Your answer" required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Question 2</label>
              <select value={q2} onChange={(e) => setQ2(e.target.value)} className={inputCls} required>
                <option value="" className="bg-black">Select a question…</option>
                {SECURITY_QUESTIONS.filter((q) => q !== q1).map((q) => (
                  <option key={q} value={q} className="bg-black">{q}</option>
                ))}
              </select>
              <input value={a2} onChange={(e) => setA2(e.target.value)} className={`${inputCls} mt-2`} placeholder="Your answer" required />
            </div>
            <button type="submit" className={btnCls}>Continue</button>
          </motion.form>
        ) : step === 4 ? (
          <motion.form
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleBusinessNext}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">What's your business called?</h1>
              <p className="text-xs text-white/50 mt-2">
                This is the name your clients will see in the Client Portal when they go to pay you.
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">
                Business Name
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={inputCls}
                required
                autoFocus
              />
            </div>
            <button type="submit" className={btnCls}>
              Continue
            </button>
          </motion.form>
        ) : step === 5 ? (
          <motion.form
            key="step3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePaymentsNext}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight">How do your clients pay you?</h1>
              <p className="text-xs text-white/50 mt-2">
                Pick all that apply. We'll show these in your Client Portal so clients know how to send payment. You can add Stripe later from Profile.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_OPTIONS.map((opt) => {
                const on = methods.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleMethod(opt.value)}
                    className={`px-4 py-3 text-sm border transition-colors ${
                      on ? "border-brand text-brand" : "border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {methods.includes("zelle") && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Zelle</label>
                <input value={zelle} onChange={(e) => setZelle(e.target.value)} className={inputCls} placeholder="email or phone" />
              </div>
            )}
            {methods.includes("cashapp") && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Cash App</label>
                <input value={cashapp} onChange={(e) => setCashapp(e.target.value)} className={inputCls} placeholder="$yourtag" />
              </div>
            )}
            <button type="submit" className={btnCls}>Continue</button>
          </motion.form>
        ) : step === 6 ? (
          <motion.form
            key="step4"
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
            key="step5"
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
                onClick={() => setStep(6)}
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