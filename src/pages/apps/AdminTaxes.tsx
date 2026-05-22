import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppsAuth } from "./useAppsAuth";
import AppsShell from "./AppsShell";

type Reminder = { id: string; title: string; amount: number; due_date: string | null; paid: boolean; notes: string | null };

export default function AdminTaxes() {
  const { user } = useAppsAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", amount: "", due_date: "", notes: "" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("tax_reminders").select("id, title, amount, due_date, paid, notes").eq("owner_user_id", user.id).order("due_date", { ascending: true });
    if (data) setItems(data as Reminder[]);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title) return;
    const { error } = await supabase.from("tax_reminders").insert({
      title: form.title,
      amount: form.amount ? parseFloat(form.amount) : 0,
      due_date: form.due_date || null,
      notes: form.notes || null,
      owner_user_id: user.id,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setForm({ title: "", amount: "", due_date: "", notes: "" });
    load();
  };

  const togglePaid = async (id: string, paid: boolean) => {
    await supabase.from("tax_reminders").update({ paid: !paid } as any).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("tax_reminders").delete().eq("id", id);
    load();
  };

  const total = items.reduce((s, i) => s + (i.paid ? 0 : Number(i.amount || 0)), 0);

  return (
    <AppsShell title="Tax Tracker" subtitle="Log quarterly estimates and tax obligations.">
      <div className="border-2 border-brand bg-brand/5 rounded-md p-5 mb-8 flex items-baseline justify-between">
        <div className="text-[10px] uppercase tracking-widest text-brand">Outstanding</div>
        <div className="text-2xl font-bold">${total.toFixed(2)}</div>
      </div>

      <form onSubmit={add} className="border border-foreground/15 rounded-md p-5 mb-8 grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3">
        <input placeholder="e.g. Q3 Federal Estimate" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
        <input placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={e => setForm(s => ({ ...s, amount: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
        <input type="date" value={form.due_date} onChange={e => setForm(s => ({ ...s, due_date: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
        <button className="bg-foreground text-background px-4 py-2 text-xs rounded-md">Add</button>
      </form>

      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
        <div className="border border-dashed border-foreground/20 rounded-md p-12 text-center">
          <p className="text-sm text-muted-foreground">No tax reminders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.id} className={`border rounded-md p-4 flex items-center justify-between ${it.paid ? "border-foreground/10 opacity-60" : "border-foreground/15"}`}>
              <div>
                <div className={`text-sm font-semibold ${it.paid ? "line-through" : ""}`}>{it.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {it.due_date ? `Due ${it.due_date}` : "No due date"} · ${Number(it.amount).toFixed(2)}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => togglePaid(it.id, it.paid)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:bg-muted rounded-sm">
                  {it.paid ? "Unpaid" : "Paid"}
                </button>
                <button onClick={() => remove(it.id)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppsShell>
  );
}