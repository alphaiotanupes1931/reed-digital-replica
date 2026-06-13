import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/rdg-header-logo.png";

const ROLES = [
  "Freelancer / Solo",
  "Agency owner",
  "Small business",
  "Side hustle",
  "Other",
];

const GOALS = [
  "Track taxes & deductions",
  "Send invoices & get paid",
  "Manage clients & projects",
  "All of the above",
];

const AppsOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState<string>("");
  const [goal, setGoal] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/apps/login", { replace: true });
        return;
      }
      const userId = sess.session.user.id;
      const meta = sess.session.user.user_metadata || {};
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, business_name, role, primary_goal, onboarded")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile?.onboarded) {
        navigate("/apps", { replace: true });
        return;
      }

      setFullName(profile?.full_name || meta.full_name || meta.name || "");
      setBusinessName(profile?.business_name || "");
      setRole(profile?.role || "");
      setGoal(profile?.primary_goal || "");
      setChecking(false);
    })();
  }, [navigate]);

  const steps = [
    {
      title: "What should we call you?",
      subtitle: "Your name shows up on invoices and across the suite.",
      valid: fullName.trim().length >= 2,
    },
    {
      title: "What's your business called?",
      subtitle: "Optional — leave blank if you're just trying things out.",
      valid: true,
    },
    {
      title: "What best describes you?",
      subtitle: "We'll tailor the dashboard to match.",
      valid: !!role,
    },
    {
      title: "What brought you here?",
      subtitle: "Pick the one that matters most right now.",
      valid: !!goal,
    },
  ];

  const current = steps[step];

  const next = async () => {
    if (!current.valid) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    // Final step → save
    setLoading(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user.id;
      if (!userId) throw new Error("No active session");

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName.trim(),
            business_name: businessName.trim() || null,
            role,
            primary_goal: goal,
            onboarded: true,
          },
          { onConflict: "user_id" },
        );
      if (error) throw error;

      // Also sync into auth metadata so the dashboard greeting picks it up
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), business_name: businessName.trim() || null },
      });

      navigate("/apps", { replace: true });
    } catch (err: any) {
      toast({ title: "Could not save", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const back = () => step > 0 && setStep(step - 1);

  if (checking) {
    return (
      <div className="min-h-screen bg-background font-apps flex items-center justify-center">
        <div className="text-xs text-muted-foreground uppercase tracking-widest">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-apps flex flex-col">
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
        <img src={logo} alt="RDG" className="h-8 w-auto" />
        <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono-num">
          {step + 1} / {steps.length}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[440px]"
        >
          {/* Progress bar */}
          <div className="flex gap-1.5 mb-10">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-brand" : "bg-foreground/10"
                }`}
              />
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{current.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">{current.subtitle}</p>

          <div className="mt-7">
            {step === 0 && (
              <input
                type="text"
                autoFocus
                placeholder="Your full name"
                value={fullName}
                maxLength={80}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                className="w-full border border-foreground/15 bg-background px-3.5 py-3 rounded-md text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            )}

            {step === 1 && (
              <input
                type="text"
                autoFocus
                placeholder="e.g. Acme Studio (optional)"
                value={businessName}
                maxLength={120}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                className="w-full border border-foreground/15 bg-background px-3.5 py-3 rounded-md text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`text-left px-4 py-3 rounded-md border text-sm transition-all ${
                      role === r
                        ? "border-brand bg-brand/5 text-foreground"
                        : "border-foreground/15 hover:border-foreground/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`text-left px-4 py-3 rounded-md border text-sm transition-all ${
                      goal === g
                        ? "border-brand bg-brand/5 text-foreground"
                        : "border-foreground/15 hover:border-foreground/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                disabled={loading}
                className="px-4 py-2.5 text-sm rounded-md border border-foreground/15 hover:bg-muted/60 transition-colors disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={next}
              disabled={!current.valid || loading}
              className="ml-auto px-6 py-2.5 text-sm font-medium rounded-md bg-foreground text-background hover:bg-brand hover:text-brand-foreground transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving…"
                : step === steps.length - 1
                ? "Finish"
                : "Continue"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AppsOnboarding;