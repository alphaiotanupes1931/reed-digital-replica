import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SECURITY_QUESTIONS, hashAnswer } from "@/lib/security-questions";

const PAYMENT_OPTIONS = ["zelle", "cashapp", "stripe"] as const;

const HomeOfficeProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [stripeKey, setStripeKey] = useState("");
  const [zelle, setZelle] = useState("");
  const [cashapp, setCashapp] = useState("");
  const [methods, setMethods] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [updateAnswers, setUpdateAnswers] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/home-office/login");
        return;
      }
      setEmail(data.user.email || "");
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, business_name, stripe_secret_key, zelle_handle, cashapp_handle, payment_methods, phone, security_question_1, security_question_2")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (p) {
        setFullName(p.full_name || "");
        setBusinessName(p.business_name || "");
        setStripeKey(p.stripe_secret_key || "");
        setZelle(p.zelle_handle || "");
        setCashapp(p.cashapp_handle || "");
        setMethods((p.payment_methods as string[]) || []);
        setPhone(p.phone || "");
        setQ1(p.security_question_1 || SECURITY_QUESTIONS[0]);
        setQ2(p.security_question_2 || SECURITY_QUESTIONS[1]);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const toggleMethod = (m: string) =>
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Not signed in");
      if (q1 === q2) throw new Error("Pick two different security questions");
      if (updateAnswers && (!a1.trim() || !a2.trim())) {
        throw new Error("Enter answers for both questions");
      }
      const update: any = {
        full_name: fullName.trim() || null,
        business_name: businessName.trim() || null,
        stripe_secret_key: stripeKey.trim() || null,
        zelle_handle: zelle.trim() || null,
        cashapp_handle: cashapp.trim() || null,
        payment_methods: methods,
        phone: phone.trim() || null,
        security_question_1: q1,
        security_question_2: q2,
      };
      if (updateAnswers) {
        update.security_answer_1_hash = await hashAnswer(a1);
        update.security_answer_2_hash = await hashAnswer(a2);
      }
      const { error } = await supabase
        .from("profiles")
        .update(update)
        .eq("user_id", data.user.id);
      if (error) throw error;
      setA1(""); setA2(""); setUpdateAnswers(false);
      toast({ title: "Saved" });
    } catch (err: any) {
      toast({ title: "Couldn't save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/home-office" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand">
              ← Home Office
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">Profile</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your business details and how your clients pay you.
            </p>
          </motion.div>

          {loading ? (
            <p className="mt-10 text-xs uppercase tracking-widest text-muted-foreground">Loading…</p>
          ) : (
            <div className="mt-10 space-y-8">
              <Field label="Your Name">
                <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Field>

              <Field label="Email" help="To change your email, contact info@reeddigitalgroup.com.">
                <div className="flex gap-2">
                  <input className={`${inputCls} flex-1 opacity-60 cursor-not-allowed`} value={email} readOnly disabled />
                  <a
                    href="mailto:info@reeddigitalgroup.com?subject=Email%20change%20request"
                    className="px-3 flex items-center text-[10px] uppercase tracking-widest border-2 border-foreground/20 hover:border-brand"
                  >
                    Request Change
                  </a>
                </div>
              </Field>

              <Field label="Phone Number" help="Used for password recovery.">
                <input
                  type="tel"
                  className={inputCls}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-123-4567"
                />
              </Field>

              <Field label="Business Name" help="Shown to your clients in the Client Portal.">
                <input className={inputCls} value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </Field>

              <div className="border-2 border-foreground/20 p-5 space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brand font-bold mb-1">Security Questions</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Used to verify it's you during password recovery. You can change the questions any time — leave the answers blank to keep your existing ones.
                  </p>
                </div>

                <Field label="Question 1">
                  <select className={inputCls} value={q1} onChange={(e) => setQ1(e.target.value)}>
                    {SECURITY_QUESTIONS.filter((q) => q !== q2).map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </Field>
                {updateAnswers && (
                  <Field label="Answer 1">
                    <input className={inputCls} value={a1} onChange={(e) => setA1(e.target.value)} />
                  </Field>
                )}

                <Field label="Question 2">
                  <select className={inputCls} value={q2} onChange={(e) => setQ2(e.target.value)}>
                    {SECURITY_QUESTIONS.filter((q) => q !== q1).map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </Field>
                {updateAnswers && (
                  <Field label="Answer 2">
                    <input className={inputCls} value={a2} onChange={(e) => setA2(e.target.value)} />
                  </Field>
                )}

                <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updateAnswers}
                    onChange={(e) => setUpdateAnswers(e.target.checked)}
                    className="h-4 w-4 accent-brand"
                  />
                  Update my answers
                </label>
              </div>

              <div className="border-2 border-foreground/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand font-bold mb-1">Accept payments from clients</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Pick the methods your clients can use. Whatever you select shows up in your Client Portal.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_OPTIONS.map((m) => {
                    const on = methods.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMethod(m)}
                        className={`px-3 py-2 text-xs uppercase tracking-widest border-2 transition-colors ${
                          on ? "border-brand bg-brand/10 text-brand" : "border-foreground/20 text-foreground/60 hover:border-foreground/50"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {methods.includes("zelle") && (
                <Field label="Zelle Email or Phone">
                  <input className={inputCls} value={zelle} onChange={(e) => setZelle(e.target.value)} placeholder="you@example.com or 555-1234" />
                </Field>
              )}

              {methods.includes("cashapp") && (
                <Field label="Cash App $Cashtag">
                  <input className={inputCls} value={cashapp} onChange={(e) => setCashapp(e.target.value)} placeholder="$yourtag" />
                </Field>
              )}

              {methods.includes("stripe") && (
              <div className="border-2 border-foreground/20 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand font-bold mb-1">
                  Stripe Secret API Key <span className="text-foreground/50 normal-case tracking-normal">(optional)</span>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Add your Stripe secret key so your clients can pay by card directly to your Stripe account through the Client Portal.
                  <br /><br />
                  <strong className="text-foreground">How to get one:</strong> Sign in at{" "}
                  <a className="text-brand underline" target="_blank" rel="noreferrer" href="https://dashboard.stripe.com/apikeys">
                    dashboard.stripe.com/apikeys
                  </a>{" "}
                  → "Secret key" → click "Reveal" → copy. It starts with <code className="text-brand">sk_live_</code> or <code className="text-brand">sk_test_</code>.
                  <br /><br />
                  <strong className="text-foreground">Why we need it:</strong> The app uses it to create checkout sessions that route the money straight to you. It's stored on your row only. Leave blank if you don't want card payments — Zelle/Cash App will still work.
                </p>
                <div className="flex gap-2">
                  <input
                    className={`${inputCls} flex-1`}
                    type={showKey ? "text" : "password"}
                    value={stripeKey}
                    onChange={(e) => setStripeKey(e.target.value)}
                    placeholder="sk_live_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="px-3 text-[10px] uppercase tracking-widest border-2 border-foreground/20 hover:border-brand"
                  >
                    {showKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-brand text-brand-foreground py-3 text-xs uppercase tracking-widest hover:bg-brand/90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const inputCls =
  "w-full bg-background border-2 border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:border-brand transition-colors";

const Field = ({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-[0.2em] text-foreground/70 mb-2">{label}</label>
    {children}
    {help && <p className="text-[11px] text-muted-foreground mt-2">{help}</p>}
  </div>
);

export default HomeOfficeProfile;