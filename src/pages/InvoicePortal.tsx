import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSearchParams, Link } from "react-router-dom";
import logo from "@/assets/rdg-header-logo.png";
import { GlossaryChatbot } from "@/components/GlossaryChatbot";

interface Phase {
  name: string;
  status: "pending" | "in_progress" | "complete";
}

interface SowComment {
  author: "client" | "admin";
  message: string;
  created_at: string;
}

interface Client {
  id: string;
  company_name: string;
  email: string;
  owner_name: string | null;
  scope_of_work: string | null;
  phases: Phase[] | null;
  sow_status: "pending" | "approved" | "rejected" | string;
  sow_comments: SowComment[] | null;
}

interface Deliverable {
  label: string;
  url: string;
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
  message: string | null;
  deliverables: Deliverable[] | null;
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
        {isPaid ? (
          <div className="border-4 border-red-600 rounded-sm px-4 py-1 transform rotate-[-8deg]">
            <span className="text-2xl font-mono font-black uppercase tracking-[0.2em] text-red-600">
              PAID
            </span>
          </div>
        ) : (
          <div className={`text-sm font-mono font-bold uppercase tracking-[0.15em] ${
            depositOverdue ? "text-destructive" : "text-foreground"
          }`}>
            {depositOverdue ? "OVERDUE" : depositPending ? "DEPOSIT DUE" : "PENDING"}
          </div>
        )}
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
              ${remainingTotal.toLocaleString()}
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
        <div className="p-6 md:p-8 space-y-4">
          <p className="text-xs font-mono text-foreground uppercase tracking-[0.2em] mb-2">Pay with Card</p>
          <div className="flex flex-wrap gap-3">
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
                {payingId === invoice.id ? "Processing..." : `Pay — $${remainingTotal.toLocaleString()}`}
              </button>
            )}
          </div>

          <div className="border-t border-foreground/20 pt-4">
            <p className="text-xs font-mono text-foreground uppercase tracking-[0.2em] mb-3">Or Pay via Zelle / CashApp</p>
            <div className="bg-foreground/5 border border-foreground/20 p-4 space-y-2">
              <p className="text-sm font-mono text-foreground">
                Send payment to: <span className="font-bold">reeddigitalgroup@gmail.com</span>
              </p>
              <p className="text-xs font-mono text-foreground/70">
                Please include your company name and invoice service in the memo. Once payment is received, your invoice will be updated within 1–2 business days.
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiUkVFRCBESUdJVEFMIEdST1VQIiwidG9rZW4iOiJpbmZvQHJlZWRkaWdpdGFsZ3JvdXAuY29tIiwiYWN0aW9uIjoicGF5bWVudCJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-6 text-xs font-mono uppercase tracking-[0.15em] border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors flex items-center gap-2"
                >
                  Zelle
                </a>
                <a
                  href="https://cash.app/login?email=reeddigitalgroup@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-6 text-xs font-mono uppercase tracking-[0.15em] border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none transition-colors flex items-center gap-2"
                >
                  CashApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const extractGreetingName = (client: Client): string => {
  const raw = (client.owner_name || client.company_name || "").trim();
  return raw || "there";
};

const WelcomeBlock = ({ client }: { client: Client }) => {
  const firstName = extractGreetingName(client);
  const greeting = `Welcome, ${firstName}`;
  const { displayed, done } = useTypingEffect(greeting, 60, 200);
  return (
    <>
      <p className="text-sm font-mono text-primary uppercase tracking-[0.3em] mb-2">
        Client Portal
      </p>
      <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight min-h-[1.2em]">
        {displayed}
        {!done && <span className="typing-cursor">|</span>}
      </h1>
      <p className="text-sm font-mono text-muted-foreground mt-2">{client.company_name}</p>
    </>
  );
};

