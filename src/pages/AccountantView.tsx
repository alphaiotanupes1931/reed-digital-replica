import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ViewData {
  published: boolean;
  sections: { bills: boolean; invoices: boolean; writeoffs: boolean; notes: boolean; taxes?: boolean };
  owner: { full_name: string | null; business_name: string | null } | null;
  bills?: Array<{ id: string; company_name: string; price: number; notes: string | null }>;
  invoices?: Array<{ id: string; amount: number; status: string; paid_at: string | null; created_at: string; description: string | null }>;
  notes?: Array<{ id: string; content: string; note_type: string; note_date: string }>;
  writeoffs?: unknown[];
  taxes?: {
    income: Array<{ id: string; entry_date: string; source: string; amount: number; notes: string | null; invoice_id: string | null }>;
    w2: Array<{ id: string; year: number; employer: string; gross_wages: number; federal_withheld: number; state_withheld: number }>;
    expenses: Array<{ id: string; entry_date: string; category: string; description: string; amount: number; receipt_note: string | null }>;
    mileage: Array<{ id: string; entry_date: string; purpose: string; miles: number; gas_amount: number; vehicle: string | null }>;
    reminders: Array<{ id: string; title: string; amount: number; due_date: string | null; paid: boolean; notes: string | null }>;
  };
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

              {data.sections.taxes && data.taxes && <TaxesSection taxes={data.taxes} />}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AccountantView;

function fmt(n: number) {
  return `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function TaxesSection({ taxes }: { taxes: NonNullable<ViewData["taxes"]> }) {
  const year = new Date().getFullYear();
  const ytdIncome = taxes.income.filter((i) => i.entry_date?.startsWith(String(year))).reduce((s, i) => s + Number(i.amount), 0);
  const ytdW2 = taxes.w2.filter((w) => w.year === year).reduce((s, w) => s + Number(w.gross_wages), 0);
  const ytdExp = taxes.expenses.filter((e) => e.entry_date?.startsWith(String(year))).reduce((s, e) => s + Number(e.amount), 0);
  const ytdMiles = taxes.mileage.filter((m) => m.entry_date?.startsWith(String(year))).reduce((s, m) => s + Number(m.miles), 0);
  const ytdGas = taxes.mileage.filter((m) => m.entry_date?.startsWith(String(year))).reduce((s, m) => s + Number(m.gas_amount), 0);

  const Block = ({ title, rows, file, children }: { title: string; rows: Record<string, unknown>[]; file: string; children: React.ReactNode }) => (
    <div className="border-2 border-foreground/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{title} · {rows.length} rows</h3>
        <button onClick={() => exportCSV(file, rows)} className="text-[10px] uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:border-brand hover:text-brand">CSV</button>
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Nothing here yet.</p> : children}
    </div>
  );

  return (
    <section>
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Taxes · YTD {year}</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 border-2 border-foreground mb-6">
        {[
          { label: "Biz Income", value: fmt(ytdIncome) },
          { label: "W-2 Wages", value: fmt(ytdW2) },
          { label: "Expenses", value: fmt(ytdExp) },
          { label: "Mileage", value: `${ytdMiles.toFixed(0)} mi` },
          { label: "Gas", value: fmt(ytdGas) },
        ].map((s, idx) => (
          <div key={s.label} className={`p-4 ${idx > 0 ? "md:border-l-2 border-foreground" : ""} ${idx >= 2 ? "border-t-2 md:border-t-0 border-foreground" : ""}`}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="text-lg font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <Block title="Business income" rows={taxes.income} file="business-income.csv">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="py-2">Date</th><th className="py-2">Source</th><th className="py-2 text-right">Amount</th></tr></thead>
            <tbody>{taxes.income.map((r) => (<tr key={r.id} className="border-t border-foreground/10"><td className="py-2 text-muted-foreground">{r.entry_date}</td><td className="py-2">{r.source}</td><td className="py-2 text-right font-semibold">{fmt(r.amount)}</td></tr>))}</tbody>
          </table>
        </Block>
        <Block title="W-2 income" rows={taxes.w2} file="w2-income.csv">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="py-2">Year</th><th className="py-2">Employer</th><th className="py-2 text-right">Gross</th><th className="py-2 text-right">Fed</th><th className="py-2 text-right">State</th></tr></thead>
            <tbody>{taxes.w2.map((r) => (<tr key={r.id} className="border-t border-foreground/10"><td className="py-2 text-muted-foreground">{r.year}</td><td className="py-2">{r.employer}</td><td className="py-2 text-right font-semibold">{fmt(r.gross_wages)}</td><td className="py-2 text-right">{fmt(r.federal_withheld)}</td><td className="py-2 text-right">{fmt(r.state_withheld)}</td></tr>))}</tbody>
          </table>
        </Block>
        <Block title="Expenses & write-offs" rows={taxes.expenses} file="expenses.csv">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="py-2">Date</th><th className="py-2">Category</th><th className="py-2">Description</th><th className="py-2 text-right">Amount</th></tr></thead>
            <tbody>{taxes.expenses.map((r) => (<tr key={r.id} className="border-t border-foreground/10"><td className="py-2 text-muted-foreground">{r.entry_date}</td><td className="py-2"><span className="text-[10px] uppercase tracking-widest border border-foreground/20 px-2 py-0.5">{r.category}</span></td><td className="py-2">{r.description}</td><td className="py-2 text-right font-semibold">{fmt(r.amount)}</td></tr>))}</tbody>
          </table>
        </Block>
        <Block title="Mileage & gas" rows={taxes.mileage} file="mileage.csv">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="py-2">Date</th><th className="py-2">Purpose</th><th className="py-2 text-right">Miles</th><th className="py-2 text-right">Gas</th><th className="py-2">Vehicle</th></tr></thead>
            <tbody>{taxes.mileage.map((r) => (<tr key={r.id} className="border-t border-foreground/10"><td className="py-2 text-muted-foreground">{r.entry_date}</td><td className="py-2">{r.purpose}</td><td className="py-2 text-right font-semibold">{Number(r.miles).toFixed(1)}</td><td className="py-2 text-right">{fmt(r.gas_amount)}</td><td className="py-2 text-muted-foreground">{r.vehicle || "—"}</td></tr>))}</tbody>
          </table>
        </Block>
        <Block title="Tax reminders" rows={taxes.reminders} file="reminders.csv">
          <ul className="divide-y divide-foreground/10">
            {taxes.reminders.map((r) => (
              <li key={r.id} className={`py-3 flex justify-between text-sm ${r.paid ? "opacity-50 line-through" : ""}`}>
                <span>{r.title} <span className="text-[10px] text-muted-foreground ml-2">{r.due_date || "no date"}</span></span>
                <span className="font-semibold">{fmt(r.amount)}</span>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </section>
  );
}