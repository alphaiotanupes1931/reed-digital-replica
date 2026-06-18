import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/rdg-header-logo.png";
import RevenueCalendar from "@/components/RevenueCalendar";

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
  maintenance_plan: string | null;
  sow_hidden?: boolean;
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
  paid_at?: string | null;
  message: string | null;
  deliverables: Deliverable[] | null;
  payment_method?: "stripe" | "zelle" | string | null;
  hidden_from_client?: boolean;
  deactivated?: boolean;
  payment_plan?: "one_time" | "monthly" | string | null;
  plan_start_date?: string | null;
  plan_end_date?: string | null;
  plan_months?: number | null;
  plan_monthly_amount?: number | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // PIN gate removed — auto-authenticate
    if (typeof window !== "undefined") localStorage.setItem("admin-auth", ADMIN_PASSWORD);
    return true;
  });
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [displayName, setDisplayName] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [sowVisible, setSowVisible] = useState(true);
  const [invoicesVisible, setInvoicesVisible] = useState(true);

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
  const [allowStripe, setAllowStripe] = useState(true);
  const [allowZelle, setAllowZelle] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<"one_time" | "monthly">("one_time");
  const [planStart, setPlanStart] = useState("");
  const [planEnd, setPlanEnd] = useState("");

  // Deliverables
  const [editingDeliverables, setEditingDeliverables] = useState<string | null>(null);
  const [newDelLabel, setNewDelLabel] = useState("");
  const [newDelUrl, setNewDelUrl] = useState("");

  // Invoice editing
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [editService, setEditService] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editDepositRequired, setEditDepositRequired] = useState(false);
  const [editDepositAmount, setEditDepositAmount] = useState("");
  const [editDepositDueDate, setEditDepositDueDate] = useState("");
  const [editAllowStripe, setEditAllowStripe] = useState(true);
  const [editAllowZelle, setEditAllowZelle] = useState(false);
  const [editPaymentPlan, setEditPaymentPlan] = useState<"one_time" | "monthly">("one_time");
  const [editPlanStart, setEditPlanStart] = useState("");
  const [editPlanEnd, setEditPlanEnd] = useState("");

  const startEditInvoice = (inv: Invoice) => {
    setEditingInvoiceId(inv.id);
    setEditService(inv.service);
    setEditPrice(String(inv.price));
    setEditMessage(inv.message || "");
    setEditDepositRequired(!!inv.deposit_required);
    setEditDepositAmount(inv.deposit_amount != null ? String(inv.deposit_amount) : "");
    setEditDepositDueDate(inv.deposit_due_date || "");
    const m = (inv.payment_method || "stripe").split(",").map(x => x.trim()).filter(Boolean);
    setEditAllowStripe(m.includes("stripe"));
    setEditAllowZelle(m.includes("zelle"));
    setEditPaymentPlan((inv.payment_plan === "monthly" ? "monthly" : "one_time"));
    setEditPlanStart(inv.plan_start_date || "");
    setEditPlanEnd(inv.plan_end_date || "");
  };

  const handleUpdateInvoice = async (invoiceId: string) => {
    if (!editService || !editPrice) {
      toast({ title: "Service and price required", variant: "destructive" });
      return;
    }
    if (editDepositRequired && (!editDepositAmount || !editDepositDueDate)) {
      toast({ title: "Deposit details required", variant: "destructive" });
      return;
    }
    if (!editAllowStripe && !editAllowZelle) {
      toast({ title: "Select at least one payment method", variant: "destructive" });
      return;
    }
    if (editPaymentPlan === "monthly" && (!editPlanStart || !editPlanEnd)) {
      toast({ title: "Monthly plan needs start and end dates", variant: "destructive" });
      return;
    }
    if (editPaymentPlan === "monthly" && editPlanStart && editPlanEnd && editPlanEnd < editPlanStart) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: {
          action: "update_invoice",
          invoice_id: invoiceId,
          service: editService,
          price: parseFloat(editPrice),
          due_date: editDepositRequired ? editDepositDueDate : new Date().toISOString().split("T")[0],
          deposit_required: editDepositRequired,
          deposit_amount: editDepositRequired ? parseFloat(editDepositAmount) : null,
          deposit_due_date: editDepositRequired ? editDepositDueDate : null,
          message: editMessage.trim() || null,
          payment_method: [
            ...(editAllowStripe ? ["stripe"] : []),
            ...(editAllowZelle ? ["zelle"] : []),
          ].join(","),
          payment_plan: editPaymentPlan,
          plan_start_date: editPaymentPlan === "monthly" ? editPlanStart : null,
          plan_end_date: editPaymentPlan === "monthly" ? editPlanEnd : null,
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice updated" });
      setEditingInvoiceId(null);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", ADMIN_PASSWORD);
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

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setHasSession(!!data.user);
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", data.user.id)
        .maybeSingle();
      setDisplayName(profile?.full_name || data.user.email?.split("@")[0] || "Admin");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

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
    if (paymentPlan === "monthly" && (!planStart || !planEnd)) {
      toast({ title: "Monthly plan needs start and end dates", variant: "destructive" });
      return;
    }
    if (paymentPlan === "monthly" && planEnd < planStart) {
      toast({ title: "End date must be after start date", variant: "destructive" });
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
          payment_method: [
            ...(allowStripe ? ["stripe"] : []),
            ...(allowZelle ? ["zelle"] : []),
          ].join(",") || "stripe",
          payment_plan: paymentPlan,
          plan_start_date: paymentPlan === "monthly" ? planStart : null,
          plan_end_date: paymentPlan === "monthly" ? planEnd : null,
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice created" });
      setShowInvoiceForm(false);
      setService(""); setPrice(""); setDepositRequired(false);
      setDepositAmount(""); setDepositDueDate(""); setMessage("");
      setAllowStripe(true); setAllowZelle(false);
      setPaymentPlan("one_time"); setPlanStart(""); setPlanEnd("");
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

  const handleSetPaymentMethod = async (invoiceId: string, method: string) => {
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "set_payment_method", invoice_id: invoiceId, payment_method: method, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      const label = method === "zelle" ? "Zelle" : method === "stripe,zelle" || method === "zelle,stripe" ? "Stripe + Zelle" : "Stripe";
      toast({ title: `Payment method set to ${label}` });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleVisibility = async (invoiceId: string, currentlyHidden: boolean) => {
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "set_visibility", invoice_id: invoiceId, hidden_from_client: !currentlyHidden, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: !currentlyHidden ? "Hidden from client" : "Visible to client" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleDeactivated = async (invoiceId: string, currentlyDeactivated: boolean) => {
    const next = !currentlyDeactivated;
    const label = next
      ? "Deactivate this invoice? The client will no longer see it and their email will be free to receive a new active invoice."
      : "Reactivate this invoice? It will become this client's active invoice again.";
    if (!confirm(label)) return;
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "set_deactivated", invoice_id: invoiceId, deactivated: next, password: ADMIN_PASSWORD },
      });
      // Edge function returns non-2xx for conflict; surface its error message.
      if (res.error) {
        const msg = (res.data as any)?.error || res.error.message || "Action blocked";
        toast({ title: "Cannot reactivate", description: msg, variant: "destructive" });
        return;
      }
      toast({ title: next ? "Invoice deactivated" : "Invoice reactivated" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Stripe payment history per client
  const [paymentHistory, setPaymentHistory] = useState<Record<string, {
    loading: boolean;
    open: boolean;
    payments?: Array<{ invoice_id: string | null; service: string | null; amount: number; currency: string; status: string; date: string; kind: string; description?: string }>;
    count?: number;
    total?: number;
    error?: string;
  }>>({});

  const loadPaymentHistory = async (clientId: string) => {
    setPaymentHistory((p) => ({ ...p, [clientId]: { ...(p[clientId] || {}), open: true, loading: true } }));
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "get_payment_history", client_id: clientId, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      const d = res.data as any;
      setPaymentHistory((p) => ({ ...p, [clientId]: { open: true, loading: false, payments: d.payments, count: d.count, total: d.total } }));
    } catch (err: any) {
      setPaymentHistory((p) => ({ ...p, [clientId]: { open: true, loading: false, error: err.message } }));
    }
  };

  const togglePaymentHistory = (clientId: string) => {
    const cur = paymentHistory[clientId];
    if (cur?.open) {
      setPaymentHistory((p) => ({ ...p, [clientId]: { ...cur, open: false } }));
    } else if (cur?.payments) {
      setPaymentHistory((p) => ({ ...p, [clientId]: { ...cur, open: true } }));
    } else {
      loadPaymentHistory(clientId);
    }
  };

  // Auto-calculate estimated total from build + maintenance cost strings.
  // Supports "$500", "$500-800", "500 - 800", "N/A", etc. Maintenance is treated as monthly.
  const parseCostRange = (raw: string): [number, number] | null => {
    if (!raw) return null;
    const cleaned = raw.replace(/[$,\s]/g, "");
    if (!cleaned || /n\/?a/i.test(cleaned)) return null;
    const parts = cleaned.split(/[-–—to]+/i).filter(Boolean);
    const nums = parts.map((p) => parseFloat(p)).filter((n) => !isNaN(n));
    if (nums.length === 0) return null;
    if (nums.length === 1) return [nums[0], nums[0]];
    return [Math.min(...nums), Math.max(...nums)];
  };

  const formatNum = (n: number) =>
    n >= 1000 ? n.toLocaleString("en-US") : String(Math.round(n));

  useEffect(() => {
    const build = parseCostRange(projectBuildCost);
    const maint = parseCostRange(projectMaintenanceCost);
    if (!build) {
      setProjectEstimatedTotal("");
      return;
    }
    const lo = build[0] + (maint ? maint[0] : 0);
    const hi = build[1] + (maint ? maint[1] : 0);
    const computed =
      lo === hi ? `$${formatNum(lo)}` : `$${formatNum(lo)}–${formatNum(hi)}`;
    setProjectEstimatedTotal(computed);
  }, [projectBuildCost, projectMaintenanceCost]);

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

  if (hasSession === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <Lock className="h-6 w-6 mx-auto mb-6 text-foreground/60" />
          <h1 className="text-2xl font-mono font-bold text-foreground mb-3">Sign in required</h1>
          <p className="text-sm font-mono text-muted-foreground mb-8">
            Your session expired. Sign in to access the admin panel.
          </p>
          <Link
            to="/home-office/login"
            className="inline-block text-xs font-mono uppercase tracking-widest border-2 border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

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

  // ── Client Detail ──
  if (selectedClient) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-8 relative z-10">
          <button onClick={() => setSelectedClientId(null)} className="text-xs font-mono text-muted-foreground hover:text-brand uppercase tracking-widest">
            ← All Clients
          </button>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground tracking-tight mt-3">{selectedClient.company_name}</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">{selectedClient.email}</p>

          <div className="mt-10 space-y-8">
            {/* Scope of Work */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-mono text-foreground uppercase tracking-widest">Scope of Work</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSowVisible(v => !v)} className="text-[10px] font-mono uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors">{sowVisible ? "Hide SOW" : "Show SOW"}</button>
                  <button onClick={handleSaveSow} className="text-[10px] font-mono uppercase tracking-widest border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors">Save</button>
                </div>
              </div>
              {sowVisible && (
                <textarea
                  value={sowText}
                  onChange={(e) => setSowText(e.target.value)}
                  placeholder="What you're building..."
                  rows={6}
                  className="w-full bg-transparent border border-border p-4 font-mono text-sm focus:outline-none focus:border-foreground placeholder:text-foreground/30 resize-y"
                />
              )}
            </div>

            {/* Phases */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-mono text-foreground uppercase tracking-widest">Phases</p>
                <button onClick={addPhase} className="text-xs font-mono uppercase tracking-widest text-foreground hover:text-primary">+ Add</button>
              </div>
              <div className="space-y-2">
                {phases.map((p, i) => (
                  <div key={i} className="flex gap-3 items-center border border-border p-3">
                    <span className="text-xs font-mono text-muted-foreground w-6">{i + 1}</span>
                    <Input value={p.name} onChange={(e) => updatePhase(i, { name: e.target.value })} className="h-8 bg-transparent border-0 border-b border-border rounded-none font-mono text-sm flex-1 px-0" />
                    <select value={p.status} onChange={(e) => updatePhase(i, { status: e.target.value as PhaseStatus })} className="bg-transparent border border-border font-mono text-xs uppercase px-2 py-1">
                      {PHASE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                    <button onClick={() => removePhase(i)} className="text-xs font-mono text-destructive hover:underline">remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-mono text-foreground uppercase tracking-widest">Invoices</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setInvoicesVisible(v => !v)} className="text-[10px] font-mono uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors">{invoicesVisible ? "Hide Invoices" : "Show Invoices"}</button>
                  <button onClick={() => setShowInvoiceForm(!showInvoiceForm)} className="text-xs font-mono uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
                    {showInvoiceForm ? "Cancel" : "New Invoice"}
                  </button>
                </div>
              </div>

              {invoicesVisible && (
                <>
                  <AnimatePresence>
                    {showInvoiceForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border border-border mb-6">
                        <form onSubmit={handleCreateInvoice} className="p-5 space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <select value={service} onChange={(e) => setService(e.target.value)} className="bg-transparent border-b border-border p-3 font-mono text-sm focus:outline-none focus:border-foreground">
                              <option value="">Select service</option>
                              {SERVICE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="bg-transparent border-b border-border p-3 font-mono text-sm focus:outline-none focus:border-foreground placeholder:text-foreground/30" />
                          </div>
                          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message (optional)" rows={2} className="w-full bg-transparent border-b border-border font-mono text-sm resize-none focus:outline-none focus:border-foreground placeholder:text-foreground/30" />
                          {/* Payment Plan */}
                          <div className="border-t border-border pt-4">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Payment Plan</p>
                            <div className="flex gap-2 mb-3">
                              <button type="button" onClick={() => setPaymentPlan("one_time")} className={`flex-1 text-xs font-mono uppercase tracking-widest border px-3 py-2 transition-colors ${paymentPlan === "one_time" ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>One-time</button>
                              <button type="button" onClick={() => setPaymentPlan("monthly")} className={`flex-1 text-xs font-mono uppercase tracking-widest border px-3 py-2 transition-colors ${paymentPlan === "monthly" ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>Monthly (Stripe)</button>
                            </div>
                            {paymentPlan === "monthly" && (
                              <div className="space-y-3">
                                <div className="grid gap-3 md:grid-cols-2">
                                  <label className="block">
                                    <span className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Start date</span>
                                    <input type="date" value={planStart} onChange={(e) => setPlanStart(e.target.value)} className="w-full bg-transparent border-b border-border p-2 font-mono text-sm focus:outline-none focus:border-foreground" />
                                  </label>
                                  <label className="block">
                                    <span className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">End date</span>
                                    <input type="date" value={planEnd} onChange={(e) => setPlanEnd(e.target.value)} className="w-full bg-transparent border-b border-border p-2 font-mono text-sm focus:outline-none focus:border-foreground" />
                                  </label>
                                </div>
                                {(() => {
                                  const p = parseFloat(price);
                                  if (!p || !planStart || !planEnd) return null;
                                  const s = new Date(planStart);
                                  const e = new Date(planEnd);
                                  const months = Math.max(1, (e.getUTCFullYear() - s.getUTCFullYear()) * 12 + (e.getUTCMonth() - s.getUTCMonth()) + 1);
                                  const monthly = p / months;
                                  return (
                                    <div className="border border-foreground/30 p-3 font-mono text-xs">
                                      <div className="flex justify-between"><span className="text-muted-foreground">Months</span><span className="font-bold">{months}</span></div>
                                      <div className="flex justify-between mt-1"><span className="text-muted-foreground">Monthly (base)</span><span className="font-bold">${monthly.toFixed(2)}</span></div>
                                      <div className="flex justify-between mt-1"><span className="text-muted-foreground">Client pays / mo (incl. fee)</span><span className="font-bold">${calculateTotal(monthly).toFixed(2)}</span></div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <Button type="submit" className="h-10 px-8 font-mono text-xs uppercase tracking-widest rounded-none">Create</Button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {clientInvoices.length === 0 ? (
                    <p className="text-sm font-mono text-muted-foreground py-8 border-t border-border">No invoices.</p>
                  ) : (
                    <div className="border-t border-border">
                      {clientInvoices.map((inv) => (
                        <div key={inv.id} className="border-b border-border py-4 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-foreground">{inv.service}</span>
                              <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border ${inv.status === "paid" ? "border-emerald-500 text-emerald-500" : "border-primary text-primary"}`}>{inv.status}</span>
                              {inv.payment_plan === "monthly" && (
                                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-foreground/40 text-foreground/70">
                                  Monthly · {inv.plan_months}mo · ${Number(inv.plan_monthly_amount || 0).toFixed(2)}/mo
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-mono text-muted-foreground mt-1">{new Date(inv.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-lg font-mono font-bold">${inv.price.toLocaleString()}</span>
                            {inv.status !== "paid" ? (
                              <button onClick={() => handleSetStatus(inv.id, "paid")} className="text-[10px] font-mono uppercase tracking-widest border border-border px-3 py-1.5 hover:border-emerald-500 hover:text-emerald-500">Mark Paid</button>
                            ) : (
                              <button onClick={() => handleSetStatus(inv.id, "approved")} className="text-[10px] font-mono uppercase tracking-widest border border-border px-3 py-1.5 hover:border-foreground">Unpaid</button>
                            )}
                            <button onClick={() => handleDelete(inv.id)} className="text-[10px] font-mono uppercase tracking-widest border border-border px-3 py-1.5 hover:border-destructive hover:text-destructive">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="pt-32 pb-8">
          <Link to="/home-office" className="text-xs font-mono text-muted-foreground hover:text-brand uppercase tracking-widest">← Home Office</Link>
          <div className="flex items-start justify-between gap-4 mt-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground tracking-tight">{displayName}</h1>
              <p className="text-sm font-mono text-muted-foreground mt-1">{clients.length} clients · {invoices.length} invoices · ${totalRevenue.toLocaleString()} revenue</p>
            </div>
            <button onClick={() => setShowClientForm(!showClientForm)} className="text-xs font-mono uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors whitespace-nowrap">
              {showClientForm ? "Cancel" : "Add Client"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showClientForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-2 border-foreground mb-8">
              <form onSubmit={handleCreateClient} className="p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <input value={newOwnerName} onChange={(e) => setNewOwnerName(e.target.value)} placeholder="Name" className="bg-transparent border-b border-border p-3 font-mono text-sm focus:outline-none focus:border-foreground placeholder:text-foreground/30" />
                  <input value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="Business" className="bg-transparent border-b border-border p-3 font-mono text-sm focus:outline-none focus:border-foreground placeholder:text-foreground/30" />
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="bg-transparent border-b border-border p-3 font-mono text-sm focus:outline-none focus:border-foreground placeholder:text-foreground/30" />
                </div>
                <Button type="submit" className="h-10 px-8 font-mono text-xs uppercase tracking-widest rounded-none">Add</Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {invoices.some((i) => i.status === "paid") && (
          <RevenueCalendar invoices={invoices as any} />
        )}

        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-5 w-5 border border-foreground/30 border-t-foreground rounded-full" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-20 text-center border-t border-border">
              <p className="text-lg font-mono">No clients yet.</p>
            </div>
          ) : (
            <div className="border-t border-border">
              {clients.map((c) => {
                const cInvoices = invoices.filter((inv) => inv.client_id === c.id);
                const cPaid = cInvoices.filter((inv) => inv.status === "paid").length;
                const cTotal = cInvoices.reduce((s, inv) => s + inv.price, 0);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientId(c.id)}
                    className="w-full text-left border-b border-border py-5 hover:bg-foreground/5 transition-colors group cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-mono font-bold text-foreground text-base">{c.company_name}</p>
                      <p className="text-sm font-mono text-muted-foreground">{c.email} · {cInvoices.length} invoices · {cPaid} paid</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xl font-mono font-bold">${cTotal.toLocaleString()}</span>
                      <button
                        onClick={(e) => handleDeleteClient(e, c.id, c.company_name)}
                        className="text-[10px] font-mono uppercase tracking-widest border border-border px-3 py-1.5 hover:border-destructive hover:text-destructive"
                      >
                        Remove
                      </button>
                      <ChevronRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceAdmin;
