import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, CreditCard } from "lucide-react";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const PortalSubtext = () => {
  const { displayed, done } = useTypingEffect("Enter your email to access your invoices", 35, 800);
  return (
    <p className="text-sm font-mono text-muted-foreground mb-12 text-center h-6">
      {displayed}
      {!done && <span className="typing-cursor">|</span>}
    </p>
  );
};

const InvoicePortal = () => {
  const [email, setEmail] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast({ title: "Payment successful", description: "Thank you for your payment." });
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
      toast({ title: "No account found", variant: "destructive" });
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
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
              Client Portal
            </span>
          </div>
          {client && (
            <button
              onClick={() => { setClient(null); setInvoices([]); setEmail(""); }}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em]"
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!client ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-mono font-bold text-foreground tracking-tight mb-4 text-center"
              >
                Invoices
              </motion.h1>
              <PortalSubtext />

              <motion.form
                onSubmit={handleEmailSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="w-full max-w-sm"
              >
                <div className="mb-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-transparent border-0 border-b border-border rounded-none font-mono text-center focus-visible:ring-0 focus-visible:border-foreground placeholder:text-muted-foreground/40"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12 font-mono text-xs uppercase tracking-[0.2em] rounded-none border-border hover:border-foreground hover:bg-transparent"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-4 w-4 border border-muted-foreground/30 border-t-foreground rounded-full"
                    />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
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
              {/* Welcome */}
              <div className="py-10 border-b border-border">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-2">
                  Welcome back
                </p>
                <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight">
                  {client.company_name}
                </h1>
              </div>

              {invoices.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm font-mono text-muted-foreground">No invoices available yet</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between py-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
                      Your Invoices
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {invoices.filter(i => i.status === "paid").length}/{invoices.length} paid
                    </span>
                  </div>

                  <div className="border-t border-border">
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border py-6"
                        >
                          {/* Row 1: Service + Price */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-mono font-semibold text-foreground">{inv.service}</h3>
                                <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${
                                  isPaid ? "text-emerald-500" : depositOverdue ? "text-destructive" : "text-primary"
                                }`}>
                                  {isPaid ? "PAID" : depositOverdue ? "OVERDUE" : depositPending ? "DEPOSIT DUE" : "PENDING"}
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-muted-foreground/50 mt-1">
                                Due {new Date(inv.due_date).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-2xl font-mono font-bold text-foreground tracking-tight">
                              ${inv.price.toLocaleString()}
                            </span>
                          </div>

                          {/* Breakdown */}
                          {inv.deposit_required && inv.deposit_amount && (
                            <div className="flex gap-6 text-[10px] font-mono text-muted-foreground mb-4 border-l-2 border-border pl-4 ml-0.5">
                              <span>
                                Deposit: ${inv.deposit_amount.toLocaleString()}
                                {inv.deposit_paid && (
                                  <CheckCircle className="inline h-3 w-3 text-emerald-500 ml-1 -mt-0.5" />
                                )}
                                {!inv.deposit_paid && inv.deposit_due_date && (
                                  <span className={depositOverdue ? " text-destructive" : ""}>
                                    {" "}· Due {new Date(inv.deposit_due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </span>
                              <span>
                                After completion: <strong className="text-foreground">${remainingBalance.toLocaleString()}</strong>
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          {!isPaid && (
                            <div className="flex gap-3">
                              {depositPending && (
                                <button
                                  onClick={() => handlePay(inv, true)}
                                  disabled={payingId === inv.id + "-dep"}
                                  className={`h-9 px-5 text-[10px] font-mono uppercase tracking-[0.15em] border rounded-none transition-colors flex items-center gap-2 ${
                                    depositOverdue
                                      ? "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                                  } disabled:opacity-50`}
                                >
                                  <CreditCard className="h-3 w-3" />
                                  {payingId === inv.id + "-dep" ? "Processing..." : `Pay Deposit — $${inv.deposit_amount?.toLocaleString()}`}
                                </button>
                              )}
                              {(!inv.deposit_required || inv.deposit_paid) && (
                                <button
                                  onClick={() => handlePay(inv, false)}
                                  disabled={payingId === inv.id}
                                  className="h-9 px-5 text-[10px] font-mono uppercase tracking-[0.15em] border border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                  <CreditCard className="h-3 w-3" />
                                  {payingId === inv.id ? "Processing..." : `Pay — $${remainingBalance.toLocaleString()}`}
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Branded footer */}
      <div className="border-t border-border mt-20">
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="RDG" className="h-10 opacity-30" />
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.3em] text-center">
            System managed by Reed Digital Group
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePortal;
