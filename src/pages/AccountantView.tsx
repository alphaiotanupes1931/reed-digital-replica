import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ViewData {
  published: boolean;
  sections: { bills: boolean; invoices: boolean; writeoffs: boolean; notes: boolean };
  owner: { full_name: string | null; business_name: string | null } | null;
  bills?: Array<{ id: string; company_name: string; price: number; notes: string | null }>;
  invoices?: Array<{ id: string; amount: number; status: string; paid_at: string | null; created_at: string; description: string | null }>;
  notes?: Array<{ id: string; content: string; note_type: string; note_date: string }>;
  writeoffs?: unknown[];
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const AccountantView = () => {
  const { token } = useParams<{ token: string }>();
  const [passcode, setPasscode] = useState("");
  const [data, setData] = useState<ViewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!token || !passcode) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/accountant-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        body: JSON.stringify({ token, passcode }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not load");
      } else {
        setData(json);
        sessionStorage.setItem(`acc-${token}`, passcode);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const saved = token ? sessionStorage.getItem(`acc-${token}`) : null;
    if (saved) {
      setPasscode(saved);
      // auto-submit
      setTimeout(() => {
        (document.getElementById("acc-form") as HTMLFormElement | null)?.requestSubmit();
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const ownerName = data?.owner?.business_name || data?.owner?.full_name || "Owner";

  if (!data) {
    return (
      <div className="min-h-screen bg-background font-mono flex items-center justify-center px-6">
        <form id="acc-form" onSubmit={submit} className="w-full max-w-sm border-2 border-foreground/20 p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Accountant access</p>
            <h1 className="text-2xl font-bold mt-2">Enter passcode</h1>
            <p className="text-xs text-muted-foreground mt-2">6-digit passcode shared by the account owner.</p>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
            className="text-center text-xl tracking-widest"
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting || passcode.length < 6}>
            {submitting ? "CHECKING…" : "VIEW FINANCES"}
          </Button>
        </form>
      </div>
    );
  }

  const billsTotal = (data.bills ?? []).reduce((s, b) => s + Number(b.price || 0), 0);
  const paidInvoices = (data.invoices ?? []).filter((i) => i.status === "paid");
  const revenueTotal = paidInvoices.reduce((s, i) => s + Number(i.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <main className="pt-16 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Accountant view</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">{ownerName}</h1>
            <p className="text-xs text-muted-foreground mt-2">Read-only · scoped to sections the owner has published.</p>

            <div className="mt-12 space-y-12">
              {data.sections.invoices && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Revenue · {paidInvoices.length} paid invoices</h2>
                  <div className="border-2 border-foreground/20 p-6">
                    <p className="text-3xl font-bold">${revenueTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total received</p>
                    {paidInvoices.length > 0 && (
                      <ul className="mt-6 divide-y-2 divide-foreground/10">
                        {paidInvoices.slice(0, 50).map((inv) => (
                          <li key={inv.id} className="py-3 flex justify-between text-sm">
                            <span>{inv.description || "Invoice"}</span>
                            <span className="font-bold">${Number(inv.amount).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              )}

              {data.sections.bills && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Monthly bills</h2>
                  <div className="border-2 border-foreground/20 p-6">
                    <p className="text-3xl font-bold">${billsTotal.toFixed(2)}/mo</p>
                    <ul className="mt-6 divide-y-2 divide-foreground/10">
                      {(data.bills ?? []).map((b) => (
                        <li key={b.id} className="py-3 flex justify-between text-sm">
                          <span>{b.company_name}</span>
                          <span className="font-bold">${Number(b.price).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {data.sections.writeoffs && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Write-offs</h2>
                  <div className="border-2 border-dashed border-foreground/20 p-6 text-sm text-muted-foreground">
                    Bank-imported write-offs will appear here once the owner connects their bank.
                  </div>
                </section>
              )}

              {data.sections.notes && (data.notes?.length ?? 0) > 0 && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Notes</h2>
                  <div className="border-2 border-foreground/20 p-6 space-y-3">
                    {(data.notes ?? []).map((n) => (
                      <div key={n.id} className="text-sm">
                        <p className="text-xs text-muted-foreground">{n.note_date}</p>
                        <p>{n.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AccountantView;