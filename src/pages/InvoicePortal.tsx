import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSearchParams, Link } from "react-router-dom";
import logo from "@/assets/rdg-header-logo.png";

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
  message: string | null;
  deliverables: { label: string; url: string }[] | null;
  payment_method?: "stripe" | "zelle" | string | null;
}

const PROCESSING_FEE_RATE = 0.029;
const PROCESSING_FEE_FLAT = 0.30;

const InvoiceDetailsCard = ({
  invoice,
  clientName,
  clientEmail,
}: {
  invoice: Invoice;
  clientName: string;
  clientEmail: string;
}) => {
  const isPaid = invoice.status === "paid";
  const depositPending = invoice.deposit_required && !invoice.deposit_paid && !isPaid;
  const basePrice = invoice.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-foreground mb-6 bg-background"
    >
      {/* Header */}
      <div className="border-b-2 border-foreground p-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="RDG" className="h-6" />
          <span className="text-xs font-mono text-foreground uppercase tracking-widest">Invoice</span>
        </div>
        {isPaid ? (
          <span className="text-xl font-mono font-black uppercase tracking-widest text-emerald-500 border-2 border-emerald-500 px-3 py-1">
            PAID
          </span>
        ) : (
          <span className="text-sm font-mono font-bold uppercase tracking-widest text-primary">
            {depositPending ? "DEPOSIT DUE" : "PENDING"}
          </span>
        )}
      </div>

      {/* Bill To / From */}
      <div className="border-b-2 border-foreground p-6 grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Bill To</p>
          <p className="text-lg font-mono font-bold text-foreground">{clientName}</p>
          <p className="text-sm font-mono text-foreground">{clientEmail}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">From</p>
          <p className="text-lg font-mono font-bold text-foreground">Reed Digital Group</p>
          <p className="text-sm font-mono text-foreground">reeddigitalgroup@gmail.com</p>
        </div>
      </div>

      {/* Line items */}
      <div className="p-6">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm font-mono text-foreground">{invoice.service}</span>
          <span className="text-sm font-mono font-bold text-foreground">${basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-mono font-bold text-foreground">Total</span>
          <span className="text-2xl font-mono font-bold text-foreground">${basePrice.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentOptions = ({
  invoice,
  onPay,
  payingId,
  zelleHandle,
  bizMethods,
}: {
  invoice: Invoice;
  onPay: (inv: Invoice, deposit: boolean) => void;
  payingId: string | null;
  zelleHandle?: string | null;
  bizMethods?: string[] | null;
}) => {
  const isPaid = invoice.status === "paid";
  const depositPending = invoice.deposit_required && !invoice.deposit_paid && !isPaid;

  // Prefer the business's current profile setting so toggling Zelle/Stripe in
  // the profile applies to every invoice. Fall back to per-invoice override.
  const methods =
    bizMethods && bizMethods.length > 0
      ? bizMethods.map((m) => m.trim().toLowerCase()).filter(Boolean)
      : (invoice.payment_method || "stripe")
          .split(",")
          .map((m) => m.trim().toLowerCase())
          .filter(Boolean);
  const allowStripe = methods.includes("stripe");
  const allowZelle = methods.includes("zelle");

  const baseAmount = depositPending && invoice.deposit_amount
    ? invoice.deposit_amount
    : invoice.deposit_required && invoice.deposit_paid && invoice.deposit_amount
    ? invoice.price - invoice.deposit_amount
    : invoice.price;

  const stripeFee = Math.round((baseAmount * PROCESSING_FEE_RATE + PROCESSING_FEE_FLAT) * 100) / 100;
  const stripeTotal = Math.round((baseAmount + stripeFee) * 100) / 100;
  const zelleTotal = baseAmount;

  const zelleUrl = zelleHandle && zelleHandle.trim().length > 0
    ? `mailto:${encodeURIComponent(zelleHandle)}?subject=${encodeURIComponent("Zelle payment — " + invoice.service)}`
    : "https://www.zellepay.com/";

  const zelleSuffix = depositPending ? "-dep" : "-once";
  const stripeSuffix = depositPending ? "-dep" : "-once";

  if (isPaid) return null;

  if (depositPending) {
    return (
      <div className="mb-8">
        <button
          onClick={() => onPay(invoice, true)}
          disabled={payingId === invoice.id + "-dep"}
          className="w-full h-14 text-sm font-mono uppercase tracking-widest border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
        >
          {payingId === invoice.id + "-dep" ? "Processing..." : `Pay Deposit — $${invoice.deposit_amount?.toLocaleString()}`}
        </button>
      </div>
    );
  }

  const both = allowZelle && allowStripe;

  return (
    <div className={`mb-8 grid gap-4 ${both ? "md:grid-cols-[1fr_auto_1fr] items-stretch" : "grid-cols-1"}`}>
      {/* Zelle Card */}
      {allowZelle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-foreground bg-background p-6 flex flex-col"
        >
          <div className="flex-1">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Pay with</p>
            <h3 className="text-2xl font-mono font-bold text-foreground mb-1">Zelle</h3>
            <p className="text-3xl font-mono font-bold text-foreground mb-2">${zelleTotal.toLocaleString()}</p>
            <p className="text-xs font-mono text-emerald-500">No processing fee</p>
            {zelleHandle && (
              <p className="text-xs font-mono text-muted-foreground mt-1">Send to: {zelleHandle}</p>
            )}
          </div>
          <a
            href={zelleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full h-14 text-sm font-mono uppercase tracking-widest border-2 border-foreground bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center justify-center"
          >
            Pay with Zelle
          </a>
        </motion.div>
      )}

      {/* OR Divider */}
      {both && (
        <div className="flex items-center justify-center">
          <span className="text-4xl md:text-5xl font-mono font-black text-primary tracking-tight">OR</span>
        </div>
      )}

      {/* Stripe Card */}
      {allowStripe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-foreground bg-background p-6 flex flex-col"
        >
          <div className="flex-1">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Pay with</p>
            <h3 className="text-2xl font-mono font-bold text-foreground mb-1">Card (Stripe)</h3>
            <p className="text-3xl font-mono font-bold text-foreground mb-2">${stripeTotal.toLocaleString()}</p>
            <p className="text-xs font-mono text-destructive font-bold">Includes ${stripeFee.toLocaleString()} processing fee</p>
          </div>
          <button
            onClick={() => onPay(invoice, false)}
            disabled={payingId === invoice.id + stripeSuffix}
            className="mt-6 w-full h-14 text-sm font-mono uppercase tracking-widest border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {payingId === invoice.id + stripeSuffix
              ? "Processing..."
              : "Pay with Card (Stripe)"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

const InvoiceDocument = ({
  invoice,
  clientName,
  clientEmail,
  onPay,
  payingId,
  zelleHandle,
  bizMethods,
}: {
  invoice: Invoice;
  clientName: string;
  clientEmail: string;
  onPay: (inv: Invoice, deposit: boolean) => void;
  payingId: string | null;
  zelleHandle?: string | null;
  bizMethods?: string[] | null;
}) => {
  return (
    <div className="mb-12">
      <InvoiceDetailsCard
        invoice={invoice}
        clientName={clientName}
        clientEmail={clientEmail}
      />
      <PaymentOptions
        invoice={invoice}
        onPay={onPay}
        payingId={payingId}
        zelleHandle={zelleHandle}
        bizMethods={bizMethods}
      />
    </div>
  );
};

const InvoicePortal = () => {
  const [email, setEmail] = useState(() => localStorage.getItem("portal-email") || "");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  type Business = {
    user_id: string;
    business_name: string;
    owner_name: string | null;
    zelle_handle?: string | null;
    cashapp_handle?: string | null;
    payment_methods?: string[] | null;
  };
  const [bizCode, setBizCode] = useState(() => localStorage.getItem("portal-biz-code") || "");
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  const [bizLookupLoading, setBizLookupLoading] = useState(false);
  const [bizError, setBizError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const lookupBusiness = async (code: string): Promise<Business | null> => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setSelectedBiz(null);
      setBizError(null);
      return null;
    }
    setBizLookupLoading(true);
    setBizError(null);
    const { data, error } = await supabase.rpc("lookup_business_by_code", { p_code: c });
    setBizLookupLoading(false);
    if (error || !Array.isArray(data) || data.length === 0) {
      setSelectedBiz(null);
      setBizError("No business found");
      return null;
    }
    const biz = data[0] as Business;
    setSelectedBiz(biz);
    setBizError(null);
    localStorage.setItem("portal-biz-code", c);
    return biz;
  };

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast({ title: "Payment successful", description: "Thank you." });
    }
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      const savedCode = localStorage.getItem("portal-biz-code");
      const savedEmail = localStorage.getItem("portal-email");
      if (!savedCode || !savedEmail) return;
      const biz = await lookupBusiness(savedCode);
      if (biz) await loadClientData(savedEmail, biz, false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClientData = async (emailAddr: string, biz: Business, showError = true) => {
    const addr = emailAddr.toLowerCase().trim();
    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("email", addr)
      .eq("owner_user_id", biz.user_id)
      .maybeSingle();

    if (!clientData) {
      if (showError) toast({ title: "No account found", description: `No invoices for ${addr}.`, variant: "destructive" });
      localStorage.removeItem("portal-email");
      return false;
    }

    setClientName(clientData.company_name || clientData.owner_name || "");
    setClientEmail(clientData.email);
    localStorage.setItem("portal-email", addr);
    const { data: invData } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientData.id)
      .eq("deactivated", false)
      .in("status", ["approved", "sent", "paid"])
      .order("created_at", { ascending: false });

    setInvoices((invData as unknown as Invoice[]) || []);
    setLoggedIn(true);
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBiz) {
      setBizError("Enter business ID first");
      return;
    }
    setLoading(true);
    await loadClientData(email, selectedBiz);
    setLoading(false);
  };

  const handlePay = async (invoice: Invoice, payDeposit: boolean) => {
    const suffix = payDeposit ? "-dep" : "-once";
    setPayingId(invoice.id + suffix);
    try {
      const res = await supabase.functions.invoke("create-checkout", {
        body: {
          invoice_id: invoice.id,
          pay_deposit: payDeposit,
          payment_type: "one_time",
        },
      });
      if (res.error) throw res.error;
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err: any) {
      toast({ title: "Payment error", description: err.message, variant: "destructive" });
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
      </div>

      {/* Top bar */}
      <div className="border-b border-border relative z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <img src={logo} alt="RDG" className="h-5" />
            <span className="text-xs font-mono text-foreground uppercase tracking-widest">Pay Invoice</span>
          </Link>
          {loggedIn && (
            <button
              onClick={() => {
                localStorage.removeItem("portal-email");
                localStorage.removeItem("portal-biz-code");
                setLoggedIn(false);
                setInvoices([]);
                setEmail("");
                setBizCode("");
                setSelectedBiz(null);
              }}
              className="text-xs font-mono text-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!loggedIn ? (
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
                className="text-5xl md:text-7xl font-mono font-bold text-foreground tracking-tight mb-2 text-center"
              >
                Pay Invoice
              </motion.h1>
              <p className="text-sm font-mono text-muted-foreground mb-12 text-center">Enter your info to see your bill.</p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-sm mb-6"
              >
                <p className="text-xs font-mono text-muted-foreground text-center mb-2">Business ID</p>
                <Input
                  type="text"
                  inputMode="text"
                  autoCapitalize="characters"
                  placeholder="ABCD1234"
                  value={bizCode}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
                    setBizCode(v);
                    setSelectedBiz(null);
                    setBizError(null);
                    if (v.length === 8) lookupBusiness(v);
                  }}
                  className="h-12 text-center font-mono tracking-[0.4em] text-base rounded-none border-border focus-visible:border-foreground"
                />
                <div className="mt-2 min-h-[1.25rem] text-center text-xs font-mono">
                  {bizLookupLoading && <span className="text-muted-foreground">Looking up...</span>}
                  {!bizLookupLoading && selectedBiz && (
                    <span className="text-primary">Paying: <span className="font-bold text-foreground">{selectedBiz.business_name}</span></span>
                  )}
                  {!bizLookupLoading && bizError && <span className="text-destructive">{bizError}</span>}
                  {!bizLookupLoading && !selectedBiz && !bizError && (
                    <span className="text-muted-foreground">Ask for the 8-character ID.</span>
                  )}
                </div>
              </motion.div>

              <motion.form
                onSubmit={handleEmailSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
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
                  disabled={loading || !selectedBiz}
                  variant="outline"
                  className="w-full h-12 font-mono text-sm uppercase tracking-widest rounded-none border-border hover:border-foreground hover:bg-transparent text-foreground"
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
              <div className="py-10 border-b border-border">
                <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground tracking-tight">
                  {clientName ? `Hi, ${clientName}` : "Hi"}
                </h1>
                <p className="text-sm font-mono text-muted-foreground mt-1">{clientEmail}</p>
              </div>

              {invoices.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-border mt-8">
                  <p className="text-2xl font-mono font-bold text-foreground">No invoice yet</p>
                  <p className="text-sm font-mono text-muted-foreground mt-2">Check back soon.</p>
                </div>
              ) : (
                <div className="pt-6">
                  {invoices.map((inv) => (
                    <InvoiceDocument
                      key={inv.id}
                      invoice={inv}
                      clientName={clientName}
                      clientEmail={clientEmail}
                      onPay={handlePay}
                      payingId={payingId}
                      zelleHandle={selectedBiz?.zelle_handle ?? null}
                      bizMethods={selectedBiz?.payment_methods ?? null}
                    />
                  ))}
                </div>
              )}

              <div className="border-t border-border mt-12 py-8 text-center">
                <p className="text-xs font-mono text-muted-foreground">
                  Need help? Email <a href="mailto:reeddigitalgroup@gmail.com" className="text-primary hover:underline">reeddigitalgroup@gmail.com</a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvoicePortal;
