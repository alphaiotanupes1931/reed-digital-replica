import { useState } from"react";
import { useNavigate } from"react-router-dom";
import { motion } from"framer-motion";
import { supabase } from"@/integrations/supabase/client";
import { useToast } from"@/hooks/use-toast";

const inputCls =
"w-full bg-secondary border border-border rounded-xl text-foreground px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors";
const btnCls =
"w-full bg-brand text-brand-foreground rounded-full py-3 rounded-full text-xs uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50";

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label:"At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label:"1 uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label:"1 number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label:"1 special character" },
];

const HomeOfficeForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sendingLink, setSendingLink] = useState(false);

  const sendResetEmail = async () => {
    if (!email) {
      toast({ title:"Enter your email first", variant:"destructive" });
      return;
    }
    setSendingLink(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/home-office/reset-password`,
      });
      if (error) throw error;
      toast({
        title:"Reset link sent",
        description: `Check ${email} for a link to set a new password.`,
      });
    } catch (err: any) {
      toast({ title:"Couldn't send email", description: err.message, variant:"destructive" });
    } finally {
      setSendingLink(false);
    }
  };

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ho-recovery", {
        body: { action:"get_questions", email },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message ||"Lookup failed");
      setQ1(data.question_1);
      setQ2(data.question_2);
      setStep(2);
    } catch (err: any) {
      toast({ title:"Couldn't continue", description: err.message, variant:"destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD_RULES.every((r) => r.test(newPassword))) {
      toast({ title:"Weak password", description:"8+ chars, 1 uppercase, 1 number, 1 special.", variant:"destructive" });
      return;
    }
    if (newPassword !== confirm) {
      toast({ title:"Passwords don't match", variant:"destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ho-recovery", {
        body: {
          action:"reset_password",
          email,
          birthdate,
          answer_1: a1,
          answer_2: a2,
          new_password: newPassword,
        },
      });
      // supabase-js returns the response body in `data` even on non-2xx for edge functions
      let errMsg: string | undefined = data?.error;
      if (!errMsg && error) {
        try {
          const resp = (error as any)?.context?.response;
          if (resp) {
            const body = await resp.clone().json();
            errMsg = body?.error;
          }
        } catch { /* ignore */ }
        errMsg = errMsg || error.message ||"Reset failed";
      }
      if (errMsg) throw new Error(errMsg);
      toast({ title:"Password updated", description:"You can now log in." });
      navigate("/home-office/login");
    } catch (err: any) {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      const description =
        next >= 5
          ? `${err.message} If you keep having trouble, please contact info@reeddigitalgroup.com for assistance.`
          : err.message;
      toast({
        title: next >= 5 ?"Still having trouble?" :"Verification failed",
        description,
        variant:"destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand">Account Recovery</p>
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            {step === 1 ?"Verify your account" :"Answer your questions"}
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            {step === 1
              ?"Enter the email tied to your Home Office account."
              :"We'll reset your password if everything matches."}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={lookup} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required autoFocus />
            </div>
            <button type="submit" disabled={loading} className={btnCls}>
              {loading ?"Looking up..." :"Continue"}
            </button>
            <button
              type="button"
              onClick={sendResetEmail}
              disabled={sendingLink}
              className="w-full border border-border rounded-full py-3 text-xs uppercase tracking-widest text-foreground hover:border-brand transition-colors disabled:opacity-50"
            >
              {sendingLink ?"Sending..." :"Email me a reset link instead"}
            </button>
            <button type="button" onClick={() => navigate("/home-office/login")} className="block w-full text-center text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors">
              ← Back to login
            </button>
          </form>
        ) : (
          <form onSubmit={reset} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Birthdate</label>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{q1}</label>
              <input value={a1} onChange={(e) => setA1(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{q2}</label>
              <input value={a2} onChange={(e) => setA2(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} required autoComplete="new-password" />
              <ul className="mt-3 space-y-1 text-[10px] uppercase tracking-widest">
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(newPassword);
                  return (
                    <li key={r.label} className={ok ?"text-brand" :"text-white/40"}>
                      [{ok ?"x" :""}] {r.label}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} required autoComplete="new-password" />
            </div>
            <button type="submit" disabled={loading} className={btnCls}>
              {loading ?"Verifying..." :"Reset Password"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="block w-full text-center text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors">
              ← Start over
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default HomeOfficeForgotPassword;