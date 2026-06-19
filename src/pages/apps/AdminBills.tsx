import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppsAuth } from "./useAppsAuth";
import AppsShell from "./AppsShell";

type Bill = { id: string; company_name: string; price: number; notes: string | null; hidden: boolean };
type Income = { id: string; source: string; price: number; category: string };

export default function AdminBills() {
  const { user } = useAppsAuth();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const [bForm, setBForm] = useState({ company_name: "", price: "", notes: "" });
  const [iForm, setIForm] = useState({ source: "", price: "" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [b, i] = await Promise.all([
      supabase.from("monthly_bills").select("id, company_name, price, notes, hidden").eq("owner_user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("extra_income").select("id, source, price, category").eq("owner_user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (b.data) setBills(b.data as Bill[]);
    if (i.data) setIncome(i.data as Income[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bForm.company_name || !bForm.price) return;
    const { error } = await supabase.from("monthly_bills").insert({
      company_name: bForm.company_name,
      price: parseFloat(bForm.price),
      notes: bForm.notes || null,
      hidden: false,
      owner_user_id: user.id,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setBForm({ company_name: "", price: "", notes: "" });
    load();
  };

  const addIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !iForm.source || !iForm.price) return;
    const { error } = await supabase.from("extra_income").insert({
      source: iForm.source,
      price: parseFloat(iForm.price),
      category: "recurring",
      owner_user_id: user.id,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setIForm({ source: "", price: "" });
    load();
  };

  const remove = async (table: "monthly_bills" | "extra_income", id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const toggleHidden = async (id: string, hidden: boolean) => {
    const { error } = await supabase.from("monthly_bills").update({ hidden: !hidden }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setBills(prev => prev.map(b => b.id === id ? { ...b, hidden: !hidden } : b));
  };

  const totalBills = bills.filter(b => !b.hidden).reduce((s, b) => s + Number(b.price || 0), 0);
  const totalIncome = income.reduce((s, i) => s + Number(i.price || 0), 0);
  const net = totalIncome - totalBills;

  return (
    <AppsShell title="Bills Tracker" subtitle="Monthly bills vs recurring income.">
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-foreground/15 rounded-md p-5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bills</div>
          <div className="text-2xl font-bold mt-2">${totalBills.toFixed(2)}</div>
        </div>
        <div className="border border-foreground/15 rounded-md p-5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Income</div>
          <div className="text-2xl font-bold mt-2">${totalIncome.toFixed(2)}</div>
        </div>
        <div className="border-2 border-brand rounded-md p-5 bg-brand/5">
          <div className="text-[10px] uppercase tracking-widest text-brand">Net / mo</div>
          <div className={`text-2xl font-bold mt-2 ${net < 0 ? "text-destructive" : ""}`}>${net.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Monthly Bills</h2>
          <form onSubmit={addBill} className="grid grid-cols-[1fr,100px,auto] gap-2 mb-4">
            <input placeholder="Company" value={bForm.company_name} onChange={e => setBForm(s => ({ ...s, company_name: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
            <input placeholder="$" type="number" step="0.01" value={bForm.price} onChange={e => setBForm(s => ({ ...s, price: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
            <button className="bg-foreground text-background px-3 py-2 text-xs rounded-md">Add</button>
          </form>
          <div className="space-y-2">
            {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : bills.length === 0 ? <p className="text-sm text-muted-foreground">No bills yet.</p> :
              bills.map(b => (
                <div key={b.id} className={`flex items-center justify-between border rounded-md px-4 py-2.5 ${b.hidden ? "border-foreground/10 bg-muted/30 opacity-60" : "border-foreground/15"}`}>
                  <div className="text-sm">{b.company_name}</div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${b.hidden ? "line-through text-muted-foreground" : ""}`}>${Number(b.price).toFixed(2)}</span>
                    <button onClick={() => toggleHidden(b.id, b.hidden)} className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
                      {b.hidden ? "Show" : "Hide"}
                    </button>
                    <button onClick={() => remove("monthly_bills", b.id)} className="text-xs text-muted-foreground hover:text-destructive">×</button>
                  </div>
                </div>
              ))
            }
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Recurring Income</h2>
          <form onSubmit={addIncome} className="grid grid-cols-[1fr,100px,auto] gap-2 mb-4">
            <input placeholder="Source" value={iForm.source} onChange={e => setIForm(s => ({ ...s, source: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
            <input placeholder="$" type="number" step="0.01" value={iForm.price} onChange={e => setIForm(s => ({ ...s, price: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
            <button className="bg-foreground text-background px-3 py-2 text-xs rounded-md">Add</button>
          </form>
          <div className="space-y-2">
            {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : income.length === 0 ? <p className="text-sm text-muted-foreground">No income yet.</p> :
              income.map(i => (
                <div key={i.id} className="flex items-center justify-between border border-foreground/15 rounded-md px-4 py-2.5">
                  <div className="text-sm">{i.source}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">${Number(i.price).toFixed(2)}</span>
                    <button onClick={() => remove("extra_income", i.id)} className="text-xs text-muted-foreground hover:text-destructive">×</button>
                  </div>
                </div>
              ))
            }
          </div>
        </section>
      </div>
    </AppsShell>
  );
}
