import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Send, Trash2, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "rdg2024admin";

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
  created_at: string;
  clients?: Client;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  approved: "bg-primary/10 text-primary",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
};

const InvoiceAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Access granted" });
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

    const { data: cli } = await supabase.from("clients").select("*");

    if (inv) setInvoices(inv as unknown as Invoice[]);
    if (cli) setClients(cli);
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

    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: {
          action: "create_invoice",
          company_name: companyName,
          email: email.toLowerCase().trim(),
          service,
          price: parseFloat(price),
          due_date: dueDate,
          password: ADMIN_PASSWORD,
        },
      });

      if (res.error) throw res.error;

      toast({ title: "Invoice created as draft" });
      setShowForm(false);
      setCompanyName("");
      setEmail("");
      setService("");
      setPrice("");
      setDueDate("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error creating invoice", description: err.message, variant: "destructive" });
    }
  };

  const handleApprove = async (invoiceId: string) => {
    try {
      const res = await supabase.functions.invoke("invoice-admin", {
        body: { action: "approve_invoice", invoice_id: invoiceId, password: ADMIN_PASSWORD },
      });
      if (res.error) throw res.error;
      toast({ title: "Invoice approved and sent to customer portal" });
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Card>
            <CardHeader className="text-center">
              <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <CardTitle className="text-lg font-mono">Invoice Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Access
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-2xl font-mono font-semibold text-foreground">Invoice Admin</h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Invoice
          </Button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-mono">Create Invoice</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateInvoice} className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Company Name *</Label>
                      <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Service *</Label>
                      <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="Website Development" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Price ($) *</Label>
                      <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2500.00" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Due Date *</Label>
                      <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full">Create Draft</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <p className="text-muted-foreground font-mono text-sm">Loading...</p>
        ) : invoices.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm text-center py-12">No invoices yet. Create your first one.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium text-sm text-foreground truncate">
                          {(inv.clients as unknown as Client)?.company_name || "Unknown"}
                        </span>
                        <Badge variant="secondary" className={statusColors[inv.status]}>
                          {inv.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {inv.service} · ${inv.price.toLocaleString()} · Due {new Date(inv.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {(inv.clients as unknown as Client)?.email}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {inv.status === "draft" && (
                        <Button size="sm" variant="outline" onClick={() => handleApprove(inv.id)}>
                          <Check className="mr-1 h-3 w-3" /> Approve
                        </Button>
                      )}
                      {inv.status !== "paid" && (
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(inv.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceAdmin;
