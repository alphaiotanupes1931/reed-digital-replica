import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Mirror of MAINTENANCE_PLAN_CATALOG in InvoicePortal — keep prices in sync.
const PLAN_PRICES: Record<string, number> = {
  "cms:Standard": 200, "cms:Growth": 300, "cms:Pro": 400, "cms:Elite": 500,
  "smb:Standard": 100, "smb:Growth": 200, "smb:Pro": 300,
  "landing:Standard": 50, "landing:Growth": 100,
};

const PLAN_LABELS: Record<string, string> = {
  cms: "Brochure + CMS", smb: "Small Business", landing: "Landing Page",
};

interface Bill { id: string; company_name: string; price: number; notes: string | null; created_at: string; hidden: boolean; }
interface IncomeClient { id: string; company_name: string; owner_name: string | null; email: string; maintenance_plan: string | null; }
interface ExtraIncome { id: string; source: string; price: number; notes: string | null; created_at: string; category: string; }
interface TaxReminder { id: string; title: string; amount: number; due_date: string | null; notes: string | null; paid: boolean; created_at: string; }

const BillsTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomeClients, setIncomeClients] = useState<IncomeClient[]>([]);
  const [extraIncome, setExtraIncome] = useState<ExtraIncome[]>([]);
  const [taxReminders, setTaxReminders] = useState<TaxReminder[]>([]);
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [extraSource, setExtraSource] = useState("");
  const [extraPrice, setExtraPrice] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const extraFormRef = useRef<HTMLDivElement | null>(null);
  const [w2Source, setW2Source] = useState("");
  const [w2Price, setW2Price] = useState("");
  const [w2Notes, setW2Notes] = useState("");
  const [editingW2Id, setEditingW2Id] = useState<string | null>(null);
  const w2FormRef = useRef<HTMLDivElement | null>(null);
  const [taxTitle, setTaxTitle] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [taxDueDate, setTaxDueDate] = useState("");
  const [taxNotes, setTaxNotes] = useState("");
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);
  const taxFormRef = useRef<HTMLDivElement | null>(null);
  const [includeW2, setIncludeW2] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("rdg-include-w2") === "true";
  });
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("rdg-include-maintenance") !== "false";
  });
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [goalAmount, setGoalAmount] = useState<number>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("rdg-retainer-goal") : null;
    const parsed = saved ? parseFloat(saved) : NaN;
    return !isNaN(parsed) && parsed > 0 ? parsed : 6300;
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("ho-token")) navigate("/home-office/login");
  }, [navigate]);

  const api = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const token = sessionStorage.getItem("ho-token");
    const res = await supabase.functions.invoke("home-office-auth", {
      body: { action, token, ...payload },
    });
    if (res.error) throw res.error;
    const errMsg = (res.data as { error?: string } | null)?.error;
    if (errMsg) throw new Error(errMsg);
    return res.data;
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [b, c, e, t] = await Promise.all([
        api("get_bills"),
        api("get_maintenance_income"),
        api("get_extra_income"),
        api("get_tax_reminders"),
      ]);
      setBills((b as { bills: Bill[] }).bills || []);
      setIncomeClients((c as { clients: IncomeClient[] }).clients || []);
      setExtraIncome((e as { items: ExtraIncome[] }).items || []);
      setTaxReminders((t as { items: TaxReminder[] }).items || []);
    } catch (err: any) {
      toast({ title: "Error loading data", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [api, toast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !price) return;
    try {
      if (editingId) {
        await api("update_bill", { id: editingId, company_name: company.trim(), price, notes: notes.trim() || null });
        toast({ title: "Bill updated" });
      } else {
        await api("add_bill", { company_name: company.trim(), price, notes: notes.trim() || null });
        toast({ title: "Bill added" });
      }
      setCompany(""); setPrice(""); setNotes(""); setEditingId(null);
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (b: Bill) => {
    setEditingId(b.id);
    setCompany(b.company_name);
    setPrice(String(b.price));
    setNotes(b.notes || "");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCompany(""); setPrice(""); setNotes("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bill?")) return;
    try {
      await api("delete_bill", { id });
      toast({ title: "Bill deleted" });
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const totalBills = bills.filter((b) => !b.hidden).reduce((s, b) => s + Number(b.price || 0), 0);

  const incomeRows = incomeClients
    .map((c) => {
      const plan = c.maintenance_plan || "";
      let amount = PLAN_PRICES[plan] || 0;
      let planLabel = plan;
      if (plan.startsWith("custom:")) {
        const m = plan.slice(7).match(/^(.*)\|(\d+(?:\.\d+)?)$/);
        if (m) {
          amount = parseFloat(m[2]);
          planLabel = `Custom — ${m[1]}`;
        }
      } else {
        const [cat, name] = plan.split(":");
        if (PLAN_LABELS[cat]) planLabel = `${PLAN_LABELS[cat]} — ${name}`;
      }
      return { ...c, planLabel, amount };
    })
    .filter((r) => r.amount > 0);

  const totalIncome = incomeRows.reduce((s, r) => s + r.amount, 0);
  const extraRows = extraIncome.filter((r) => r.category !== "w2");
  const w2Rows = extraIncome.filter((r) => r.category === "w2");
  const totalExtra = extraRows.reduce((s, r) => s + Number(r.price || 0), 0);
  const totalW2 = w2Rows.reduce((s, r) => s + Number(r.price || 0), 0);
  const retainerIncome = totalIncome + totalExtra;
  const grandIncome = (includeMaintenance ? totalIncome : 0) + totalExtra + (includeW2 ? totalW2 : 0);
  const net = grandIncome - totalBills;
  const sixFigGap = goalAmount - retainerIncome;
  const sixFigPct = Math.min(100, Math.max(0, (retainerIncome / goalAmount) * 100));
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const toggleW2 = () => {
    const next = !includeW2;
    setIncludeW2(next);
    localStorage.setItem("rdg-include-w2", String(next));
  };
  const toggleMaintenance = () => {
    const next = !includeMaintenance;
    setIncludeMaintenance(next);
    localStorage.setItem("rdg-include-maintenance", String(next));
  };

  const handleExtraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraSource.trim() || !extraPrice) return;
    try {
      if (editingExtraId) {
        await api("update_extra_income", { id: editingExtraId, source: extraSource.trim(), price: extraPrice, notes: extraNotes.trim() || null, category: "extra" });
        toast({ title: "Income updated" });
      } else {
        await api("add_extra_income", { source: extraSource.trim(), price: extraPrice, notes: extraNotes.trim() || null, category: "extra" });
        toast({ title: "Income added" });
      }
      setExtraSource(""); setExtraPrice(""); setExtraNotes(""); setEditingExtraId(null);
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleW2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!w2Source.trim() || !w2Price) return;
    try {
      if (editingW2Id) {
        await api("update_extra_income", { id: editingW2Id, source: w2Source.trim(), price: w2Price, notes: w2Notes.trim() || null, category: "w2" });
        toast({ title: "W2 income updated" });
      } else {
        await api("add_extra_income", { source: w2Source.trim(), price: w2Price, notes: w2Notes.trim() || null, category: "w2" });
        toast({ title: "W2 income added" });
      }
      setW2Source(""); setW2Price(""); setW2Notes(""); setEditingW2Id(null);
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEditW2 = (r: ExtraIncome) => {
    setEditingW2Id(r.id);
    setW2Source(r.source);
    setW2Price(String(r.price));
    setW2Notes(r.notes || "");
    setTimeout(() => { w2FormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0);
  };

  const cancelEditW2 = () => {
    setEditingW2Id(null);
    setW2Source(""); setW2Price(""); setW2Notes("");
  };

  const handleDeleteW2 = async (id: string) => {
    if (!confirm("Delete this W2 income block?")) return;
    try {
      await api("delete_extra_income", { id });
      toast({ title: "W2 income deleted" });
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEditExtra = (r: ExtraIncome) => {
    setEditingExtraId(r.id);
    setExtraSource(r.source);
    setExtraPrice(String(r.price));
    setExtraNotes(r.notes || "");
    setTimeout(() => { extraFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0);
  };

  const cancelEditExtra = () => {
    setEditingExtraId(null);
    setExtraSource(""); setExtraPrice(""); setExtraNotes("");
  };

  const handleDeleteExtra = async (id: string) => {
    if (!confirm("Delete this income block?")) return;
    try {
      await api("delete_extra_income", { id });
      toast({ title: "Income deleted" });
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxTitle.trim()) return;
    try {
      const payload = {
        title: taxTitle.trim(),
        amount: taxAmount || 0,
        due_date: taxDueDate || null,
        notes: taxNotes.trim() || null,
      };
      if (editingTaxId) {
        await api("update_tax_reminder", { id: editingTaxId, ...payload });
        toast({ title: "Tax reminder updated" });
      } else {
        await api("add_tax_reminder", payload);
        toast({ title: "Tax reminder added" });
      }
      setTaxTitle(""); setTaxAmount(""); setTaxDueDate(""); setTaxNotes(""); setEditingTaxId(null);
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const startEditTax = (r: TaxReminder) => {
    setEditingTaxId(r.id);
    setTaxTitle(r.title);
    setTaxAmount(String(r.amount));
    setTaxDueDate(r.due_date || "");
    setTaxNotes(r.notes || "");
    setTimeout(() => { taxFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0);
  };

  const cancelEditTax = () => {
    setEditingTaxId(null);
    setTaxTitle(""); setTaxAmount(""); setTaxDueDate(""); setTaxNotes("");
  };

  const handleDeleteTax = async (id: string) => {
    if (!confirm("Delete this tax reminder?")) return;
    try {
      await api("delete_tax_reminder", { id });
      toast({ title: "Tax reminder deleted" });
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const togglePaidTax = async (r: TaxReminder) => {
    try {
      await api("update_tax_reminder", { id: r.id, paid: !r.paid });
      await fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const totalTaxDue = taxReminders.filter((r) => !r.paid).reduce((s, r) => s + Number(r.amount || 0), 0);
  const fmtDate = (d: string | null) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, day || 1);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const daysUntil = (d: string | null) => {
    if (!d) return null;
    const [y, m, day] = d.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, day || 1);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((dt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const saveGoal = () => {
    const n = parseFloat(goalDraft.replace(/[$,\s]/g, ""));
    if (isNaN(n) || n <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setGoalAmount(n);
    localStorage.setItem("rdg-retainer-goal", String(n));
    setEditingGoal(false);
    toast({ title: "Goal updated", description: `New monthly target: ${fmt(n)}` });
  };

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[20vw] font-bold text-foreground/[0.03] uppercase tracking-widest select-none">RDG</span>
      </div>
      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link to="/home-office" className="text-xs text-muted-foreground hover:text-brand uppercase tracking-widest">← Home Office</Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3">Bills</h1>
            <p className="text-sm text-muted-foreground mt-2">Monthly outflow vs. maintenance plan income.</p>
          </motion.div>

          {/* Summary */}
          <div className="border-2 border-brand bg-brand/5 p-6 mb-4">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Combined Annual Income</p>
              <Button
                type="button"
                variant={includeMaintenance ? "default" : "outline"}
                size="sm"
                onClick={toggleMaintenance}
              >
                {includeMaintenance ? "Including Maintenance" : "Exclude Maintenance"}
              </Button>
            </div>
            <p className="text-4xl font-bold mt-2 text-brand">{fmt(grandIncome * 12)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {fmt(grandIncome)}/mo × 12 — {includeMaintenance ? "maintenance" : ""}
              {includeMaintenance && totalExtra > 0 ? " + " : ""}
              {totalExtra > 0 ? "manual" : ""}
              {includeW2 ? " + W2 take-home" : ""}
              {totalW2 > 0 && <> · Take-home salary: <span className="font-bold text-foreground">{fmt(totalW2)}/mo</span> ({fmt(totalW2 * 12)}/yr)</>}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="border-2 border-foreground p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold mt-2">{fmt(grandIncome)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {incomeRows.length} client{incomeRows.length === 1 ? "" : "s"}
                {extraRows.length > 0 && ` + ${extraRows.length} manual`}
              </p>
            </div>
            <div className="border-2 border-foreground p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Monthly Bills</p>
              <p className="text-2xl font-bold mt-2">{fmt(totalBills)}</p>
              <p className="text-xs text-muted-foreground mt-1">{bills.length} bill{bills.length === 1 ? "" : "s"}</p>
            </div>
            <div className={`border-2 p-6 ${net >= 0 ? "border-brand bg-brand/5" : "border-destructive bg-destructive/5"}`}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {net >= 0 ? "Surplus" : "Shortfall"}
              </p>
              <p className={`text-2xl font-bold mt-2 ${net >= 0 ? "text-brand" : "text-destructive"}`}>
                {net >= 0 ? fmt(net) : `-${fmt(Math.abs(net))}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {net >= 0 ? "Income covers bills." : `Need ${fmt(Math.abs(net))} more / mo to break even.`}
              </p>
            </div>
          </div>

          {/* Six Figures Goal */}
          <div className={`border-2 p-6 mb-12 ${sixFigGap <= 0 ? "border-brand bg-brand/5" : "border-foreground"}`}>
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Monthly Retainer Goal</p>
                  {!editingGoal && (
                    <button
                      onClick={() => { setGoalDraft(String(goalAmount)); setEditingGoal(true); }}
                      className="text-[10px] uppercase tracking-[0.2em] text-brand hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editingGoal ? (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={goalDraft}
                      onChange={(e) => setGoalDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveGoal(); if (e.key === "Escape") setEditingGoal(false); }}
                      autoFocus
                      className="h-9 w-32"
                    />
                    <span className="text-xs text-muted-foreground">/ mo</span>
                    <Button size="sm" onClick={saveGoal}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingGoal(false)}>Cancel</Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: {fmt(goalAmount)} / mo · {fmt(goalAmount * 12)} / yr
                  </p>
                )}
              </div>
              <div className="text-right">
                {sixFigGap <= 0 ? (
                  <>
                    <p className="text-2xl font-bold text-brand">Goal Hit ✓</p>
                    <p className="text-xs text-muted-foreground mt-1">{fmt(Math.abs(sixFigGap))} / mo over target.</p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Still need</p>
                    <p className="text-2xl font-bold">{fmt(sixFigGap)}<span className="text-sm text-muted-foreground"> / mo</span></p>
                  </>
                )}
              </div>
            </div>
            <div className="h-2 w-full bg-foreground/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-brand transition-all duration-500"
                style={{ width: `${sixFigPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {fmt(retainerIncome)} of {fmt(goalAmount)} (retainers only)
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {sixFigPct.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Add/Edit Bill */}
          <div
            ref={formRef}
            className={`border-2 p-6 mb-12 transition-colors ${
              editingId ? "border-brand bg-brand/5" : "border-foreground"
            }`}
          >
            <h2 className="text-lg font-bold tracking-tight mb-4">
              {editingId ? "Edit Bill" : "Add a Monthly Bill"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_auto] gap-3 items-start">
              <Input placeholder="Company (e.g. Adobe)" value={company} onChange={(e) => setCompany(e.target.value)} required />
              <Input type="number" step="0.01" min="0" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Save" : "Add"}</Button>
                {editingId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
              </div>
            </form>
          </div>

          {/* Bills list */}
          <div className="mb-12">
            <h2 className="text-lg font-bold tracking-tight mb-4">Bills</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : bills.length === 0 ? (
              <p className="text-sm text-muted-foreground border-2 border-dashed border-border p-6">No bills yet.</p>
            ) : (
              <div className="border-2 border-foreground divide-y-2 divide-foreground">
                {bills.map((b) => (
                  <div key={b.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4">
                    <div>
                      <p className="font-bold text-sm">{b.company_name}</p>
                      {b.notes && <p className="text-xs text-muted-foreground mt-1">{b.notes}</p>}
                    </div>
                    <p className="font-bold text-sm">{fmt(Number(b.price))}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(b)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(b.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 bg-foreground text-background">
                  <p className="font-bold text-sm uppercase tracking-widest">Total</p>
                  <p className="font-bold text-sm">{fmt(totalBills)}</p>
                  <div />
                </div>
              </div>
            )}
          </div>

          {/* Income */}
          <div>
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
              <h2 className="text-lg font-bold tracking-tight">Maintenance Income</h2>
              <Button
                type="button"
                variant={includeMaintenance ? "default" : "outline"}
                size="sm"
                onClick={toggleMaintenance}
              >
                {includeMaintenance ? "Including in Totals" : "Exclude from Totals"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Auto-pulled from clients with a selected maintenance plan, plus any manual entries you add below. Toggle above to include or exclude from your combined income.</p>

            <div
              ref={extraFormRef}
              className={`border-2 p-6 mb-6 transition-colors ${editingExtraId ? "border-brand bg-brand/5" : "border-foreground"}`}
            >
              <h3 className="text-sm font-bold tracking-tight mb-4 uppercase">
                {editingExtraId ? "Edit Maintenance Entry" : "Add Maintenance Income"}
              </h3>
              <form onSubmit={handleExtraSubmit} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_auto] gap-3 items-start">
                <Input placeholder="Source / Client" value={extraSource} onChange={(e) => setExtraSource(e.target.value)} required />
                <Input type="number" step="0.01" min="0" placeholder="Monthly $" value={extraPrice} onChange={(e) => setExtraPrice(e.target.value)} required />
                <Input placeholder="Notes (optional)" value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="submit">{editingExtraId ? "Save" : "Add"}</Button>
                  {editingExtraId && <Button type="button" variant="outline" onClick={cancelEditExtra}>Cancel</Button>}
                </div>
              </form>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : incomeRows.length === 0 && extraRows.length === 0 ? (
              <p className="text-sm text-muted-foreground border-2 border-dashed border-border p-6">No maintenance income yet.</p>
            ) : (
              <div className={`border-2 divide-y-2 divide-foreground ${includeMaintenance ? "border-foreground" : "border-foreground/30 opacity-70"}`}>
                {incomeRows.map((r) => (
                  <div key={r.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-4">
                    <div>
                      <p className="font-bold text-sm">{r.company_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.owner_name || r.email}</p>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{r.planLabel}</p>
                    <p className="font-bold text-sm text-brand">{fmt(r.amount)}</p>
                  </div>
                ))}
                {extraRows.map((r) => (
                  <div key={r.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center p-4">
                    <div>
                      <p className="font-bold text-sm">{r.source}</p>
                      {r.notes && <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>}
                    </div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Manual</p>
                    <p className="font-bold text-sm text-brand">{fmt(Number(r.price))}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditExtra(r)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteExtra(r.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-4 bg-foreground text-background">
                  <p className="font-bold text-sm uppercase tracking-widest">
                    Total Income {includeMaintenance ? "" : "(excluded)"}
                  </p>
                  <div />
                  <p className="font-bold text-sm">{fmt(totalIncome + totalExtra)}</p>
                </div>
              </div>
            )}
          </div>

          {/* W2 Income */}
          <div className="mt-12">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
              <h2 className="text-lg font-bold tracking-tight">W2 Income</h2>
              <Button
                type="button"
                variant={includeW2 ? "default" : "outline"}
                size="sm"
                onClick={toggleW2}
              >
                {includeW2 ? "Including W2 in Totals" : "Exclude from Totals"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Add W2 paychecks here. <span className="font-bold text-foreground">Only enter your take-home pay</span> (after taxes, insurance, and other deductions) — not gross. Toggle the button above to include or exclude this income from your monthly totals and goal progress.
            </p>

            <div
              ref={w2FormRef}
              className={`border-2 p-6 mb-6 transition-colors ${editingW2Id ? "border-brand bg-brand/5" : "border-foreground"}`}
            >
              <h3 className="text-sm font-bold tracking-tight mb-4 uppercase">
                {editingW2Id ? "Edit W2 Block" : "Add a W2 Block"}
              </h3>
              <form onSubmit={handleW2Submit} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_auto] gap-3 items-start">
                <Input placeholder="Employer (e.g. Acme Corp)" value={w2Source} onChange={(e) => setW2Source(e.target.value)} required />
                <Input type="number" step="0.01" min="0" placeholder="Monthly take-home $" value={w2Price} onChange={(e) => setW2Price(e.target.value)} required />
                <Input placeholder="Notes (optional)" value={w2Notes} onChange={(e) => setW2Notes(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="submit">{editingW2Id ? "Save" : "Add"}</Button>
                  {editingW2Id && <Button type="button" variant="outline" onClick={cancelEditW2}>Cancel</Button>}
                </div>
              </form>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : w2Rows.length === 0 ? (
              <p className="text-sm text-muted-foreground border-2 border-dashed border-border p-6">No W2 income yet.</p>
            ) : (
              <div className={`border-2 divide-y-2 divide-foreground ${includeW2 ? "border-foreground" : "border-foreground/30 opacity-70"}`}>
                {w2Rows.map((r) => (
                  <div key={r.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4">
                    <div>
                      <p className="font-bold text-sm">{r.source}</p>
                      {r.notes && <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>}
                    </div>
                    <p className="font-bold text-sm text-brand">{fmt(Number(r.price))}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditW2(r)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteW2(r.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 bg-foreground text-background">
                  <p className="font-bold text-sm uppercase tracking-widest">
                    Total W2 {includeW2 ? "(included)" : "(excluded)"}
                  </p>
                  <p className="font-bold text-sm">{fmt(totalW2)}</p>
                  <div />
                </div>
              </div>
            )}
          </div>

          {/* Tax Reminders */}
          <div className="mt-12">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
              <h2 className="text-lg font-bold tracking-tight">Tax Reminders</h2>
              <p className="text-sm font-bold">
                Outstanding: <span className="text-brand">{fmt(totalTaxDue)}</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Track quarterly estimates, sales tax, and any tax payments coming up.
            </p>

            <div
              ref={taxFormRef}
              className={`border-2 p-6 mb-6 transition-colors ${editingTaxId ? "border-brand bg-brand/5" : "border-foreground"}`}
            >
              <h3 className="text-sm font-bold tracking-tight mb-4 uppercase">
                {editingTaxId ? "Edit Tax Reminder" : "Add a Tax Reminder"}
              </h3>
              <form onSubmit={handleTaxSubmit} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_2fr_auto] gap-3 items-start">
                <Input placeholder="Title (e.g. Q1 Estimated Tax)" value={taxTitle} onChange={(e) => setTaxTitle(e.target.value)} required />
                <Input type="number" step="0.01" min="0" placeholder="Amount" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} />
                <Input type="date" value={taxDueDate} onChange={(e) => setTaxDueDate(e.target.value)} />
                <Input placeholder="Notes (optional)" value={taxNotes} onChange={(e) => setTaxNotes(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="submit">{editingTaxId ? "Save" : "Add"}</Button>
                  {editingTaxId && <Button type="button" variant="outline" onClick={cancelEditTax}>Cancel</Button>}
                </div>
              </form>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : taxReminders.length === 0 ? (
              <p className="text-sm text-muted-foreground border-2 border-dashed border-border p-6">No tax reminders yet.</p>
            ) : (
              <div className="border-2 border-foreground divide-y-2 divide-foreground">
                {taxReminders.map((r) => {
                  const d = daysUntil(r.due_date);
                  let dueLabel = fmtDate(r.due_date);
                  let dueClass = "text-muted-foreground";
                  if (!r.paid && d !== null) {
                    if (d < 0) { dueLabel += ` · ${Math.abs(d)}d overdue`; dueClass = "text-destructive"; }
                    else if (d === 0) { dueLabel += " · due today"; dueClass = "text-destructive"; }
                    else if (d <= 14) { dueLabel += ` · in ${d}d`; dueClass = "text-brand"; }
                    else { dueLabel += ` · in ${d}d`; }
                  }
                  return (
                    <div key={r.id} className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-4 ${r.paid ? "opacity-50" : ""}`}>
                      <div>
                        <p className={`font-bold text-sm ${r.paid ? "line-through" : ""}`}>{r.title}</p>
                        <p className={`text-xs mt-1 uppercase tracking-widest ${dueClass}`}>{dueLabel}</p>
                        {r.notes && <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>}
                      </div>
                      <p className="font-bold text-sm">{fmt(Number(r.amount))}</p>
                      <Button size="sm" variant={r.paid ? "outline" : "default"} onClick={() => togglePaidTax(r)}>
                        {r.paid ? "Mark Unpaid" : "Mark Paid"}
                      </Button>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditTax(r)}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteTax(r.id)}>Delete</Button>
                      </div>
                    </div>
                  );
                })}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-4 bg-foreground text-background">
                  <p className="font-bold text-sm uppercase tracking-widest">Total Outstanding</p>
                  <p className="font-bold text-sm">{fmt(totalTaxDue)}</p>
                  <div />
                  <div />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillsTracker;