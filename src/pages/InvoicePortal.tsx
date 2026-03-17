import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, FileText, CreditCard, CheckCircle, ArrowRight, AlertTriangle, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
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
  deposit_required: boolean;
  deposit_amount: number | null;
  deposit_due_date: string | null;
  deposit_paid: boolean;
  created_at: string;
}

const InvoicePortal = () => {
  const [email, setEmail] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast({ title: "Payment successful!", description: "Thank you for your payment." });
    }
  }, [searchParams]);

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

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const handlePay = async (invoice: Invoice, payDeposit: boolean) => {
    setPayingId(invoice.id + (payDeposit ? "-dep" : ""));
    try {
      const res = await supabase.functions.invoke("create-checkout", {
        body: { invoice_id: invoice.id, pay_deposit: payDeposit },
      });
      if (res.error) throw res.error;
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err: any) {
      toast({ title: "Payment error", description: err.message, variant: "destructive" });
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: "32px 32px"
      }} />

      {/* Header */}
      <div className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-3xl">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Reed Digital Group" className="h-7" />
            <div className="h-4 w-px bg-border" />
            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Client Portal</span>
          </div>
          {client && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setClient(null); setInvoices([]); setEmail(""); }}
              className="text-[10px] text-muted-foreground font-mono hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Sign out
            </motion.button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          {!client ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              {/* Hero icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative mb-8"
              >
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Sparkles className="h-2.5 w-2.5 text-primary" />
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-3 text-center"
              >
                Client Portal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground font-mono mb-10 text-center max-w-xs"
              >
                Access your invoices and manage payments securely
              </motion.p>

              <motion.form
                onSubmit={handleEmailSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-sm space-y-3"
              >
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-card border-border/50 font-mono focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 font-mono group" disabled={loading}>
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    <>
                      Access Portal
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-mono text-primary uppercase tracking-wider">Active Session</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground">
                  Welcome, {client.company_name}
                </h1>
                <p className="text-sm text-muted-foreground font-mono mt-2">{client.email}</p>
              </motion.div>

              {invoices.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 border border-dashed border-border rounded-xl"
                >
                  <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-mono">No invoices available yet</p>
                  <p className="text-xs text-muted-foreground/60 font-mono mt-1">Your invoices will appear here once they're ready</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Your Invoices</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{invoices.length} total</span>
                  </div>

                  {invoices.map((inv, i) => {
                    const depositOverdue = inv.deposit_required && !inv.deposit_paid && isOverdue(inv.deposit_due_date);
                    const remainingBalance = inv.deposit_required && inv.deposit_amount
                      ? inv.price - inv.deposit_amount
                      : inv.price;
                    const isPaid = inv.status === "paid";
                    const depositPending = inv.deposit_required && !inv.deposit_paid && !isPaid;

                    return (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className={`rounded-xl border bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 ${
                          depositOverdue ? "border-destructive/30" : isPaid ? "border-emerald-200" : "border-border hover:border-primary/20"
                        }`}>
                          {/* Status bar at top */}
                          <div className={`h-1 ${isPaid ? "bg-emerald-500" : depositOverdue ? "bg-destructive" : "bg-primary"}`} />

                          <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-mono font-semibold text-foreground text-lg">{inv.service}</h3>
                                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                  Created {new Date(inv.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isPaid && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <CheckCircle className="h-3 w-3" /> Paid
                                  </span>
                                )}
                                {depositOverdue && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-destructive/10 text-destructive border border-destructive/20">
                                    <AlertTriangle className="h-3 w-3" /> Overdue
                                  </span>
                                )}
                                {depositPending && !depositOverdue && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                                    <Clock className="h-3 w-3" /> Deposit Due
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Breakdown */}
                            <div className="rounded-lg bg-muted/50 border border-border/50 divide-y divide-border/50">
                              <div className="flex justify-between px-4 py-2.5">
                                <span className="text-xs font-mono text-muted-foreground">Total Project Cost</span>
                                <span className="text-sm font-mono font-semibold text-foreground">${inv.price.toLocaleString()}</span>
                              </div>
                              {inv.deposit_required && inv.deposit_amount && (
                                <>
                                  <div className="flex justify-between px-4 py-2.5">
                                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                                      Deposit
                                      {inv.deposit_paid && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                                    </span>
                                    <div className="text-right">
                                      <span className={`text-sm font-mono font-medium ${inv.deposit_paid ? "text-emerald-600" : "text-foreground"}`}>
                                        ${inv.deposit_amount.toLocaleString()}
                                      </span>
                                      {!inv.deposit_paid && (
                                        <p className={`text-[10px] font-mono ${depositOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                                          Due {new Date(inv.deposit_due_date!).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex justify-between px-4 py-2.5 bg-primary/[0.02]">
                                    <span className="text-xs font-mono text-muted-foreground">Due After Completion</span>
                                    <span className="text-sm font-mono font-bold text-foreground">${remainingBalance.toLocaleString()}</span>
                                  </div>
                                </>
                              )}
                              <div className="flex justify-between px-4 py-2.5">
                                <span className="text-xs font-mono text-muted-foreground">Project Due Date</span>
                                <span className="text-xs font-mono text-foreground">{new Date(inv.due_date).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            {!isPaid && (
                              <div className="flex gap-3 mt-4">
                                {depositPending && (
                                  <Button
                                    onClick={() => handlePay(inv, true)}
                                    disabled={payingId === inv.id + "-dep"}
                                    className={`flex-1 h-11 font-mono ${depositOverdue ? "bg-destructive hover:bg-destructive/90" : ""}`}
                                  >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    {payingId === inv.id + "-dep" ? "Processing..." : `Pay Deposit — $${inv.deposit_amount?.toLocaleString()}`}
                                  </Button>
                                )}
                                {(!inv.deposit_required || inv.deposit_paid) && (
                                  <Button
                                    onClick={() => handlePay(inv, false)}
                                    disabled={payingId === inv.id}
                                    className="flex-1 h-11 font-mono"
                                  >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    {payingId === inv.id ? "Processing..." : `Pay — $${remainingBalance.toLocaleString()}`}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-6 max-w-3xl text-center">
          <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
            Powered by Reed Digital Group
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePortal;
