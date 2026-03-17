import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, FileText, CreditCard, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/rdg-header-logo.png";

interface Client {
  id: string;
  company_name: string;
  email: string;
}

interface Invoice {
  id: string;
  service: string;
  price: number;
  due_date: string;
  status: "draft" | "approved" | "sent" | "paid";
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  approved: { label: "Awaiting Payment", color: "bg-primary/10 text-primary", icon: <CreditCard className="h-3 w-3" /> },
  sent: { label: "Awaiting Payment", color: "bg-primary/10 text-primary", icon: <CreditCard className="h-3 w-3" /> },
  paid: { label: "Paid", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
};

const InvoicePortal = () => {
  const [email, setEmail] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (!clientData) {
      toast({ title: "No account found", description: "This email is not associated with any invoices.", variant: "destructive" });
      setLoading(false);
      return;
    }

    setClient(clientData);

    const { data: invData } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientData.id)
      .in("status", ["approved", "sent", "paid"])
      .order("created_at", { ascending: false });

    setInvoices((invData as Invoice[]) || []);
    setLoading(false);
  };

  const handlePay = async (invoice: Invoice) => {
    setPayingId(invoice.id);
    try {
      const res = await supabase.functions.invoke("create-checkout", {
        body: { invoice_id: invoice.id },
      });

      if (res.error) throw res.error;
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      toast({ title: "Payment error", description: err.message, variant: "destructive" });
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logo} alt="Reed Digital Group" className="h-7" />
          <span className="text-xs text-muted-foreground font-mono">Client Portal</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <AnimatePresence mode="wait">
          {!client ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-mono font-semibold text-foreground mb-2">
                  Client Portal
                </h1>
                <p className="text-sm text-muted-foreground font-mono mb-8">
                  Enter your email to view your invoices
                </p>
              </motion.div>

              <form onSubmit={handleEmailSubmit} className="max-w-sm mx-auto space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Access Portal"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-mono font-semibold text-foreground"
                >
                  Welcome, {client.company_name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm text-muted-foreground font-mono mt-1"
                >
                  {client.email}
                </motion.p>
              </div>

              {invoices.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground font-mono text-sm py-12"
                >
                  No invoices available yet.
                </motion.p>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv, i) => {
                    const config = statusConfig[inv.status] || statusConfig.approved;
                    return (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-mono font-medium text-foreground">{inv.service}</h3>
                                  <Badge variant="secondary" className={config.color}>
                                    {config.icon}
                                    <span className="ml-1">{config.label}</span>
                                  </Badge>
                                </div>
                                <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                                  <span>Amount: <strong className="text-foreground">${inv.price.toLocaleString()}</strong></span>
                                  <span>Due: {new Date(inv.due_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {inv.status !== "paid" && (
                                <Button
                                  onClick={() => handlePay(inv)}
                                  disabled={payingId === inv.id}
                                  size="sm"
                                >
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  {payingId === inv.id ? "Processing..." : "Pay Now"}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={() => { setClient(null); setInvoices([]); setEmail(""); }}
                  className="text-xs text-muted-foreground font-mono hover:text-foreground transition-colors"
                >
                  Sign out
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvoicePortal;
