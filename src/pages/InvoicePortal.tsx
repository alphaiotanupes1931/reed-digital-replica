import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, CreditCard, FileText } from "lucide-react";
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
    <p className="text-lg font-mono text-foreground mb-12 text-center h-7">
      {displayed}
      {!done && <span className="typing-cursor">|</span>}
    </p>
  );
};

const InvoiceDocument = ({
  invoice,
  client,
  onPay,
  payingId,
}: {
  invoice: Invoice;
  client: Client;
  onPay: (inv: Invoice, deposit: boolean) => void;
  payingId: string | null;
}) => {
  const isPaid = invoice.status === "paid";
  const depositPending = invoice.deposit_required && !invoice.deposit_paid && !isPaid;
  const isOverdue = (d: string | null) => d ? new Date(d) < new Date() : false;
  const depositOverdue = depositPending && isOverdue(invoice.deposit_due_date);
  const remainingBalance = invoice.deposit_required && invoice.deposit_amount
    ? invoice.price - invoice.deposit_amount
    : invoice.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border mb-8"
    >
      {/* Invoice header */}
      <div className="border-b border-border p-6 md:p-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Invoice</span>
          </div>
          <p className="text-sm font-mono text-foreground mt-2">
            {new Date(invoice.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className={`text-sm font-mono font-bold uppercase tracking-[0.15em] ${
          isPaid ? "text-emerald-500" : depositOverdue ? "text-destructive" : "text-primary"
        }`}>
          {isPaid ? "PAID" : depositOverdue ? "OVERDUE" : depositPending ? "DEPOSIT DUE" : "PENDING"}
        </div>
      </div>

      {/* Bill To */}
      <div className="border-b border-border p-6 md:p-8 grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">Bill To</p>
          <p className="text-lg font-mono font-bold text-foreground">{client.company_name}</p>
          <p className="text-sm font-mono text-foreground mt-1">{client.email}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">From</p>
          <p className="text-lg font-mono font-bold text-foreground">Reed Digital Group</p>
          <p className="text-sm font-mono text-foreground mt-1">hello@reeddigitalgroup.com</p>
        </div>
      </div>

      {/* Line items */}
      <div className="border-b border-border">
        <div className="grid grid-cols-12 p-4 md:px-8 border-b border-border">
          <span className="col-span-8 text-xs font-mono text-primary uppercase tracking-[0.2em]">Description</span>
          <span className="col-span-4 text-xs font-mono text-primary uppercase tracking-[0.2em] text-right">Amount</span>
        </div>
        <div className="grid grid-cols-12 p-4 md:px-8 items-center">
          <span className="col-span-8 text-base font-mono text-foreground">{invoice.service}</span>
          <span className="col-span-4 text-base font-mono font-bold text-foreground text-right">
            ${invoice.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Deposit breakdown */}
      {invoice.deposit_required && invoice.deposit_amount && (
        <div className="border-b border-border p-4 md:px-8">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-mono text-foreground flex items-center gap-2">
              Deposit
              {invoice.deposit_paid && <CheckCircle className="h-4 w-4 text-emerald-500" />}
              {!invoice.deposit_paid && invoice.deposit_due_date && (
                <span className={`text-xs ${depositOverdue ? "text-destructive font-bold" : "text-foreground"}`}>
                  · Due {new Date(invoice.deposit_due_date).toLocaleDateString()}
                </span>
              )}
            </span>
            <span className="text-sm font-mono font-bold text-foreground">
              ${invoice.deposit_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-mono text-foreground">Balance Due After Completion</span>
            <span className="text-sm font-mono font-bold text-foreground">
              ${remainingBalance.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="p-6 md:p-8 flex justify-between items-center border-b border-border">
        <span className="text-lg font-mono font-bold text-foreground uppercase tracking-[0.2em]">Total</span>
        <span className="text-3xl font-mono font-bold text-foreground">${invoice.price.toLocaleString()}</span>
      </div>

      {/* Actions */}
      {!isPaid && (
        <div className="p-6 md:p-8 flex flex-wrap gap-3">
          {depositPending && (
            <button
              onClick={() => onPay(invoice, true)}
              disabled={payingId === invoice.id + "-dep"}
              className={`h-12 px-8 text-sm font-mono uppercase tracking-[0.15em] border rounded-none transition-colors flex items-center gap-3 ${
                depositOverdue
                  ? "border-destructive text-destructive hover:bg-destructive hover:text-background"
                  : "border-foreground text-foreground hover:bg-foreground hover:text-background"
              } disabled:opacity-50`}
            >
              <CreditCard className="h-4 w-4" />
              {payingId === invoice.id + "-dep" ? "Processing..." : `Pay Deposit — $${invoice.deposit_amount?.toLocaleString()}`}
            </button>
          )}
          {(!invoice.deposit_required || invoice.deposit_paid) && (
            <button
              onClick={() => onPay(invoice, false)}
              disabled={payingId === invoice.id}
              className="h-12 px-8 text-sm font-mono uppercase tracking-[0.15em] border border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors flex items-center gap-3 disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              {payingId === invoice.id ? "Processing..." : `Pay — $${remainingBalance.toLocaleString()}`}
            </button>
          )}
        </div>
      )}
    </motion.div>
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
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">
              Client Portal
            </span>
          </div>
          {client && (
            <button
              onClick={() => { setClient(null); setInvoices([]); setEmail(""); }}
              className="text-xs font-mono text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]"
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
                    className="h-14 bg-transparent border-0 border-b border-border rounded-none font-mono text-center text-base focus-visible:ring-0 focus-visible:border-foreground placeholder:text-foreground/30 text-foreground"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12 font-mono text-sm uppercase tracking-[0.2em] rounded-none border-border hover:border-foreground hover:bg-transparent text-foreground"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-4 w-4 border border-foreground/30 border-t-foreground rounded-full"
                    />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                <p className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-2">
                  Welcome back
                </p>
                <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight">
                  {client.company_name}
                </h1>
              </div>

              {invoices.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-lg font-mono text-foreground">No invoices available yet</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between py-6">
                    <span className="text-sm font-mono text-primary uppercase tracking-[0.3em]">
                      Your Invoices
                    </span>
                    <span className="text-sm font-mono text-foreground">
                      {invoices.filter(i => i.status === "paid").length}/{invoices.length} paid
                    </span>
                  </div>

                  {invoices.map((inv, i) => (
                    <InvoiceDocument
                      key={inv.id}
                      invoice={inv}
                      client={client}
                      onPay={handlePay}
                      payingId={payingId}
                    />
                  ))}

                  {/* Review & Support */}
                  <div className="border border-border p-6 md:p-8 mt-8">
                    <p className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-4">
                      We'd love your feedback
                    </p>
                    <p className="text-base font-mono text-foreground mb-6">
                      If you've enjoyed working with us, we'd really appreciate a review. It helps us grow and serve more businesses like yours.
                    </p>
                    <a
                      href="https://share.google/QzA1ri46KnQyE0a4M"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block h-12 px-8 text-sm font-mono uppercase tracking-[0.15em] border border-primary text-primary hover:bg-primary hover:text-background rounded-none transition-colors leading-[3rem] text-center"
                    >
                      Leave a Review
                    </a>

                    <div className="border-t border-border mt-8 pt-6">
                      <p className="text-sm font-mono text-foreground">
                        Need assistance? Reach out at{" "}
                        <a
                          href="mailto:reeddigitalgroup@gmail.com"
                          className="text-primary hover:underline"
                        >
                          reeddigitalgroup@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Branded footer */}
      <div className="border-t border-border mt-20">
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="RDG" className="h-10 opacity-40" />
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] text-center">
            System managed by Reed Digital Group
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePortal;
