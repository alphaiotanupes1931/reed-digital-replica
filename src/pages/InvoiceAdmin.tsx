import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Lock, AlertTriangle, Shield, FileText, DollarSign, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const statusConfig: Record<string, { label: string; bg: string; dot: string }> = {
  draft: { label: "Draft", bg: "bg-muted", dot: "bg-muted-foreground" },
  approved: { label: "Approved", bg: "bg-primary/10", dot: "bg-primary" },
  sent: { label: "Sent", bg: "bg-blue-50", dot: "bg-blue-500" },
  paid: { label: "Paid", bg: "bg-emerald-50", dot: "bg-emerald-500" },
};

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
      toast({ title: "Welcome back" });
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="text-center mb-8">
            <motion.img
              src={logo}
              alt="RDG"
              className="h-10 mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4"
            >
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-mono text-primary">Secure Admin Access</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background rounded-xl border border-border p-6 shadow-2xl shadow-primary/5"
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-muted/50 border-border/50 font-mono text-center text-lg tracking-[0.5em]"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-mono">
                <Lock className="mr-2 h-4 w-4" />
                Authenticate
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-foreground">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <img src={logo} alt="RDG" className="h-7" />
            <div className="h-4 w-px bg-primary/20" />
            <span className="text-xs font-mono text-primary/80">Admin</span>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="font-mono text-xs"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Total Invoices", value: invoices.length, icon: FileText, color: "text-primary" },
            { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Pending", value: `$${pendingAmount.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
            { label: "Clients", value: totalClients, icon: Users, color: "text-blue-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="relative overflow-hidden rounded-lg border border-border bg-card p-4 group hover:border-primary/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
              <stat.icon className={`h-4 w-4 ${stat.color} mb-2`} />
              <p className="text-xl font-mono font-semibold text-foreground">{stat.value}</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Create form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/[0.02] to-transparent p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-mono font-semibold text-foreground">Create Invoice</h2>
                </div>

                <form onSubmit={handleCreateInvoice} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Company Name</Label>
                      <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Service</Label>
                      <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="Website Development" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Total Price ($)</Label>
                      <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2,500.00" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</Label>
                      <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-background" />
                    </div>
                  </div>

                  {/* Deposit section */}
                  <div className="rounded-lg border border-border bg-background p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono font-medium text-foreground">Require Deposit</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Upfront payment before project begins</p>
                      </div>
                      <Switch checked={depositRequired} onCheckedChange={setDepositRequired} />
                    </div>

                    <AnimatePresence>
                      {depositRequired && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-4"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Deposit Amount ($)</Label>
                              <Input type="number" step="0.01" min="0" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="500.00" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Deposit Due Date</Label>
                              <Input type="date" value={depositDueDate} onChange={(e) => setDepositDueDate(e.target.value)} />
                            </div>
                          </div>
                          {price && depositAmount && (
                            <div className="flex items-center gap-3 bg-primary/5 rounded-lg px-4 py-3 border border-primary/10">
                              <DollarSign className="h-4 w-4 text-primary shrink-0" />
                              <div className="text-xs font-mono">
                                <span className="text-muted-foreground">Deposit:</span>{" "}
                                <span className="text-foreground font-medium">${parseFloat(depositAmount).toLocaleString()}</span>
                                <span className="text-muted-foreground mx-2">→</span>
                                <span className="text-muted-foreground">After completion:</span>{" "}
                                <span className="text-foreground font-medium">${(parseFloat(price) - parseFloat(depositAmount)).toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button type="submit" className="w-full h-11 font-mono">
                    Create Draft Invoice
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">All Invoices</h2>
            <span className="text-[10px] font-mono text-muted-foreground">{invoices.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full"
              />
            </div>
          ) : invoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-border rounded-xl"
            >
              <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-mono">No invoices yet</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-1">Create your first invoice to get started</p>
            </motion.div>
          ) : (
            invoices.map((inv, i) => {
              const client = inv.clients as unknown as Client;
              const depositOverdue = inv.deposit_required && !inv.deposit_paid && isOverdue(inv.deposit_due_date);
              const remainingBalance = inv.deposit_required && inv.deposit_amount ? inv.price - inv.deposit_amount : inv.price;
              const config = statusConfig[inv.status];

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className={`group rounded-lg border bg-card p-4 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 ${
                    depositOverdue ? "border-destructive/40 bg-destructive/[0.02]" : "border-border"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono font-semibold text-sm text-foreground">
                          {client?.company_name || "Unknown"}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${config.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                        {depositOverdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-destructive/10 text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span>{inv.service}</span>
                        <span className="h-3 w-px bg-border" />
                        <span className="text-foreground font-medium">${inv.price.toLocaleString()}</span>
                        <span className="h-3 w-px bg-border" />
                        <span>Due {new Date(inv.due_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">{client?.email}</p>

                      {inv.deposit_required && inv.deposit_amount && (
                        <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
                          <span className={`px-2 py-0.5 rounded ${inv.deposit_paid ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                            Deposit: ${inv.deposit_amount.toLocaleString()} {inv.deposit_paid ? "✓" : `· Due ${new Date(inv.deposit_due_date!).toLocaleDateString()}`}
                          </span>
                          <span className="text-muted-foreground">
                            Remaining: <strong className="text-foreground">${remainingBalance.toLocaleString()}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      {inv.status === "draft" && (
                        <Button size="sm" variant="outline" onClick={() => handleApprove(inv.id)} className="font-mono text-xs h-8">
                          <Check className="mr-1 h-3 w-3" /> Approve
                        </Button>
                      )}
                      {inv.status !== "paid" && (
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(inv.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceAdmin;
