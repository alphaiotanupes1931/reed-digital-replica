import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SECURITY_QUESTIONS, hashAnswer } from "@/lib/security-questions";

const inputCls =
  "w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand transition-colors";
const btnCls =
  "w-full bg-brand text-brand-foreground py-3 font-mono text-sm uppercase tracking-widest hover:bg-brand/90 transition-colors disabled:opacity-50";

const HomeOfficeRecoverySetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [q1, setQ1] = useState("");
  const [a1, setA1] = useState("");
  const [q2, setQ2] = useState("");
  const [a2, setA2] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/home-office/login");
        return;
      }
      setUserId(data.user.id);
      supabase
        .from("profiles")
        .select("birthdate, phone, security_question_1, security_question_2, recovery_setup_complete")
        .eq("user_id", data.user.id)
        .maybeSingle()
        .then(({ data: p }) => {
          if (p?.birthdate) setBirthdate(p.birthdate);
          if (p?.phone) setPhone(p.phone);
          if (p?.security_question_1) setQ1(p.security_question_1);
          if (p?.security_question_2) setQ2(p.security_question_2);
        });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!birthdate || !phone || !q1 || !q2 || !a1.trim() || !a2.trim()) return;
    if (q1 === q2) {
      toast({ title: "Pick two different questions", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const [h1, h2] = await Promise.all([hashAnswer(a1), hashAnswer(a2)]);
      const { error } = await supabase
        .from("profiles")
        .update({
          birthdate,
          phone: phone.trim(),
          security_question_1: q1,
          security_answer_1_hash: h1,
          security_question_2: q2,
          security_answer_2_hash: h2,
          recovery_setup_complete: true,
        })
        .eq("user_id", userId);
      if (error) throw error;
      toast({ title: "Recovery info saved" });
      navigate("/home-office");
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const questionOptions = (exclude: string) =>
    SECURITY_QUESTIONS.filter((q) => q !== exclude);

  return (
    <div className="min-h-screen bg-black font-mono text-white flex items-center justify-center px-6 py-12">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-md space-y-6"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand">Account Recovery Setup</p>
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            Secure your account.
          </h1>
          <p className="text-xs text-white/50 mt-2 leading-relaxed">
            If you ever get locked out, we'll verify your identity with the info below. Please enter your <span className="text-brand">correct birthdate</span> as this will be used in password recovery.
          </p>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Birthdate</label>
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className={inputCls} required />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Phone number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="(555) 555-5555" required />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Security Question 1</label>
          <select value={q1} onChange={(e) => setQ1(e.target.value)} className={inputCls} required>
            <option value="" className="bg-black">Select a question…</option>
            {questionOptions(q2).map((q) => (
              <option key={q} value={q} className="bg-black">{q}</option>
            ))}
          </select>
          <input value={a1} onChange={(e) => setA1(e.target.value)} className={`${inputCls} mt-2`} placeholder="Your answer" required />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Security Question 2</label>
          <select value={q2} onChange={(e) => setQ2(e.target.value)} className={inputCls} required>
            <option value="" className="bg-black">Select a question…</option>
            {questionOptions(q1).map((q) => (
              <option key={q} value={q} className="bg-black">{q}</option>
            ))}
          </select>
          <input value={a2} onChange={(e) => setA2(e.target.value)} className={`${inputCls} mt-2`} placeholder="Your answer" required />
        </div>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>
        <p className="text-[10px] text-white/40 text-center uppercase tracking-widest">
          Answers are hashed before storage.
        </p>
      </motion.form>
    </div>
  );
};

export default HomeOfficeRecoverySetup;