import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/rdg-header-logo.png";

const ADMIN_PASSWORD = "admin123";

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

const InvoiceAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [dueDate, setDueDate] = useState("");
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
    const { data: inv } = await supabase
      .from("invoices")
      .select("*, clients(*)")
      .order("created_at", { ascending: false });
    if (inv) setInvoices(inv as unknown as Invoice[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !service || !price || !dueDate) {
      toast({ title: "All fields are required", variant: "destructive" });
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
          company_name: companyName,
          email: email.toLowerCase().trim(),
          service,
          price: parseFloat(price),
          due_date: dueDate,
          deposit_required: depositRequired,
          deposit_amount: depositRequired ? parseFloat(depositAmount) : null,
          deposit_due_date: depositRequired ? depositDueDate : null,
          password: ADMIN_PASSWORD,
        },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice created" });
      setShowForm(false);
      setCompanyName(""); setEmail(""); setService(""); setPrice(""); setDueDate("");
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

  // Stats
  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.price, 0);
  const pendingAmount = invoices.filter(i => i.status !== "paid" && i.status !== "draft").reduce((s, i) => s + i.price, 0);
  const totalClients = new Set(invoices.map(i => i.client_id)).size;
  const paidCount = invoices.filter(i => i.status === "paid").length;

  // ── Login ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xs"
        >
          <img src={logo} alt="RDG" className="h-8 mx-auto mb-16 opacity-80" />

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em] mb-3">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-transparent border-0 border-b border-primary/20 rounded-none font-mono text-primary text-center text-lg tracking-[0.5em] focus-visible:ring-0 focus-visible:border-primary/60 placeholder:text-primary/20"
              />
            </div>
            <Button type="submit" variant="outline" className="w-full h-12 font-mono text-xs uppercase tracking-[0.2em] border-primary/30 text-primary hover:bg-primary/10 hover:text-primary rounded-none">
              <Lock className="mr-2 h-3.5 w-3.5" />
              Enter
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Admin</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Stats — oversized numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 border-b border-border"
        >
          {[
            { label: "Invoices", value: String(invoices.length).padStart(2, "0") },
            { label: "Revenue", value: `$${totalRevenue.toLocaleString()}` },
            { label: "Pending", value: `$${pendingAmount.toLocaleString()}` },
            { label: "Clients", value: String(totalClients).padStart(2, "0") },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`py-10 px-1 ${i < 3 ? "md:border-r border-border" : ""} ${i < 2 ? "border-r border-border md:border-r" : ""}`}
            >
              <p className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mt-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

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
                <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-8">
                  Create Invoice
                </h2>

                <form onSubmit={handleCreateInvoice} className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    {[
                      { label: "Company", value: companyName, setter: setCompanyName, placeholder: "Acme Corp", type: "text" },
                      { label: "Email", value: email, setter: setEmail, placeholder: "client@company.com", type: "email" },
                      { label: "Service", value: service, setter: setService, placeholder: "Website Development", type: "text" },
                      { label: "Price", value: price, setter: setPrice, placeholder: "2500", type: "number" },
                      { label: "Due Date", value: dueDate, setter: setDueDate, placeholder: "", type: "date" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-2">
                          {field.label}
                        </label>
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder={field.placeholder}
                          step={field.type === "number" ? "0.01" : undefined}
                          min={field.type === "number" ? "0" : undefined}
                          className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono focus-visible:ring-0 focus-visible:border-foreground px-0"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Deposit toggle */}
                  <div className="border-t border-border pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs font-mono font-medium text-foreground">Require Deposit</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-1">Upfront payment before project begins</p>
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
                              <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-2">
                                Deposit Amount
                              </label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="500"
                                className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono focus-visible:ring-0 focus-visible:border-foreground px-0"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-2">
                                Deposit Due
                              </label>
                              <Input
                                type="date"
                                value={depositDueDate}
                                onChange={(e) => setDepositDueDate(e.target.value)}
                                className="h-12 bg-transparent border-0 border-b border-border rounded-none font-mono focus-visible:ring-0 focus-visible:border-foreground px-0"
                              />
                            </div>
                          </div>

                          {price && depositAmount && (
                            <div className="font-mono text-xs border-t border-dashed border-border pt-4 flex gap-8">
                              <span className="text-muted-foreground">
                                Deposit: <strong className="text-foreground">${parseFloat(depositAmount).toLocaleString()}</strong>
                              </span>
                              <span className="text-muted-foreground">
                                After completion: <strong className="text-foreground">${(parseFloat(price) - parseFloat(depositAmount)).toLocaleString()}</strong>
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button type="submit" className="h-12 px-10 font-mono text-xs uppercase tracking-[0.2em] rounded-none">
                    Create Draft
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice list */}
        <div className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
              All Invoices
            </h2>
            <span className="text-[10px] font-mono text-muted-foreground">
              {paidCount}/{invoices.length} paid
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-5 w-5 border border-muted-foreground/30 border-t-foreground rounded-full"
              />
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-20 text-center border-t border-border">
              <p className="text-sm font-mono text-muted-foreground">No invoices yet</p>
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
                    className="border-b border-border py-5 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: index + info */}
                      <div className="flex gap-6 items-start flex-1 min-w-0">
                        <span className="text-3xl font-mono font-bold text-muted-foreground/20 leading-none pt-0.5 hidden md:block">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-semibold text-foreground text-sm">
                              {client?.company_name || "Unknown"}
                            </span>
                            <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${
                              inv.status === "paid" ? "text-emerald-500" :
                              inv.status === "draft" ? "text-muted-foreground" :
                              "text-primary"
                            }`}>
                              {statusMap[inv.status]}
                            </span>
                            {depositOverdue && (
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-destructive">
                                OVERDUE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-muted-foreground flex-wrap">
                            <span>{inv.service}</span>
                            <span className="text-border">—</span>
                            <span>Due {new Date(inv.due_date).toLocaleDateString()}</span>
                          </div>

                          <p className="text-[10px] font-mono text-muted-foreground/50 mt-1">
                            {client?.email}
                          </p>

                          {inv.deposit_required && inv.deposit_amount && (
                            <div className="flex gap-4 mt-2 text-[10px] font-mono text-muted-foreground">
                              <span>
                                Deposit: ${inv.deposit_amount.toLocaleString()}
                                {inv.deposit_paid ? " ✓" : ` · Due ${new Date(inv.deposit_due_date!).toLocaleDateString()}`}
                              </span>
                              <span>
                                Remaining: ${remainingBalance.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: price + actions */}
                      <div className="flex items-center gap-6 shrink-0">
                        <span className="text-2xl font-mono font-bold text-foreground tracking-tight">
                          ${inv.price.toLocaleString()}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {inv.status === "draft" && (
                            <button
                              onClick={() => handleApprove(inv.id)}
                              className="h-8 w-8 flex items-center justify-center border border-border hover:border-foreground rounded-none transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {inv.status !== "paid" && (
                            <button
                              onClick={() => handleDelete(inv.id)}
                              className="h-8 w-8 flex items-center justify-center border border-border hover:border-destructive hover:text-destructive rounded-none transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
    </div>
  );
};

export default InvoiceAdmin;
