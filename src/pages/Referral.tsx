import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const Referral = () => {
  const [form, setForm] = useState({
    yourName: "",
    yourEmail: "",
    referralName: "",
    referralEmail: "",
    referralBusiness: "",
    notes: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.yourName || !form.yourEmail || !form.referralName || !form.referralEmail) {
      toast({ title: "Fill in the required fields", variant: "destructive" });
      return;
    }
    const subject = `New Referral from ${form.yourName}`;
    const body =
      `Referrer\n────────\n` +
      `Name: ${form.yourName}\nEmail: ${form.yourEmail}\n\n` +
      `Referral\n────────\n` +
      `Name: ${form.referralName}\nEmail: ${form.referralEmail}\n` +
      `Business: ${form.referralBusiness || "—"}\n\n` +
      `Notes\n────────\n${form.notes || "—"}\n`;
    const mailto = `mailto:reeddigitalgroup@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const field = "w-full bg-transparent border-b-2 border-foreground/30 focus:border-brand outline-none py-2 font-mono text-sm";
  const label = "text-[10px] uppercase tracking-[0.3em] text-muted-foreground";

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Send work. Earn 10%.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Refer a client. Get 10% of every invoice they pay. Forever.
            </p>
          </motion.div>

          <form onSubmit={handleSend} className="mt-12 border border-border p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Your name *</label>
                <input className={field} value={form.yourName} onChange={(e) => set("yourName", e.target.value)} />
              </div>
              <div>
                <label className={label}>Your email *</label>
                <input type="email" className={field} value={form.yourEmail} onChange={(e) => set("yourEmail", e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Referral name *</label>
                <input className={field} value={form.referralName} onChange={(e) => set("referralName", e.target.value)} />
              </div>
              <div>
                <label className={label}>Referral email *</label>
                <input type="email" className={field} value={form.referralEmail} onChange={(e) => set("referralEmail", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={label}>Referral business</label>
              <input className={field} value={form.referralBusiness} onChange={(e) => set("referralBusiness", e.target.value)} />
            </div>
            <div>
              <label className={label}>Notes — what do they need?</label>
              <textarea
                rows={4}
                className={`${field} resize-none`}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand text-brand-foreground px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-brand/90 transition-colors"
            >
              Draft email & send →
            </button>
            <p className="text-[11px] text-muted-foreground text-center">
              Opens your mail client with the message pre-filled. You hit send.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Referral;