const PhaseTracker = ({ phases }: { phases: Phase[] }) => {
  const completed = phases.filter((p) => p.status === "complete").length;
  const pct = phases.length ? Math.round((completed / phases.length) * 100) : 0;
  return (
    <div className="mt-10 border-2 border-foreground p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Project Progress</p>
        <p className="text-xs font-mono text-foreground">{completed}/{phases.length} · {pct}%</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-foreground/10 mb-8 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-primary"
        />
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase, i) => {
          const isComplete = phase.status === "complete";
          const isActive = phase.status === "in_progress";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <div className={`w-8 h-8 border-2 flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                isComplete
                  ? "bg-foreground text-background border-foreground"
                  : isActive
                  ? "border-primary text-primary"
                  : "border-foreground/30 text-foreground/30"
              }`}>
                {isComplete ? "✓" : String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className={`text-base font-mono ${
                  isComplete ? "text-foreground" : isActive ? "text-foreground font-bold" : "text-foreground/50"
                }`}>
                  {phase.name}
                </span>
                <span className={`text-xs font-mono uppercase tracking-[0.15em] ${
                  isComplete ? "text-emerald-500" : isActive ? "text-primary" : "text-foreground/40"
                }`}>
                  {phase.status === "in_progress" ? "In Progress" : phase.status === "complete" ? "Complete" : "Pending"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const SowReview = ({ client, onChange }: { client: Client; onChange: () => void | Promise<void> }) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const status = client.sow_status || "pending";
  const comments: SowComment[] = Array.isArray(client.sow_comments) ? client.sow_comments : [];

  const callApi = async (body: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const res = await supabase.functions.invoke("sow-response", {
        body: { email: client.email, ...body },
      });
      if (res.error) throw res.error;
      const errData = (res.data as { error?: string } | null)?.error;
      if (errData) throw new Error(errData);
      await onChange();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = () => callApi({ action: "set_status", status: "approved" });
  const handleReject = () => callApi({ action: "set_status", status: "rejected" });
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await callApi({ action: "add_comment", message: comment });
    setComment("");
    toast({ title: "Comment sent" });
  };

  const statusBadge =
    status === "approved"
      ? "bg-emerald-500 text-background"
      : status === "rejected"
      ? "bg-destructive text-destructive-foreground"
      : "bg-foreground text-background";
  const statusLabel = status === "approved" ? "Approved" : status === "rejected" ? "Changes Requested" : "Awaiting Review";

  const sowText = client.scope_of_work || "";
  const isLong = sowText.length > 320;
  const [expanded, setExpanded] = useState(!isLong);

  return (
    <div className="mt-10 border-2 border-foreground p-6 md:p-10 bg-background">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Scope of Work</p>
        <span className={`text-[11px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 ${statusBadge}`}>
          {statusLabel}
        </span>
      </div>

      <p className="text-base font-mono text-muted-foreground leading-relaxed mb-6">
        This is the plan for your project — what we'll build, what's included, and what to expect. Read it over, leave a comment if anything is unclear, and approve when you're happy.
      </p>

      <div className={`relative ${!expanded && isLong ? "max-h-48 overflow-hidden" : ""}`}>
        <p className="text-lg font-mono text-foreground leading-[1.85] whitespace-pre-wrap">
          {sowText}
        </p>
        {!expanded && isLong && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 text-base font-mono text-primary hover:text-foreground transition-colors underline underline-offset-4"
        >
          {expanded ? "Show less" : "Read full scope →"}
        </button>
      )}

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-base font-mono text-foreground mb-4">
          Ready to move forward?
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleApprove}
            disabled={submitting || status === "approved"}
            className="h-14 px-8 font-mono text-base rounded-none bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40"
          >
            {status === "approved" ? "✓ Approved" : "Approve Scope"}
          </Button>
          <Button
            onClick={handleReject}
            disabled={submitting || status === "rejected"}
            variant="outline"
            className="h-14 px-8 font-mono text-base rounded-none border-2 border-foreground hover:border-destructive hover:text-destructive disabled:opacity-40"
          >
            {status === "rejected" ? "Changes Requested" : "Request Changes"}
          </Button>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-base font-mono text-foreground mb-2 font-bold">
          Questions or comments?
        </p>
        <p className="text-sm font-mono text-muted-foreground mb-5">
          Leave a note below and we'll respond as soon as possible.
        </p>

        {comments.length > 0 && (
          <div className="space-y-5 mb-6 max-h-80 overflow-y-auto pr-2">
            {comments.map((c, i) => (
              <div key={i} className="border-l-2 border-primary pl-5 py-1">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary font-bold">
                    {c.author === "admin" ? "Reed Digital Group" : "You"}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-base font-mono text-foreground leading-relaxed whitespace-pre-wrap">{c.message}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleComment} className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your question or comment here..."
            rows={4}
            maxLength={2000}
            className="w-full bg-transparent border-2 border-border focus:border-foreground p-4 font-mono text-base text-foreground placeholder:text-foreground/40 focus:outline-none resize-none leading-relaxed"
          />
          <Button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="h-14 px-8 font-mono text-base rounded-none disabled:opacity-40"
          >
            {submitting ? "Sending..." : "Send Comment"}
          </Button>
        </form>
      </div>
    </div>
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

  const loadClientData = async (emailAddr: string, showError = true) => {
    const addr = emailAddr.toLowerCase().trim();
    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("email", addr)
      .maybeSingle();

    if (!clientData) {
      if (showError) toast({ title: "No account found", variant: "destructive" });
      return false;
    }

    setClient(clientData as unknown as Client);
    const { data: invData } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientData.id)
      .in("status", ["approved", "sent", "paid"])
      .order("created_at", { ascending: false });

    setInvoices((invData as unknown as Invoice[]) || []);
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loadClientData(email);
    setLoading(false);
  };

  const refreshClient = async () => {
    if (client?.email) await loadClientData(client.email, false);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Faded background logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src={logo} alt="" className="w-[500px] md:w-[700px] opacity-[0.03]" />
      </div>
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:opacity-70 transition-opacity">
            <img src={logo} alt="RDG" className="h-6" />
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.3em]">
              Client Portal
            </span>
          </Link>
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
                <em>Invoices</em>{" "}
                <span className="text-lg md:text-2xl text-primary font-normal">by RDG</span>
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
                <WelcomeBlock client={client} />

                {/* Special message */}
                {invoices.some(inv => inv.message) && (
                  <div className="mt-6 border-2 border-primary/30 p-5">
                    <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3">
                      You have a special message
                    </p>
                    {invoices.filter(inv => inv.message).map(inv => (
                      <p key={inv.id} className="text-sm font-mono text-foreground leading-relaxed">
                        {inv.message}
                      </p>
                    ))}
                  </div>
                )}

                {/* Scope of Work + Review */}
                {client.scope_of_work && (
                  <SowReview client={client} onChange={refreshClient} />
                )}

                {/* Phase Progress Tracker */}
                {client.phases && client.phases.length > 0 && (
                  <PhaseTracker phases={client.phases} />
                )}
              </div>

              {invoices.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-border mt-8">
                  <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3">Status</p>
                  <p className="text-2xl font-mono font-bold text-foreground">Invoice is not ready</p>
                  <p className="text-sm font-mono text-muted-foreground mt-3 max-w-md mx-auto">
                    Your invoice hasn't been issued yet. You'll see it here as soon as it's prepared. Check back soon.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="pt-6 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-foreground uppercase tracking-[0.3em]">
                        Your Invoices
                      </span>
                      <span className="text-sm font-mono text-foreground">
                        {invoices.filter(i => i.status === "paid").length}/{invoices.length} paid
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground leading-relaxed mt-3 italic max-w-xl">
                      An invoice is your itemized bill for the work agreed in the Scope of Work. Pay securely with a card, Zelle, or CashApp. Once a payment clears, the status updates and any deliverables become available.
                    </p>
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

                  {/* Project Deliverables — separate section */}
                  {invoices.some(inv => inv.status === "paid") && (
                    <div className="border-2 border-foreground p-6 md:p-8 mt-8">
                      <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">
                        Project Deliverables
                      </p>
                      <h2 className="text-2xl font-mono font-bold text-foreground tracking-tight mb-4">
                        Your Files & Links
                      </h2>
                      {(() => {
                        const allDeliverables = invoices
                          .filter(inv => inv.status === "paid" && inv.deliverables && inv.deliverables.length > 0)
                          .flatMap(inv => inv.deliverables!.map(d => ({ ...d, service: inv.service })));
                        
                        return allDeliverables.length > 0 ? (
                          <div className="space-y-3">
                            {allDeliverables.map((d, i) => (
                              <a
                                key={i}
                                href={d.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 border border-border hover:border-foreground transition-colors group"
                              >
                                <span className="w-8 h-8 border-2 border-foreground group-hover:border-primary group-hover:text-primary flex items-center justify-center text-sm font-bold shrink-0">↗</span>
                                <div>
                                  <span className="text-sm font-mono font-bold text-foreground group-hover:text-primary transition-colors">{d.label}</span>
                                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{d.service}</p>
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm font-mono text-muted-foreground">
                            Your project deliverables (source code, documentation, design assets, etc.) will appear here once they are ready.
                          </p>
                        );
                      })()}
                    </div>
                  )}

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
          <p className="text-xs font-mono text-muted-foreground text-center">
            If you are having issues, please contact{" "}
            <a href="mailto:reeddigitalgroup@gmail.com" className="text-primary hover:underline">reeddigitalgroup@gmail.com</a>
            {" "}or{" "}
            <a href="mailto:reeddigitalgroup@gmail.com" className="text-primary hover:underline">reeddigitalgroup@gmail.com</a>
          </p>
        </div>
      </div>
      {client && <GlossaryChatbot />}
    </div>
  );
};

export default InvoicePortal;
