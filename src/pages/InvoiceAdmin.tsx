import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lock, ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/rdg-header-logo.png";

const ADMIN_PASSWORD = "shell0423";
const PROCESSING_FEE_RATE = 0.029;
const PROCESSING_FEE_FLAT = 0.30;

const SERVICE_OPTIONS = ["Website Development", "App Development"];

const PHASE_STATUS_OPTIONS = ["pending", "in_progress", "complete"] as const;
type PhaseStatus = typeof PHASE_STATUS_OPTIONS[number];

interface Phase {
  name: string;
  status: PhaseStatus;
}

interface SowComment {
  author: "client" | "admin";
  message: string;
  created_at: string;
}

interface Client {
  id: string;
  company_name: string;
  email: string;
  owner_name: string | null;
  scope_of_work: string | null;
  phases: Phase[] | null;
  sow_status: "pending" | "approved" | "rejected" | string;
  sow_comments: SowComment[] | null;
  project_type: string | null;
  project_build_cost: string | null;
  project_maintenance_cost: string | null;
  project_estimated_total: string | null;
  created_at: string;
}

interface Deliverable {
  label: string;
  url: string;
}

interface Invoice {
  id: string;
  client_id: string;
  service: string;
  price: number;
  due_date: string;
  status: "draft" | "approved" | "sent" | "paid";
  deposit_required: boolean;
  deposit_amount: number | null;
  deposit_due_date: string | null;
  deposit_paid: boolean;
  created_at: string;
  message: string | null;
  deliverables: Deliverable[] | null;
  clients?: Client;
}

const DEFAULT_PHASES: Phase[] = [
  { name: "Discovery", status: "pending" },
  { name: "Design", status: "pending" },
  { name: "Development", status: "pending" },
  { name: "Launch", status: "pending" },
];

const AdminSubtext = () => {
  const { displayed, done } = useTypingEffect("Enter password to continue", 35, 800);
  return (
    <p className="text-lg font-mono text-foreground mb-12 text-center h-7">
      {displayed}
      {!done && <span className="typing-cursor">|</span>}
    </p>
  );
};

const calculateFee = (amount: number) =>
  Math.round((amount * PROCESSING_FEE_RATE + PROCESSING_FEE_FLAT) * 100) / 100;
const calculateTotal = (amount: number) =>
  Math.round((amount + calculateFee(amount)) * 100) / 100;

const InvoiceAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Selected client for SOW/Invoice management
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Create-client form
  const [showClientForm, setShowClientForm] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // SOW editing
  const [sowText, setSowText] = useState("");
  const [phases, setPhases] = useState<Phase[]>(DEFAULT_PHASES);
  const [projectType, setProjectType] = useState("");
  const [projectBuildCost, setProjectBuildCost] = useState("");
  const [projectMaintenanceCost, setProjectMaintenanceCost] = useState("");
  const [projectEstimatedTotal, setProjectEstimatedTotal] = useState("");

  // Invoice creation (per-client)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDueDate, setDepositDueDate] = useState("");
  const [message, setMessage] = useState("");

  // Deliverables
  const [editingDeliverables, setEditingDeliverables] = useState<string | null>(null);
  const [newDelLabel, setNewDelLabel] = useState("");
  const [newDelUrl, setNewDelUrl] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Authenticated" });
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, clRes] = await Promise.all([
        supabase.functions.invoke("invoice-admin", {
          body: { action: "list_invoices", password: ADMIN_PASSWORD },
        }),
        supabase.functions.invoke("invoice-admin", {
          body: { action: "list_clients", password: ADMIN_PASSWORD },
        }),
      ]);
      if (invRes.error) throw invRes.error;
      if (clRes.error) throw clRes.error;
      if (invRes.data?.invoices) setInvoices(invRes.data.invoices as Invoice[]);
      if (clRes.data?.clients) setClients(clRes.data.clients as Client[]);
    } catch (err: any) {
      toast({ title: "Error loading data", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleSyncPayments().then(() => fetchData());
    }
  }, [isAuthenticated]);

  // Load SOW into form when client selected
  useEffect(() => {
    if (selectedClientId) {
      const c = clients.find((x) => x.id === selectedClientId);
      if (c) {
        setSowText(c.scope_of_work || "");
        setPhases(
          (Array.isArray(c.phases) && c.phases.length > 0
            ? c.phases
            : DEFAULT_PHASES) as Phase[]
        );
        setProjectType(c.project_type || "");
        setProjectBuildCost(c.project_build_cost || "");
        setProjectMaintenanceCost(c.project_maintenance_cost || "");
        setProjectEstimatedTotal(c.project_estimated_total || "");
      }
    }
  }, [selectedClientId, clients]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwnerName || !newCompanyName || !newEmail) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: {
          action: "create_client",
          owner_name: newOwnerName,
          company_name: newCompanyName,
          email: newEmail.toLowerCase().trim(),
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Client added" });
      setShowClientForm(false);
      setNewOwnerName(""); setNewCompanyName(""); setNewEmail("");
      await fetchData();
      if (res.data?.client?.id) setSelectedClientId(res.data.client.id);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveSow = async () => {
    if (!selectedClientId) return;
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: {
          action: "save_sow",
          client_id: selectedClientId,
          scope_of_work: sowText,
          phases,
          project_type: projectType,
          project_build_cost: projectBuildCost,
          project_maintenance_cost: projectMaintenanceCost,
          project_estimated_total: projectEstimatedTotal,
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Scope of work saved" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const updatePhase = (idx: number, patch: Partial<Phase>) => {
    setPhases((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };
  const addPhase = () => setPhases((p) => [...p, { name: `Phase ${p.length + 1}`, status: "pending" }]);
  const removePhase = (idx: number) => setPhases((p) => p.filter((_, i) => i !== idx));

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) return;
    if (!service || !price) {
      toast({ title: "Service and price required", variant: "destructive" });
      return;
    }
    if (depositRequired && (!depositAmount || !depositDueDate)) {
      toast({ title: "Deposit details required", variant: "destructive" });
      return;
    }
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: {
          action: "create_invoice",
          client_id: client.id,
          company_name: client.company_name,
          email: client.email,
          owner_name: client.owner_name,
          service,
          price: parseFloat(price),
          due_date: depositRequired ? depositDueDate : new Date().toISOString().split("T")[0],
          deposit_required: depositRequired,
          deposit_amount: depositRequired ? parseFloat(depositAmount) : null,
          deposit_due_date: depositRequired ? depositDueDate : null,
          message: message.trim() || null,
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice created" });
      setShowInvoiceForm(false);
      setService(""); setPrice(""); setDepositRequired(false);
      setDepositAmount(""); setDepositDueDate(""); setMessage("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteClient = async (e: React.MouseEvent, clientId: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Permanently remove ${name} and ALL their invoices? This cannot be undone.`)) return;
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "delete_client", client_id: clientId, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      if (selectedClientId === clientId) setSelectedClientId(null);
      await fetchData();
      toast({ title: "Client removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (invoiceId: string) => {
    if (!confirm("Permanently remove this invoice? This cannot be undone.")) return;
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "delete_invoice", invoice_id: invoiceId, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice deleted" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteSowComment = async (commentIndex: number) => {
    if (!selectedClientId) return;
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "delete_sow_comment", client_id: selectedClientId, comment_index: commentIndex, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: "Comment deleted" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSetStatus = async (invoiceId: string, status: "approved" | "paid") => {
    const label = status === "paid" ? "Mark this invoice as PAID?" : "Mark this invoice as UNPAID?";
    if (!confirm(label)) return;
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "set_status", invoice_id: invoiceId, status, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: status === "paid" ? "Marked as paid" : "Marked as unpaid" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSyncPayments = async () => {
    setSyncing(true);
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "sync_payments", password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      const updated = res.data?.updated || 0;
      if (updated > 0) toast({ title: `${updated} invoice(s) marked as paid` });
    } catch (err: any) {
      toast({ title: "Sync error", description: err.message, variant: "destructive" });
    }
    setSyncing(false);
  };

  const handleAddDeliverable = async (invoiceId: string) => {
    if (!newDelLabel || !newDelUrl) return;
    const inv = invoices.find((i) => i.id === invoiceId);
    const current = (inv?.deliverables || []) as Deliverable[];
    const updated = [...current, { label: newDelLabel, url: newDelUrl }];
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "update_deliverables", invoice_id: invoiceId, deliverables: updated, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: "Deliverable added" });
      setNewDelLabel(""); setNewDelUrl("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRemoveDeliverable = async (invoiceId: string, index: number) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    const current = (inv?.deliverables || []) as Deliverable[];
    const updated = current.filter((_, i) => i !== index);
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "update_deliverables", invoice_id: invoiceId, deliverables: updated, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.price, 0);
  const pendingCount = invoices.filter((i) => i.status !== "paid" && i.status !== "draft").length;

  // ── Login ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
        </div>
        <div className="border-b border-border">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Admin</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-5xl md:text-7xl font-mono font-bold text-foreground tracking-tight mb-4 text-center">
              <em>Admin</em> <span className="text-lg md:text-2xl text-primary font-normal">by RDG</span>
            </motion.h1>
            <AdminSubtext />
            <motion.form onSubmit={handleLogin} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="space-y-4">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-14 bg-transparent border-0 border-b border-border rounded-none font-mono text-center text-lg tracking-[0.5em] focus-visible:ring-0 focus-visible:border-foreground placeholder:text-foreground/30" />
              <Button type="submit" variant="outline" className="w-full h-12 font-mono text-xs uppercase tracking-[0.2em] rounded-none border-border hover:border-foreground hover:bg-transparent text-foreground">
                <Lock className="mr-2 h-3.5 w-3.5" />Enter
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    );
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const clientInvoices = selectedClient ? invoices.filter((i) => i.client_id === selectedClient.id) : [];

  // ── Client Detail (SOW + Invoices tabs) ──
  if (selectedClient) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
        </div>
        <div className="border-b border-border relative z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setSelectedClientId(null)} className="flex items-center gap-3 text-xs font-mono text-foreground hover:text-primary uppercase tracking-[0.2em]">
              <ArrowLeft className="h-4 w-4" /> All Clients
            </button>
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">{selectedClient.company_name}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
          <p className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-2">Client</p>
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight mb-1">
            {selectedClient.company_name}
          </h1>
          <p className="text-sm font-mono text-foreground/70">
            {selectedClient.owner_name || "—"} · {selectedClient.email}
          </p>

          <Tabs defaultValue="sow" className="mt-10">
            <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start gap-8">
              <TabsTrigger value="sow" className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground border-b-2 border-transparent px-0 pb-3 font-mono text-xs uppercase tracking-[0.2em]">
                Scope of Work
              </TabsTrigger>
              <TabsTrigger value="invoices" className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground border-b-2 border-transparent px-0 pb-3 font-mono text-xs uppercase tracking-[0.2em]">
                Invoices ({clientInvoices.length})
              </TabsTrigger>
            </TabsList>

            {/* SOW TAB */}
            <TabsContent value="sow" className="mt-8 space-y-10">
              {/* Client Review Status & Comments */}
              {(() => {
                const status = selectedClient?.sow_status || "pending";
                const comments: SowComment[] = Array.isArray(selectedClient?.sow_comments) ? selectedClient!.sow_comments! : [];
                const badge =
                  status === "approved" ? "bg-emerald-500 text-background"
                  : status === "rejected" ? "bg-destructive text-destructive-foreground"
                  : "bg-foreground/10 text-foreground border border-border";
                const label = status === "approved" ? "Client Approved" : status === "rejected" ? "Changes Requested" : "Awaiting Client Review";
                return (
                  <div className="border border-border p-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <p className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Client Review</p>
                      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 ${badge}`}>{label}</span>
                    </div>
                    {comments.length === 0 ? (
                      <p className="text-xs font-mono text-foreground/40 mt-4">No comments from client yet.</p>
                    ) : (
                      <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-2">
                        {comments.map((c, i) => (
                          <div key={i} className="border-l-2 border-foreground/30 pl-4">
                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
                                {c.author === "admin" ? "You" : selectedClient?.owner_name || selectedClient?.company_name || "Client"}
                              </span>
                              <span className="text-[10px] font-mono text-foreground/40">{new Date(c.created_at).toLocaleString()}</span>
                              <button
                                onClick={() => handleDeleteSowComment(i)}
                                className="ml-auto text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/50 hover:text-destructive transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                            <p className="text-sm font-mono text-foreground whitespace-pre-wrap">{c.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">Scope of Work</label>
                <textarea
                  value={sowText}
                  onChange={(e) => setSowText(e.target.value)}
                  placeholder="Describe the project scope, deliverables, timeline, and key milestones..."
                  rows={10}
                  className="w-full bg-transparent border border-border rounded-none p-4 font-mono text-sm focus-visible:ring-0 focus-visible:outline-none focus-visible:border-foreground text-foreground placeholder:text-foreground/30 resize-y"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Project Phases</label>
                  <button onClick={addPhase} className="text-xs font-mono uppercase tracking-[0.15em] text-foreground hover:text-primary">+ Add Phase</button>
                </div>
                <div className="space-y-3">
                  {phases.map((p, i) => (
                    <div key={i} className="flex gap-3 items-center border border-border p-3">
                      <span className="text-xs font-mono text-foreground/40 w-8">{String(i + 1).padStart(2, "0")}</span>
                      <Input
                        value={p.name}
                        onChange={(e) => updatePhase(i, { name: e.target.value })}
                        className="h-9 bg-transparent border-0 border-b border-border rounded-none font-mono text-sm flex-1"
                      />
                      <Select value={p.status} onValueChange={(v) => updatePhase(i, { status: v as PhaseStatus })}>
                        <SelectTrigger className="h-9 w-40 font-mono text-xs uppercase tracking-[0.15em] rounded-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-mono">
                          {PHASE_STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="font-mono text-xs uppercase">{s.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <button onClick={() => removePhase(i)} className="text-xs font-mono text-destructive hover:underline">remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveSow} className="h-12 px-10 font-mono text-sm uppercase tracking-[0.2em] rounded-none">
                Save Scope of Work
              </Button>
            </TabsContent>

            {/* INVOICES TAB */}
            <TabsContent value="invoices" className="mt-8">
              <div className="flex justify-end mb-6">
                <button onClick={() => setShowInvoiceForm(!showInvoiceForm)} className="text-sm font-mono uppercase tracking-[0.2em] text-foreground hover:text-primary flex items-center gap-2">
                  <Plus className="h-4 w-4" />New Invoice
                </button>
              </div>

              <AnimatePresence>
                {showInvoiceForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border border-border mb-8">
                    <form onSubmit={handleCreateInvoice} className="p-6 space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">Service</label>
                          <Select value={service} onValueChange={setService}>
                            <SelectTrigger className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base px-0">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent className="font-mono">
                              {SERVICE_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt} className="font-mono text-base">{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">Price</label>
                          <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2500" className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base px-0" />
                          {price && (
                            <div className="mt-3 font-mono text-sm">
                              <span>Fee: </span><strong className="text-primary">${calculateFee(parseFloat(price)).toLocaleString()}</strong>
                              <span className="mx-3">·</span>
                              <span>Total: </span><strong>${calculateTotal(parseFloat(price)).toLocaleString()}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">Message (optional)</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full bg-transparent border-0 border-b border-border font-mono text-base px-0 resize-none focus-visible:outline-none focus-visible:border-foreground" />
                      </div>

                      <div className="border-t border-border pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-mono">Require Deposit</p>
                          <Switch checked={depositRequired} onCheckedChange={setDepositRequired} />
                        </div>
                        {depositRequired && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Deposit amount" className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono px-0" />
                            <Input type="date" value={depositDueDate} onChange={(e) => setDepositDueDate(e.target.value)} className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono px-0" />
                          </div>
                        )}
                      </div>

                      <Button type="submit" className="h-12 px-10 font-mono text-sm uppercase tracking-[0.2em] rounded-none">Create</Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {clientInvoices.length === 0 ? (
                <div className="py-20 text-center border-t border-border">
                  <p className="text-lg font-mono text-foreground">No invoices yet for this client</p>
                </div>
              ) : (
                <div className="border-t border-border">
                  {clientInvoices.map((inv, i) => (
                    <div key={inv.id} className="border-b border-border py-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-semibold text-foreground text-lg">{inv.service}</span>
                            <span className={`text-xs font-mono uppercase tracking-[0.15em] ${inv.status === "paid" ? "text-emerald-500" : "text-primary"}`}>{inv.status}</span>
                          </div>
                          <p className="text-sm font-mono text-foreground/60 mt-1">{new Date(inv.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <span className="text-2xl font-mono font-bold">${inv.price.toLocaleString()}</span>
                          <div className="flex gap-2 flex-wrap">
                            {inv.status !== "paid" ? (
                              <button onClick={() => handleSetStatus(inv.id, "paid")} className="h-9 px-4 border border-border hover:border-emerald-500 hover:text-emerald-500 text-xs font-mono uppercase tracking-[0.1em]">Mark Paid</button>
                            ) : (
                              <button onClick={() => handleSetStatus(inv.id, "approved")} className="h-9 px-4 border border-border hover:border-foreground text-xs font-mono uppercase tracking-[0.1em]">Mark Unpaid</button>
                            )}
                            <button onClick={() => handleDelete(inv.id)} className="h-9 px-4 border border-border hover:border-destructive hover:text-destructive text-xs font-mono uppercase tracking-[0.1em]">Remove</button>
                          </div>
                        </div>
                      </div>

                      {inv.status === "paid" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">Deliverables ({(inv.deliverables || []).length})</span>
                            <button onClick={() => setEditingDeliverables(editingDeliverables === inv.id ? null : inv.id)} className="text-xs font-mono uppercase tracking-[0.1em] hover:text-primary">{editingDeliverables === inv.id ? "Close" : "Manage"}</button>
                          </div>
                          {(inv.deliverables || []).length > 0 && (
                            <div className="space-y-1 mb-3">
                              {(inv.deliverables as Deliverable[]).map((d, di) => (
                                <div key={di} className="flex items-center gap-3 text-sm font-mono">
                                  <span className="truncate">↗ {d.label}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">{d.url}</span>
                                  {editingDeliverables === inv.id && (
                                    <button onClick={() => handleRemoveDeliverable(inv.id, di)} className="text-xs text-destructive hover:underline ml-auto">remove</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {editingDeliverables === inv.id && (
                            <div className="flex gap-2 items-end">
                              <Input placeholder="Label" value={newDelLabel} onChange={(e) => setNewDelLabel(e.target.value)} className="h-9 bg-transparent border-0 border-b border-border rounded-none font-mono text-sm px-0" />
                              <Input placeholder="URL" value={newDelUrl} onChange={(e) => setNewDelUrl(e.target.value)} className="h-9 bg-transparent border-0 border-b border-border rounded-none font-mono text-sm px-0" />
                              <button onClick={() => handleAddDeliverable(inv.id)} className="h-9 px-4 border border-border hover:border-foreground text-xs font-mono uppercase tracking-[0.1em]">Add</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // ── Clients Dashboard ──
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
      </div>
      <div className="border-b border-border relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/home-office" className="flex items-center gap-4 hover:opacity-70 transition-opacity">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={handleSyncPayments} disabled={syncing} className="text-sm font-mono uppercase tracking-[0.2em] hover:text-primary">
              {syncing ? "Syncing..." : "Sync Payments"}
            </button>
            <button onClick={() => setShowClientForm(!showClientForm)} className="text-sm font-mono uppercase tracking-[0.2em] hover:text-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />New Client
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="py-10 border-b border-border">
          <p className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-2">Welcome back</p>
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight mb-8">Mr. Reed</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div><span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Clients</span><p className="text-3xl font-mono font-bold mt-1">{clients.length}</p></div>
            <div><span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Invoices</span><p className="text-3xl font-mono font-bold mt-1">{invoices.length}</p></div>
            <div><span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Revenue</span><p className="text-3xl font-mono font-bold mt-1">${totalRevenue.toLocaleString()}</p></div>
            <div><span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Pending</span><p className="text-3xl font-mono font-bold mt-1">{pendingCount}</p></div>
          </div>
        </div>

        <AnimatePresence>
          {showClientForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-b border-border">
              <div className="py-10">
                <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-8">Add Client</h2>
                <form onSubmit={handleCreateClient} className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-[0.3em] mb-3">Owner Name</label>
                      <Input value={newOwnerName} onChange={(e) => setNewOwnerName(e.target.value)} placeholder="Jane Doe" className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base px-0" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-[0.3em] mb-3">Business</label>
                      <Input value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="Acme Corp" className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base px-0" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-[0.3em] mb-3">Email</label>
                      <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="jane@acme.com" className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base px-0" />
                    </div>
                  </div>
                  <Button type="submit" className="h-12 px-10 font-mono text-sm uppercase tracking-[0.2em] rounded-none">Add Client</Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em]">Clients</h2>
            <span className="text-sm font-mono">{paidCount}/{invoices.length} invoices paid</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-5 w-5 border border-foreground/30 border-t-foreground rounded-full" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-20 text-center border-t border-border">
              <p className="text-lg font-mono">No clients yet — add one to get started</p>
            </div>
          ) : (
            <div className="border-t border-border">
              {clients.map((c, i) => {
                const cInvoices = invoices.filter((inv) => inv.client_id === c.id);
                const cPaid = cInvoices.filter((inv) => inv.status === "paid").length;
                const cTotal = cInvoices.reduce((s, inv) => s + inv.price, 0);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientId(c.id)}
                    className="w-full text-left border-b border-border py-6 hover:bg-foreground/5 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-6 px-1">
                      <div className="flex gap-6 items-start flex-1 min-w-0">
                        <span className="text-3xl font-mono font-bold text-foreground/20 leading-none pt-1 hidden md:block">{String(i + 1).padStart(2, "0")}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-semibold text-foreground text-lg">{c.company_name}</span>
                            {c.scope_of_work && <span className="text-xs font-mono uppercase tracking-[0.15em] text-emerald-500">SOW</span>}
                          </div>
                          <p className="text-sm font-mono text-foreground/70 mt-1">{c.owner_name || "—"} · {c.email}</p>
                          <p className="text-xs font-mono text-foreground/50 mt-1">{cInvoices.length} invoices · {cPaid} paid</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-2xl font-mono font-bold">${cTotal.toLocaleString()}</span>
                        <button
                          onClick={(e) => handleDeleteClient(e, c.id, c.company_name)}
                          className="h-9 px-4 border border-border hover:border-destructive hover:text-destructive text-xs font-mono uppercase tracking-[0.1em]"
                        >
                          Remove
                        </button>
                        <ChevronRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="RDG" className="h-10 opacity-40" />
          <p className="text-xs font-mono text-muted-foreground text-center">
            Reed Digital Group · Admin Console
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceAdmin;
