import { useEffect, useState, useCallback } from "react";
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

interface Bill { id: string; company_name: string; price: number; notes: string | null; created_at: string; }
interface IncomeClient { id: string; company_name: string; owner_name: string | null; email: string; maintenance_plan: string | null; }

const BillsTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomeClients, setIncomeClients] = useState<IncomeClient[]>([]);
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      const [b, c] = await Promise.all([
        api("get_bills"),
        api("get_maintenance_income"),
      ]);
      setBills((b as { bills: Bill[] }).bills || []);
      setIncomeClients((c as { clients: IncomeClient[] }).clients || []);
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

  const totalBills = bills.reduce((s, b) => s + Number(b.price || 0), 0);

  const incomeRows = incomeClients
    .map((c) => {
      const plan = c.maintenance_plan || "";
      const amount = PLAN_PRICES[plan] || 0;
      const [cat, name] = plan.split(":");
      return { ...c, planLabel: PLAN_LABELS[cat] ? `${PLAN_LABELS[cat]} — ${name}` : plan, amount };
    })
    .filter((r) => r.amount > 0);

  const totalIncome = incomeRows.reduce((s, r) => s + r.amount, 0);
  const net = totalIncome - totalBills;
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3">Bills Tracker</h1>
            <p className="text-sm text-muted-foreground mt-2">Monthly outflow vs. maintenance plan income.</p>
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="border-2 border-foreground p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold mt-2">{fmt(totalIncome)}</p>
              <p className="text-xs text-muted-foreground mt-1">{incomeRows.length} client{incomeRows.length === 1 ? "" : "s"}</p>
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

          {/* Add/Edit Bill */}
          <div className="border-2 border-foreground p-6 mb-12">
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
            <h2 className="text-lg font-bold tracking-tight mb-2">Maintenance Income</h2>
            <p className="text-xs text-muted-foreground mb-4">Auto-pulled from clients with a selected maintenance plan.</p>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : incomeRows.length === 0 ? (
              <p className="text-sm text-muted-foreground border-2 border-dashed border-border p-6">No clients on a maintenance plan yet.</p>
            ) : (
              <div className="border-2 border-foreground divide-y-2 divide-foreground">
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
                <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-4 bg-foreground text-background">
                  <p className="font-bold text-sm uppercase tracking-widest">Total Income</p>
                  <div />
                  <p className="font-bold text-sm">{fmt(totalIncome)}</p>
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