import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

type IncomeRow = { id: string; entry_date: string; source: string; amount: number; notes: string | null; invoice_id: string | null; date_precision: "day" | "month" };
type W2DocRow = { id: string; year: number; employer: string; file_path: string; file_name: string; mime_type: string | null; size_bytes: number | null; notes: string | null; created_at: string };
type ExpenseRow = { id: string; entry_date: string; category: string; description: string; amount: number; receipt_note: string | null };
type MileageRow = { id: string; entry_date: string; purpose: string; miles: number; gas_amount: number; vehicle: string | null };
type ReminderRow = { id: string; title: string; amount: number; due_date: string | null; paid: boolean; notes: string | null };
type InvoiceRow = { id: string; service: string; price: number; status: string; due_date: string; paid_at: string | null; client_id: string };

const EXPENSE_CATEGORIES = ["Equipment", "Software", "Office", "Meals", "Travel", "Utilities", "Marketing", "Other"];
const TABS = ["Income", "W-2 Forms", "Expenses", "Mileage", "Reminders", "Calendar"] as const;
type Tab = typeof TABS[number];

const fmt = (n: number) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const todayISO = () => new Date().toISOString().slice(0, 10);
const todayMonthISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
const monthLabel = (iso: string) => { const [y, m] = iso.split("-").map(Number); return new Date(y, (m || 1) - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" }); };
const formatEntryDate = (iso: string, precision: "day" | "month") => precision === "month" ? monthLabel(iso) : iso;
const yearStart = () => `${new Date().getFullYear()}-01-01`;
const yearEnd = () => `${new Date().getFullYear()}-12-31`;

export default function Taxes() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState<{ full_name: string | null; business_name: string | null; accountant_email: string | null; accountant_name: string | null; last_accountant_notified_at: string | null } | null>(null);
  const [income, setIncome] = useState<IncomeRow[]>([]);
  const [w2Docs, setW2Docs] = useState<W2DocRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [mileage, setMileage] = useState<MileageRow[]>([]);
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [tab, setTab] = useState<Tab>("Income");
  const [loading, setLoading] = useState(true);
  const [showAccountantModal, setShowAccountantModal] = useState(false);
  const [accountantEmail, setAccountantEmail] = useState("");
  const [accountantName, setAccountantName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { navigate("/home-office/login"); return; }
      setUserId(auth.user.id);
      await Promise.all([loadProfile(auth.user.id), loadAll(auth.user.id)]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async (uid: string) => {
    const { data } = await supabase.from("profiles").select("full_name, business_name, accountant_email, accountant_name, last_accountant_notified_at").eq("user_id", uid).maybeSingle();
    if (data) {
      setProfile(data as any);
      setAccountantEmail((data as any).accountant_email || "");
      setAccountantName((data as any).accountant_name || "");
    }
  };

  const loadAll = async (uid: string) => {
    const [i, w, e, m, r, inv] = await Promise.all([
      supabase.from("tax_income_entries").select("*").eq("owner_user_id", uid).order("entry_date", { ascending: false }),
      supabase.from("tax_w2_documents").select("*").eq("owner_user_id", uid).order("year", { ascending: false }),
      supabase.from("tax_expenses").select("*").eq("owner_user_id", uid).order("entry_date", { ascending: false }),
      supabase.from("tax_mileage_entries").select("*").eq("owner_user_id", uid).order("entry_date", { ascending: false }),
      supabase.from("tax_reminders").select("*").eq("owner_user_id", uid).order("due_date", { ascending: true }),
      supabase.from("invoices").select("id, service, price, status, due_date, paid_at, client_id").eq("owner_user_id", uid),
    ]);
    if (i.data) setIncome(i.data as any);
    if (w.data) setW2Docs(w.data as any);
    if (e.data) setExpenses(e.data as any);
    if (m.data) setMileage(m.data as any);
    if (r.data) setReminders(r.data as any);
    if (inv.data) {
      setInvoices(inv.data as any);
      // Auto-import any newly paid invoices that haven't been pulled yet
      const importedIds = new Set((i.data as any[] | null)?.map((r) => r.invoice_id).filter(Boolean) ?? []);
      const newPaid = (inv.data as any[]).filter((p) => p.status === "paid" && !importedIds.has(p.id));
      if (newPaid.length > 0) {
        const rows = newPaid.map((p) => ({
          owner_user_id: uid,
          entry_date: (p.paid_at || p.due_date || todayISO()).slice(0, 10),
          date_precision: "day",
          source: `Invoice: ${p.service}`,
          amount: Number(p.price),
          invoice_id: p.id,
        }));
        await supabase.from("tax_income_entries").insert(rows as any);
        const { data: refreshed } = await supabase.from("tax_income_entries").select("*").eq("owner_user_id", uid).order("entry_date", { ascending: false });
        if (refreshed) setIncome(refreshed as any);
      }
    }
  };

  const totals = useMemo(() => {
    const inYear = (d: string | null) => !!d && d >= yearStart() && d <= yearEnd();
    const bizIncome = income.filter(i => inYear(i.entry_date)).reduce((s, i) => s + Number(i.amount), 0);
    const w2Count = w2Docs.filter(w => w.year === new Date().getFullYear()).length;
    const exp = expenses.filter(e => inYear(e.entry_date)).reduce((s, e) => s + Number(e.amount), 0);
    const miles = mileage.filter(m => inYear(m.entry_date)).reduce((s, m) => s + Number(m.miles), 0);
    const gas = mileage.filter(m => inYear(m.entry_date)).reduce((s, m) => s + Number(m.gas_amount), 0);
    const deductible = exp + miles * 0.67;
    return { bizIncome, w2Count, exp, miles, gas, deductible };
  }, [income, w2Docs, expenses, mileage]);

  const pullFromInvoices = async () => {
    const paid = invoices.filter(i => i.status === "paid");
    const existing = new Set(income.map(i => i.invoice_id).filter(Boolean));
    const toAdd = paid.filter(p => !existing.has(p.id));
    if (toAdd.length === 0) { toast.info("No new paid invoices to import."); return; }
    const rows = toAdd.map(p => ({
      owner_user_id: userId,
      entry_date: (p.paid_at || p.due_date || todayISO()).slice(0, 10),
      date_precision: "day",
      source: `Invoice: ${p.service}`,
      amount: Number(p.price),
      invoice_id: p.id,
    }));
    const { error } = await supabase.from("tax_income_entries").insert(rows as any);
    if (error) { toast.error(error.message); return; }
    toast.success(`Imported ${toAdd.length} invoice${toAdd.length === 1 ? "" : "s"}.`);
    await loadAll(userId);
  };

  const saveAccountantContact = async () => {
    const { error } = await supabase.from("profiles").update({ accountant_email: accountantEmail || null, accountant_name: accountantName || null } as any).eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    toast.success("Accountant contact saved.");
    await loadProfile(userId);
  };

  const notifyAccountant = async () => {
    if (!profile?.accountant_email) { setShowAccountantModal(true); return; }
    const { data: settings } = await supabase.from("accountant_settings").select("share_token").eq("owner_user_id", userId).maybeSingle();
    const ownerName = profile.business_name || profile.full_name || "Your client";
    const portalLink = settings?.share_token ? `${window.location.origin}/accountant/${settings.share_token}` : "";
    const subject = encodeURIComponent(`Tax info updated — ${ownerName}`);
    const lines = [
      `Hi ${profile.accountant_name || ""},`,
      ``,
      `${ownerName} just updated their tax info in the Home Office app.`,
      ``,
      `Current YTD snapshot:`,
      `- Business income: ${fmt(totals.bizIncome)}`,
      `- W-2 forms on file: ${totals.w2Count}`,
      `- Expenses / write-offs: ${fmt(totals.exp)}`,
      `- Mileage: ${totals.miles.toFixed(1)} mi (gas: ${fmt(totals.gas)})`,
      ``,
      portalLink ? `View the live data (read-only):\n${portalLink}\n\n(Use the passcode shared previously.)` : ``,
      ``,
      `Thanks!`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${profile.accountant_email}?subject=${subject}&body=${body}`;
    await supabase.from("profiles").update({ last_accountant_notified_at: new Date().toISOString() } as any).eq("user_id", userId);
    await loadProfile(userId);
  };

  if (loading) {
    return <div className="min-h-screen bg-background font-mono flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate("/home-office")} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand">← Home Office</button>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3">Taxes</h1>
            <p className="text-sm text-muted-foreground mt-2">Keep your accountant in the loop. Update once, notify with one click.</p>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 border-2 border-foreground">
            {[
              { label: "Business Income", value: fmt(totals.bizIncome) },
              { label: "W-2 Forms", value: `${totals.w2Count} on file` },
              { label: "Expenses", value: fmt(totals.exp) },
              { label: "Mileage", value: `${totals.miles.toFixed(0)} mi` },
              { label: "Est. Deductible", value: fmt(totals.deductible) },
            ].map((s, idx) => (
              <div key={s.label} className={`p-5 ${idx > 0 ? "md:border-l-2 border-foreground" : ""} ${idx >= 2 ? "border-t-2 md:border-t-0 border-foreground" : ""} ${idx === 4 ? "col-span-2 md:col-span-1 bg-brand/5" : ""}`}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="text-xl md:text-2xl font-bold mt-2">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-2 border-foreground/20 p-5">
            <div className="flex-1 min-w-[200px]">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Accountant</p>
              <p className="text-sm font-semibold mt-1">
                {profile?.accountant_email ? `${profile.accountant_name || ""} <${profile.accountant_email}>` : "Not set"}
              </p>
              {profile?.last_accountant_notified_at && (
                <p className="text-[10px] text-muted-foreground mt-1">Last notified {new Date(profile.last_accountant_notified_at).toLocaleString()}</p>
              )}
            </div>
            <button onClick={() => setShowAccountantModal(true)} className="text-[10px] uppercase tracking-widest border border-foreground/30 px-3 py-2 hover:border-brand hover:text-brand">
              {profile?.accountant_email ? "Edit Contact" : "Set Contact"}
            </button>
            <button onClick={notifyAccountant} className="text-[10px] uppercase tracking-widest bg-brand text-brand-foreground border-2 border-brand px-4 py-2 hover:bg-brand/90">
              Notify Accountant
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-0 border-b-2 border-foreground/20">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-xs uppercase tracking-widest border-b-2 -mb-[2px] ${tab === t ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "Income" && <IncomeTab userId={userId} rows={income} reload={() => loadAll(userId)} onPullInvoices={pullFromInvoices} />}
            {tab === "W-2 Forms" && <W2DocsTab userId={userId} rows={w2Docs} reload={() => loadAll(userId)} />}
            {tab === "Expenses" && <ExpensesTab userId={userId} rows={expenses} reload={() => loadAll(userId)} />}
            {tab === "Mileage" && <MileageTab userId={userId} rows={mileage} reload={() => loadAll(userId)} />}
            {tab === "Reminders" && <RemindersTab userId={userId} rows={reminders} reload={() => loadAll(userId)} />}
            {tab === "Calendar" && <CalendarTab reminders={reminders} invoices={invoices} />}
          </div>
        </div>
      </main>
      <Footer />

      {showAccountantModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6" onClick={() => setShowAccountantModal(false)}>
          <div className="bg-background border-2 border-foreground p-8 max-w-md w-full font-mono" onClick={e => e.stopPropagation()}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Accountant Contact</p>
            <h2 className="text-2xl font-bold mt-2">Who should we notify?</h2>
            <div className="mt-6 space-y-3">
              <input value={accountantName} onChange={e => setAccountantName(e.target.value)} placeholder="Accountant name" className="w-full border-2 border-foreground/20 px-3 py-2 text-sm bg-background" />
              <input value={accountantEmail} onChange={e => setAccountantEmail(e.target.value)} placeholder="accountant@email.com" type="email" className="w-full border-2 border-foreground/20 px-3 py-2 text-sm bg-background" />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowAccountantModal(false)} className="flex-1 text-[10px] uppercase tracking-widest border border-foreground/30 px-3 py-2">Cancel</button>
              <button onClick={async () => { await saveAccountantContact(); setShowAccountantModal(false); }} className="flex-1 text-[10px] uppercase tracking-widest bg-foreground text-background px-3 py-2">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TableShell({ children, header, action }: { children: React.ReactNode; header: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{header}</div>
        {action}
      </div>
      <div className="border-2 border-foreground/20 overflow-x-auto">{children}</div>
    </div>
  );
}

function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return <tr><td colSpan={cols} className="text-center text-xs text-muted-foreground py-10">{text}</td></tr>;
}

function IncomeTab({ userId, rows, reload, onPullInvoices }: { userId: string; rows: IncomeRow[]; reload: () => Promise<void>; onPullInvoices: () => Promise<void> }) {
  const [form, setForm] = useState({ entry_date: todayISO(), source: "", amount: "", notes: "", precision: "day" as "day" | "month", month_value: new Date().toISOString().slice(0, 7) });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.source) return;
    const entry_date = form.precision === "month" ? `${form.month_value}-01` : form.entry_date;
    const { error } = await supabase.from("tax_income_entries").insert({ owner_user_id: userId, entry_date, date_precision: form.precision, source: form.source, amount: parseFloat(form.amount || "0"), notes: form.notes || null } as any);
    if (error) return toast.error(error.message);
    setForm({ entry_date: todayISO(), source: "", amount: "", notes: "", precision: "day", month_value: new Date().toISOString().slice(0, 7) });
    reload();
  };
  const remove = async (id: string) => { await supabase.from("tax_income_entries").delete().eq("id", id); reload(); };
  return (
    <TableShell header={`Business income · ${rows.length} rows`} action={
      <button onClick={onPullInvoices} className="text-[10px] uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:border-brand hover:text-brand">Pull from Invoices</button>
    }>
      <div className="p-3 border-b-2 border-foreground/20 bg-muted/30 space-y-2">
        <div className="flex gap-1 text-[10px] uppercase tracking-widest">
          <button type="button" onClick={() => setForm(s => ({ ...s, precision: "day" }))} className={`px-3 py-1 border ${form.precision === "day" ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-muted-foreground hover:text-foreground"}`}>Exact day</button>
          <button type="button" onClick={() => setForm(s => ({ ...s, precision: "month" }))} className={`px-3 py-1 border ${form.precision === "month" ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-muted-foreground hover:text-foreground"}`}>Month only</button>
        </div>
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-[160px,2fr,1fr,2fr,auto] gap-2">
          {form.precision === "day" ? (
            <input type="date" value={form.entry_date} onChange={e => setForm(s => ({ ...s, entry_date: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          ) : (
            <input type="month" value={form.month_value} onChange={e => setForm(s => ({ ...s, month_value: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          )}
          <input placeholder="Source (client, gig, etc.)" value={form.source} onChange={e => setForm(s => ({ ...s, source: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm(s => ({ ...s, amount: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(s => ({ ...s, notes: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          <button className="bg-foreground text-background px-4 py-1.5 text-[10px] uppercase tracking-widest">Add</button>
        </form>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/20">
          <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2">Date</th><th className="px-3 py-2">Source</th><th className="px-3 py-2 text-right">Amount</th><th className="px-3 py-2">Notes</th><th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow cols={5} text="No income logged yet. Add a row above or pull from invoices." />}
          {rows.map(r => (
            <tr key={r.id} className="border-t border-foreground/10">
              <td className="px-3 py-2 text-muted-foreground">{formatEntryDate(r.entry_date, r.date_precision || "day")}</td>
              <td className="px-3 py-2">{r.source}{r.invoice_id && <span className="ml-2 text-[10px] text-brand uppercase">invoice</span>}</td>
              <td className="px-3 py-2 text-right font-semibold">{fmt(r.amount)}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.notes || "—"}</td>
              <td className="px-3 py-2 text-right"><button onClick={() => remove(r.id)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function W2DocsTab({ userId, rows, reload }: { userId: string; rows: W2DocRow[]; reload: () => Promise<void> }) {
  const [form, setForm] = useState({ year: String(new Date().getFullYear()), employer: "", notes: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Pick a W-2 file first."); return; }
    if (!form.employer.trim()) { toast.error("Employer is required."); return; }
    if (file.size > 15 * 1024 * 1024) { toast.error("File too large (15MB max)."); return; }
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${userId}/${form.year}/${Date.now()}-${safeName}`;
      const up = await supabase.storage.from("w2-forms").upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) throw up.error;
      const { error } = await supabase.from("tax_w2_documents").insert({
        owner_user_id: userId, year: parseInt(form.year), employer: form.employer.trim(),
        file_path: path, file_name: file.name, mime_type: file.type || null, size_bytes: file.size,
        notes: form.notes.trim() || null,
      } as any);
      if (error) throw error;
      toast.success("W-2 uploaded. Your accountant can now download it.");
      setForm({ year: String(new Date().getFullYear()), employer: "", notes: "" });
      setFile(null);
      (document.getElementById("w2-file-input") as HTMLInputElement | null)?.value && ((document.getElementById("w2-file-input") as HTMLInputElement).value = "");
      reload();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const download = async (r: W2DocRow) => {
    const { data, error } = await supabase.storage.from("w2-forms").createSignedUrl(r.file_path, 60);
    if (error || !data) { toast.error(error?.message || "Could not get download link"); return; }
    window.open(data.signedUrl, "_blank");
  };

  const remove = async (r: W2DocRow) => {
    if (!confirm(`Delete W-2 from ${r.employer} (${r.year})?`)) return;
    await supabase.storage.from("w2-forms").remove([r.file_path]);
    await supabase.from("tax_w2_documents").delete().eq("id", r.id);
    reload();
  };

  return (
    <TableShell header={`W-2 forms on file · ${rows.length}`}>
      <form onSubmit={upload} className="p-4 border-b-2 border-foreground/20 bg-muted/30 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Upload your W-2 PDF or image so your accountant can download it directly.</p>
        <div className="grid grid-cols-1 md:grid-cols-[90px,2fr,2fr] gap-2">
          <input placeholder="Year" value={form.year} onChange={e => setForm(s => ({ ...s, year: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Employer" value={form.employer} onChange={e => setForm(s => ({ ...s, employer: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(s => ({ ...s, notes: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input id="w2-file-input" type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
          <button disabled={uploading} className="bg-foreground text-background px-4 py-1.5 text-[10px] uppercase tracking-widest disabled:opacity-50">{uploading ? "Uploading…" : "Upload W-2"}</button>
        </div>
      </form>
      <table className="w-full text-sm">
        <thead className="bg-muted/20">
          <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2">Year</th><th className="px-3 py-2">Employer</th><th className="px-3 py-2">File</th><th className="px-3 py-2">Notes</th><th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow cols={5} text="No W-2 forms uploaded yet." />}
          {rows.map(r => (
            <tr key={r.id} className="border-t border-foreground/10">
              <td className="px-3 py-2 text-muted-foreground">{r.year}</td>
              <td className="px-3 py-2">{r.employer}</td>
              <td className="px-3 py-2 text-muted-foreground truncate max-w-[240px]">{r.file_name}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.notes || "—"}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap">
                <button onClick={() => download(r)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1 hover:border-brand hover:text-brand mr-1">Download</button>
                <button onClick={() => remove(r)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function ExpensesTab({ userId, rows, reload }: { userId: string; rows: ExpenseRow[]; reload: () => Promise<void> }) {
  const [form, setForm] = useState({ entry_date: todayISO(), category: "Equipment", description: "", amount: "", receipt_note: "" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description) return;
    const { error } = await supabase.from("tax_expenses").insert({ owner_user_id: userId, entry_date: form.entry_date, category: form.category, description: form.description, amount: parseFloat(form.amount || "0"), receipt_note: form.receipt_note || null } as any);
    if (error) return toast.error(error.message);
    setForm({ entry_date: todayISO(), category: "Equipment", description: "", amount: "", receipt_note: "" });
    reload();
  };
  const remove = async (id: string) => { await supabase.from("tax_expenses").delete().eq("id", id); reload(); };
  return (
    <TableShell header={`Expenses & write-offs · ${rows.length} rows`}>
      <form onSubmit={add} className="grid grid-cols-2 md:grid-cols-[130px,140px,2fr,1fr,1fr,auto] gap-2 p-3 border-b-2 border-foreground/20 bg-muted/30">
        <input type="date" value={form.entry_date} onChange={e => setForm(s => ({ ...s, entry_date: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <select value={form.category} onChange={e => setForm(s => ({ ...s, category: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm">
          {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="What did you buy?" value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm(s => ({ ...s, amount: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input placeholder="Receipt note" value={form.receipt_note} onChange={e => setForm(s => ({ ...s, receipt_note: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <button className="bg-foreground text-background px-4 py-1.5 text-[10px] uppercase tracking-widest">Add</button>
      </form>
      <table className="w-full text-sm">
        <thead className="bg-muted/20">
          <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2">Date</th><th className="px-3 py-2">Category</th><th className="px-3 py-2">Description</th><th className="px-3 py-2 text-right">Amount</th><th className="px-3 py-2">Receipt</th><th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow cols={6} text="No expenses logged yet." />}
          {rows.map(r => (
            <tr key={r.id} className="border-t border-foreground/10">
              <td className="px-3 py-2 text-muted-foreground">{r.entry_date}</td>
              <td className="px-3 py-2"><span className="text-[10px] uppercase tracking-widest border border-foreground/20 px-2 py-0.5">{r.category}</span></td>
              <td className="px-3 py-2">{r.description}</td>
              <td className="px-3 py-2 text-right font-semibold">{fmt(r.amount)}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.receipt_note || "—"}</td>
              <td className="px-3 py-2 text-right"><button onClick={() => remove(r.id)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function MileageTab({ userId, rows, reload }: { userId: string; rows: MileageRow[]; reload: () => Promise<void> }) {
  const [form, setForm] = useState({ entry_date: todayISO(), purpose: "", miles: "", gas_amount: "", vehicle: "" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.purpose) return;
    const { error } = await supabase.from("tax_mileage_entries").insert({ owner_user_id: userId, entry_date: form.entry_date, purpose: form.purpose, miles: parseFloat(form.miles || "0"), gas_amount: parseFloat(form.gas_amount || "0"), vehicle: form.vehicle || null } as any);
    if (error) return toast.error(error.message);
    setForm({ entry_date: todayISO(), purpose: "", miles: "", gas_amount: "", vehicle: "" });
    reload();
  };
  const remove = async (id: string) => { await supabase.from("tax_mileage_entries").delete().eq("id", id); reload(); };
  const totalMiles = rows.reduce((s, r) => s + Number(r.miles), 0);
  return (
    <TableShell header={`Mileage & gas · ${rows.length} rows · ${totalMiles.toFixed(0)} mi total`}>
      <form onSubmit={add} className="grid grid-cols-2 md:grid-cols-[140px,2fr,1fr,1fr,1fr,auto] gap-2 p-3 border-b-2 border-foreground/20 bg-muted/30">
        <input type="date" value={form.entry_date} onChange={e => setForm(s => ({ ...s, entry_date: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input placeholder="Purpose (client meeting, etc.)" value={form.purpose} onChange={e => setForm(s => ({ ...s, purpose: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input type="number" step="0.1" placeholder="Miles" value={form.miles} onChange={e => setForm(s => ({ ...s, miles: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input type="number" step="0.01" placeholder="Gas $" value={form.gas_amount} onChange={e => setForm(s => ({ ...s, gas_amount: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input placeholder="Vehicle" value={form.vehicle} onChange={e => setForm(s => ({ ...s, vehicle: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <button className="bg-foreground text-background px-4 py-1.5 text-[10px] uppercase tracking-widest">Add</button>
      </form>
      <table className="w-full text-sm">
        <thead className="bg-muted/20">
          <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2">Date</th><th className="px-3 py-2">Purpose</th><th className="px-3 py-2 text-right">Miles</th><th className="px-3 py-2 text-right">Gas</th><th className="px-3 py-2">Vehicle</th><th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow cols={6} text="No mileage logged yet." />}
          {rows.map(r => (
            <tr key={r.id} className="border-t border-foreground/10">
              <td className="px-3 py-2 text-muted-foreground">{r.entry_date}</td>
              <td className="px-3 py-2">{r.purpose}</td>
              <td className="px-3 py-2 text-right font-semibold">{Number(r.miles).toFixed(1)}</td>
              <td className="px-3 py-2 text-right">{fmt(r.gas_amount)}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.vehicle || "—"}</td>
              <td className="px-3 py-2 text-right"><button onClick={() => remove(r.id)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function RemindersTab({ userId, rows, reload }: { userId: string; rows: ReminderRow[]; reload: () => Promise<void> }) {
  const [form, setForm] = useState({ title: "", amount: "", due_date: "", notes: "" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    const { error } = await supabase.from("tax_reminders").insert({ owner_user_id: userId, title: form.title, amount: parseFloat(form.amount || "0"), due_date: form.due_date || null, notes: form.notes || null } as any);
    if (error) return toast.error(error.message);
    setForm({ title: "", amount: "", due_date: "", notes: "" });
    reload();
  };
  const togglePaid = async (r: ReminderRow) => { await supabase.from("tax_reminders").update({ paid: !r.paid } as any).eq("id", r.id); reload(); };
  const remove = async (id: string) => { await supabase.from("tax_reminders").delete().eq("id", id); reload(); };
  return (
    <TableShell header={`Tax reminders · ${rows.length}`}>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-[2fr,1fr,150px,2fr,auto] gap-2 p-3 border-b-2 border-foreground/20 bg-muted/30">
        <input placeholder="e.g. Q3 federal estimate" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm(s => ({ ...s, amount: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input type="date" value={form.due_date} onChange={e => setForm(s => ({ ...s, due_date: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <input placeholder="Notes" value={form.notes} onChange={e => setForm(s => ({ ...s, notes: e.target.value }))} className="border border-foreground/15 bg-background px-2 py-1.5 text-sm" />
        <button className="bg-foreground text-background px-4 py-1.5 text-[10px] uppercase tracking-widest">Add</button>
      </form>
      <div className="divide-y divide-foreground/10">
        {rows.length === 0 && <p className="p-10 text-center text-xs text-muted-foreground">No reminders yet.</p>}
        {rows.map(r => (
          <div key={r.id} className={`p-4 flex items-center justify-between ${r.paid ? "opacity-50" : ""}`}>
            <div>
              <p className={`text-sm font-semibold ${r.paid ? "line-through" : ""}`}>{r.title}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{r.due_date || "no due date"} · {fmt(r.amount)}{r.notes ? ` · ${r.notes}` : ""}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => togglePaid(r)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:border-brand hover:text-brand">{r.paid ? "Unpaid" : "Paid"}</button>
              <button onClick={() => remove(r.id)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:border-destructive hover:text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </TableShell>
  );
}

function CalendarTab({ reminders, invoices }: { reminders: ReminderRow[]; invoices: InvoiceRow[] }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState<string | null>(null);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  type Event = { type: "reminder" | "invoice_due" | "invoice_paid"; label: string; amount: number };
  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    const push = (date: string, ev: Event) => { (map[date] ||= []).push(ev); };
    reminders.forEach(r => { if (r.due_date) push(r.due_date, { type: "reminder", label: r.title, amount: Number(r.amount) }); });
    invoices.forEach(i => {
      if (i.due_date && i.status !== "paid") push(i.due_date, { type: "invoice_due", label: i.service, amount: Number(i.price) });
      if (i.paid_at) push(i.paid_at.slice(0, 10), { type: "invoice_paid", label: i.service, amount: Number(i.price) });
    });
    return map;
  }, [reminders, invoices]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayIso = todayISO();
  const selectedEvents = selected ? eventsByDate[selected] || [] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Tax calendar</div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="text-[10px] uppercase tracking-widest border border-foreground/30 px-2 py-1">←</button>
          <span className="text-sm font-semibold w-44 text-center">{monthLabel}</span>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="text-[10px] uppercase tracking-widest border border-foreground/30 px-2 py-1">→</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
        <div className="border-2 border-foreground/20">
          <div className="grid grid-cols-7 text-[10px] uppercase tracking-widest text-muted-foreground border-b-2 border-foreground/20">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="px-2 py-2 text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((d, idx) => {
              if (d === null) return <div key={idx} className="border-t border-l border-foreground/10 min-h-[80px] bg-muted/10" />;
              const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const evs = eventsByDate[iso] || [];
              const isToday = iso === todayIso;
              const isSelected = iso === selected;
              return (
                <button key={idx} onClick={() => setSelected(iso)} className={`border-t border-l border-foreground/10 min-h-[80px] p-2 text-left hover:bg-brand/5 ${isSelected ? "bg-brand/10" : ""} ${isToday ? "ring-2 ring-brand ring-inset" : ""}`}>
                  <div className="text-xs font-semibold">{d}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {evs.slice(0, 3).map((e, i) => (
                      <span key={i} className={`inline-block w-2 h-2 rounded-full ${e.type === "reminder" ? "bg-brand" : e.type === "invoice_paid" ? "bg-foreground" : "border border-foreground"}`} />
                    ))}
                    {evs.length > 3 && <span className="text-[9px] text-muted-foreground">+{evs.length - 3}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 p-3 border-t-2 border-foreground/20 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand" />Reminder</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-foreground" />Invoice Paid</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-foreground" />Invoice Due</span>
          </div>
        </div>

        <div className="border-2 border-foreground/20 p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{selected || "Select a day"}</p>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">{selected ? "Nothing scheduled." : "Click any day to see what's on it."}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {selectedEvents.map((e, i) => (
                <li key={i} className="border border-foreground/15 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-brand">{e.type.replace("_", " ")}</p>
                  <p className="text-sm font-semibold mt-1">{e.label}</p>
                  <p className="text-xs text-muted-foreground">{fmt(e.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
