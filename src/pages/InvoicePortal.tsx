import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

const PROCESSING_FEE_RATE = 0.029;
const PROCESSING_FEE_FLAT = 0.30;

const PortalSubtext = () => {
  const { displayed, done } = useTypingEffect("Enter your email to access your invoices", 35, 800);
  return (
    <p className="text-lg font-mono text-foreground mb-12 text-center h-7">
      {displayed}
      {!done && <span className="typing-cursor">|</span>}
    </p>
  );
};

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

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

  // The stored price IS the base service price
  // Fee is calculated on top for display
  const basePrice = invoice.price;
  const feeAmount = Math.round((basePrice * PROCESSING_FEE_RATE + PROCESSING_FEE_FLAT) * 100) / 100;
  const totalPrice = Math.round((basePrice + feeAmount) * 100) / 100;

  const baseDeposit = invoice.deposit_amount
    ? Math.round((invoice.deposit_amount / (1 + PROCESSING_FEE_RATE)) * 100) / 100
    : null;
  const depositFee = invoice.deposit_amount && baseDeposit
    ? Math.round((invoice.deposit_amount - baseDeposit) * 100) / 100
    : null;

  const remainingBase = invoice.deposit_required && invoice.deposit_amount
    ? invoice.price - invoice.deposit_amount
    : invoice.price;
  const remainingFee = Math.round((remainingBase * PROCESSING_FEE_RATE + PROCESSING_FEE_FLAT) * 100) / 100;
  const remainingTotal = Math.round((remainingBase + remainingFee) * 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-foreground mb-8 bg-background"
    >
      {/* Invoice header with logo */}
      <div className="border-b-2 border-foreground p-6 md:p-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Reed Digital Group" className="h-8" />
          <div>
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">Invoice</span>
            <p className="text-sm font-mono text-foreground mt-1">
              {new Date(invoice.created_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className={`text-sm font-mono font-bold uppercase tracking-[0.15em] ${
          isPaid ? "text-emerald-500" : depositOverdue ? "text-destructive" : "text-foreground"
        }`}>
          {isPaid ? "PAID" : depositOverdue ? "OVERDUE" : depositPending ? "DEPOSIT DUE" : "PENDING"}
        </div>
      </div>

      {/* Bill To / From */}
      <div className="border-b-2 border-foreground p-6 md:p-8 grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-2">Bill To</p>
          <p className="text-lg font-mono font-bold text-foreground">{client.company_name}</p>
          <p className="text-sm font-mono text-foreground mt-1">{client.email}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-foreground uppercase tracking-[0.3em] mb-2">From</p>
          <p className="text-lg font-mono font-bold text-foreground">Reed Digital Group</p>
          <p className="text-sm font-mono text-foreground mt-1">reeddigitalgroup@gmail.com</p>
        </div>
      </div>

      {/* Line items */}
      <div className="border-b-2 border-foreground">
        <div className="grid grid-cols-12 p-4 md:px-8 border-b border-foreground/30">
          <span className="col-span-8 text-xs font-mono text-foreground uppercase tracking-[0.2em]">Description</span>
          <span className="col-span-4 text-xs font-mono text-foreground uppercase tracking-[0.2em] text-right">Amount</span>
        </div>
        <div className="grid grid-cols-12 p-4 md:px-8 items-center border-b border-foreground/20">
          <span className="col-span-8 text-base font-mono text-foreground">{invoice.service}</span>
          <span className="col-span-4 text-base font-mono font-bold text-foreground text-right">
            ${basePrice.toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-12 p-4 md:px-8 items-center">
          <span className="col-span-8 text-sm font-mono text-foreground">Infrastructure & Setup Fee</span>
          <span className="col-span-4 text-sm font-mono text-foreground text-right">
            ${feeAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Deposit breakdown */}
      {invoice.deposit_required && invoice.deposit_amount && (
        <div className="border-b-2 border-foreground p-4 md:px-8">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-mono text-foreground flex items-center gap-2">
              Deposit
              {invoice.deposit_paid && <span className="text-emerald-500 font-bold">✓</span>}
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
      <div className="p-6 md:p-8 flex justify-between items-center border-b-2 border-foreground">
        <span className="text-lg font-mono font-bold text-foreground uppercase tracking-[0.2em]">Total</span>
        <span className="text-3xl font-mono font-bold text-foreground">${totalPrice.toLocaleString()}</span>
      </div>

      {/* Actions */}
      {!isPaid && (
        <div className="p-6 md:p-8 flex flex-wrap gap-3">
          {depositPending && (
            <button
              onClick={() => onPay(invoice, true)}
              disabled={payingId === invoice.id + "-dep"}
              className={`h-12 px-8 text-sm font-mono uppercase tracking-[0.15em] border-2 rounded-none transition-colors flex items-center gap-3 ${
                depositOverdue
                  ? "border-destructive text-destructive hover:bg-destructive hover:text-background"
                  : "border-foreground text-foreground hover:bg-foreground hover:text-background"
              } disabled:opacity-50`}
            >
              {payingId === invoice.id + "-dep" ? "Processing..." : `Pay Deposit — $${invoice.deposit_amount?.toLocaleString()}`}
            </button>
          )}
          {(!invoice.deposit_required || invoice.deposit_paid) && (
            <button
              onClick={() => onPay(invoice, false)}
              disabled={payingId === invoice.id}
              className="h-12 px-8 text-sm font-mono uppercase tracking-[0.15em] border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors flex items-center gap-3 disabled:opacity-50"
            >
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
                    <span className="text-sm font-mono text-foreground uppercase tracking-[0.3em]">
                      Your Invoices
                    </span>
                    <span className="text-sm font-mono text-foreground">
                      {invoices.filter(i => i.status === "paid").length}/{invoices.length} paid
                    </span>
                  </div>

                  {invoices.map((inv) => (
                    <InvoiceDocument
                      key={inv.id}
                      invoice={inv}
                      client={client}
                      onPay={handlePay}
                      payingId={payingId}
                    />
                  ))}

                  {/* Review & Support */}
                  <div className="border-2 border-foreground p-6 md:p-8 mt-8">
                    <p className="text-sm font-mono text-foreground uppercase tracking-[0.3em] mb-4">
                      We'd love your feedback
                    </p>
                    <p className="text-base font-mono text-foreground mb-6">
                      If you've enjoyed working with us, we'd really appreciate a review. It helps us grow and serve more businesses like yours.
                    </p>
                    <a
                      href="https://share.google/QzA1ri46KnQyE0a4M"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 h-12 px-8 text-sm font-mono uppercase tracking-[0.15em] border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors"
                    >
                      <GoogleLogo />
                      Leave a Review
                    </a>

                    <div className="border-t border-foreground/30 mt-8 pt-6">
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
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Branded footer */}
      <div className="border-t border-border mt-20">
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="RDG" className="h-10 opacity-40" />
          <p className="text-xs font-mono text-foreground uppercase tracking-[0.3em] text-center">
            System managed by Reed Digital Group
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePortal;
