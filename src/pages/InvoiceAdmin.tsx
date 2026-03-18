import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lock } from "lucide-react";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

const ADMIN_PASSWORD = "admin123";
const PROCESSING_FEE_RATE = 0.029; // 2.9%
const PROCESSING_FEE_FLAT = 0.30; // + $0.30 per transaction

const SERVICE_OPTIONS = [
  "Website Development",
  "App Development",
];

interface Client {
  id: string;
  company_name: string;
  email: string;
  created_at: string;
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
  clients?: Client;
}

const AdminSubtext = () => {
  const { displayed, done } = useTypingEffect("Enter password to continue", 35, 800);
  return (
    <p className="text-lg font-mono text-foreground mb-12 text-center h-7">
      {displayed}
      {!done && <span className="typing-cursor">|</span>}
    </p>
  );
};

const calculateFee = (amount: number) => {
  return Math.round((amount * PROCESSING_FEE_RATE + PROCESSING_FEE_FLAT) * 100) / 100;
};

const calculateTotal = (amount: number) => {
  return Math.round((amount + calculateFee(amount)) * 100) / 100;
};

const InvoiceAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDueDate, setDepositDueDate] = useState("");

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
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "list_invoices", password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      if (res.data?.invoices) setInvoices(res.data.invoices as Invoice[]);
    } catch (err: any) {
      toast({ title: "Error loading invoices", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !service || !price) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    if (depositRequired && (!depositAmount || !depositDueDate)) {
      toast({ title: "Deposit details required", variant: "destructive" });
      return;
    }

    const basePrice = parseFloat(price);
    const totalWithFee = calculateTotal(basePrice);

    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: {
          action: "create_invoice",
          company_name: companyName,
          email: email.toLowerCase().trim(),
          service,
          price: totalWithFee,
          due_date: depositRequired ? depositDueDate : new Date().toISOString().split("T")[0],
          deposit_required: depositRequired,
          deposit_amount: depositRequired ? calculateTotal(parseFloat(depositAmount)) : null,
          deposit_due_date: depositRequired ? depositDueDate : null,
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice created" });
      setShowForm(false);
      setCompanyName(""); setEmail(""); setService(""); setPrice("");
      setDepositRequired(false); setDepositAmount(""); setDepositDueDate("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleApprove = async (invoiceId: string) => {
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "approve_invoice", invoice_id: invoiceId, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice approved" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (invoiceId: string) => {
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

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const paidCount = invoices.filter(i => i.status === "paid").length;
  const totalRevenue = invoices.reduce((sum, i) => sum + i.price, 0);
  const pendingCount = invoices.filter(i => i.status !== "paid" && i.status !== "draft").length;
  const uniqueClients = new Set(invoices.map(i => i.client_id)).size;

  // ── Login ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b border-border">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Admin</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-mono font-bold text-foreground tracking-tight mb-4 text-center"
            >
              Admin
            </motion.h1>
            <AdminSubtext />

            <motion.form
              onSubmit={handleLogin}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-transparent border-0 border-b border-border rounded-none font-mono text-center text-lg tracking-[0.5em] focus-visible:ring-0 focus-visible:border-foreground placeholder:text-foreground/30"
              />
              <Button type="submit" variant="outline" className="w-full h-12 font-mono text-xs uppercase tracking-[0.2em] rounded-none border-border hover:border-foreground hover:bg-transparent text-foreground">
                <Lock className="mr-2 h-3.5 w-3.5" />
                Enter
              </Button>
            </motion.form>
          </motion.div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
            <img src={logo} alt="RDG" className="h-10 opacity-40" />
            <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] text-center">
              System managed by Reed Digital Group
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Admin</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-mono uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Welcome + Stats */}
        <div className="py-10 border-b border-border">
          <p className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-2">
            Welcome back
          </p>
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight mb-8">
            Mr. Reed
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Invoices</span>
              <p className="text-3xl font-mono font-bold text-foreground mt-1">{invoices.length}</p>
            </div>
            <div>
              <span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Clients</span>
              <p className="text-3xl font-mono font-bold text-foreground mt-1">{uniqueClients}</p>
            </div>
            <div>
              <span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Revenue</span>
              <p className="text-3xl font-mono font-bold text-foreground mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm font-mono text-primary uppercase tracking-[0.2em]">Pending</span>
              <p className="text-3xl font-mono font-bold text-foreground mt-1">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Create form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-border"
            >
              <div className="py-10">
                <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-8">
                  Create Invoice
                </h2>

                <form onSubmit={handleCreateInvoice} className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">
                        Company
                      </label>
                      <Input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Acme Corp"
                        className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base focus-visible:ring-0 focus-visible:border-foreground px-0 text-foreground placeholder:text-foreground/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@company.com"
                        className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base focus-visible:ring-0 focus-visible:border-foreground px-0 text-foreground placeholder:text-foreground/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">
                        Service
                      </label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base focus:ring-0 px-0 text-foreground">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="font-mono">
                          {SERVICE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt} className="font-mono text-base">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">
                        Price
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2500"
                        className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base focus-visible:ring-0 focus-visible:border-foreground px-0 text-foreground placeholder:text-foreground/30"
                      />
                      {price && (
                        <div className="mt-3 font-mono text-sm text-foreground">
                          <span>Infrastructure & Setup Fee: </span>
                          <strong className="text-primary">${calculateFee(parseFloat(price)).toLocaleString()}</strong>
                          <span className="mx-3">·</span>
                          <span>Client Total: </span>
                          <strong className="text-foreground">${calculateTotal(parseFloat(price)).toLocaleString()}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deposit toggle */}
                  <div className="border-t border-border pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm font-mono font-medium text-foreground">Require Deposit</p>
                        <p className="text-xs font-mono text-foreground mt-1">Upfront payment before project begins</p>
                      </div>
                      <Switch checked={depositRequired} onCheckedChange={setDepositRequired} />
                    </div>

                    <AnimatePresence>
                      {depositRequired && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-8 md:grid-cols-2 mb-6">
                            <div>
                              <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">
                                Deposit Amount
                              </label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="500"
                                className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base focus-visible:ring-0 focus-visible:border-foreground px-0 text-foreground placeholder:text-foreground/30"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-3">
                                Deposit Due Date
                              </label>
                              <Input
                                type="date"
                                value={depositDueDate}
                                onChange={(e) => setDepositDueDate(e.target.value)}
                                className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono text-base focus-visible:ring-0 focus-visible:border-foreground px-0 text-foreground"
                              />
                            </div>
                          </div>

                          {price && depositAmount && (
                            <div className="font-mono text-sm border-t border-dashed border-border pt-4 flex gap-8">
                              <span className="text-foreground">
                                Deposit (w/ fee): <strong className="text-primary">${calculateTotal(parseFloat(depositAmount)).toLocaleString()}</strong>
                              </span>
                              <span className="text-foreground">
                                After completion: <strong className="text-foreground">${calculateTotal(parseFloat(price) - parseFloat(depositAmount)).toLocaleString()}</strong>
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button type="submit" className="h-12 px-10 font-mono text-sm uppercase tracking-[0.2em] rounded-none">
                    Send
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice list */}
        <div className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em]">
              All Invoices
            </h2>
            <span className="text-sm font-mono text-foreground">
              {paidCount}/{invoices.length} paid
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-5 w-5 border border-foreground/30 border-t-foreground rounded-full"
              />
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-20 text-center border-t border-border">
              <p className="text-lg font-mono text-foreground">No invoices yet</p>
            </div>
          ) : (
            <div className="border-t border-border">
              {invoices.map((inv, i) => {
                const client = inv.clients as unknown as Client;
                const depositOverdue = inv.deposit_required && !inv.deposit_paid && isOverdue(inv.deposit_due_date);
                const remainingBalance = inv.deposit_required && inv.deposit_amount ? inv.price - inv.deposit_amount : inv.price;
                const statusMap: Record<string, string> = {
                  draft: "DRAFT",
                  approved: "APPROVED",
                  sent: "SENT",
                  paid: "PAID",
                };

                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border py-6 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-6 items-start flex-1 min-w-0">
                        <span className="text-3xl font-mono font-bold text-foreground/20 leading-none pt-0.5 hidden md:block">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-semibold text-foreground text-lg">
                              {client?.company_name || "Unknown"}
                            </span>
                            <span className={`text-xs font-mono uppercase tracking-[0.15em] ${
                              inv.status === "paid" ? "text-emerald-500" :
                              inv.status === "draft" ? "text-foreground" :
                              "text-primary"
                            }`}>
                              {statusMap[inv.status]}
                            </span>
                            {depositOverdue && (
                              <span className="text-xs font-mono uppercase tracking-[0.15em] text-destructive">
                                OVERDUE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-sm font-mono text-foreground flex-wrap">
                            <span>{inv.service}</span>
                          </div>

                          <p className="text-sm font-mono text-foreground mt-1">
                            {client?.email}
                          </p>

                          {inv.deposit_required && inv.deposit_amount && (
                            <div className="flex gap-4 mt-3 text-sm font-mono text-foreground">
                              <span>
                                Deposit: ${inv.deposit_amount.toLocaleString()}
                                {inv.deposit_paid ? " ✓" : ` · Due ${new Date(inv.deposit_due_date!).toLocaleDateString()}`}
                              </span>
                              <span>
                                Remaining: <strong>${remainingBalance.toLocaleString()}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <span className="text-3xl font-mono font-bold text-foreground tracking-tight">
                          ${inv.price.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          {inv.status === "draft" && (
                            <button
                              onClick={() => handleApprove(inv.id)}
                              className="h-9 px-4 flex items-center justify-center border border-border hover:border-foreground rounded-none transition-colors text-xs font-mono uppercase tracking-[0.1em] text-foreground"
                            >
                              Approve
                            </button>
                          )}
                          {inv.status !== "paid" && (
                            <button
                              onClick={() => handleDelete(inv.id)}
                              className="h-9 px-4 flex items-center justify-center border border-border hover:border-destructive hover:text-destructive rounded-none transition-colors text-xs font-mono uppercase tracking-[0.1em] text-foreground"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="RDG" className="h-10 opacity-40" />
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] text-center">
            System managed by Reed Digital Group
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceAdmin;
