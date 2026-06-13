import { useMemo, useState } from "react";

interface PaidInvoice {
  id: string;
  price: number;
  paid_at?: string | null;
  service: string;
  clients?: { company_name: string } | null;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["S","M","T","W","T","F","S"];

export default function RevenueCalendar({ invoices }: { invoices: PaidInvoice[] }) {
  const [view, setView] = useState<"month" | "year">("month");
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const paid = useMemo(
    () => invoices.filter((i) => i.paid_at),
    [invoices]
  );

  // Group by YYYY-MM-DD
  const byDay = useMemo(() => {
    const m = new Map<string, { total: number; items: PaidInvoice[] }>();
    for (const i of paid) {
      const d = new Date(i.paid_at!);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!m.has(k)) m.set(k, { total: 0, items: [] });
      const e = m.get(k)!;
      e.total += Number(i.price) || 0;
      e.items.push(i);
    }
    return m;
  }, [paid]);

  const byMonth = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of paid) {
      const d = new Date(i.paid_at!);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      m.set(k, (m.get(k) || 0) + (Number(i.price) || 0));
    }
    return m;
  }, [paid]);

  const yearTotal = useMemo(
    () => paid.filter((i) => new Date(i.paid_at!).getFullYear() === year).reduce((s, i) => s + Number(i.price), 0),
    [paid, year]
  );

  const monthTotal = useMemo(() => {
    let t = 0;
    for (const [k, v] of byDay) {
      const [y, mo] = k.split("-").map(Number);
      if (y === year && mo - 1 === month) t += v.total;
    }
    return t;
  }, [byDay, year, month]);

  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // Month grid
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedItems = selectedDay ? byDay.get(selectedDay)?.items ?? [] : [];
  const selectedTotal = selectedDay ? byDay.get(selectedDay)?.total ?? 0 : 0;

  return (
    <div className="border-2 border-foreground mb-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/20 px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (view === "month") {
                const d = new Date(year, month - 1, 1);
                setYear(d.getFullYear()); setMonth(d.getMonth());
              } else setYear(year - 1);
              setSelectedDay(null);
            }}
            className="text-xs font-mono px-2 py-1 border border-border hover:border-foreground"
          >‹</button>
          <p className="text-sm font-mono uppercase tracking-widest font-bold">
            {view === "month" ? `${MONTHS[month]} ${year}` : year}
          </p>
          <button
            onClick={() => {
              if (view === "month") {
                const d = new Date(year, month + 1, 1);
                setYear(d.getFullYear()); setMonth(d.getMonth());
              } else setYear(year + 1);
              setSelectedDay(null);
            }}
            className="text-xs font-mono px-2 py-1 border border-border hover:border-foreground"
          >›</button>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {view === "month" ? "Month" : "Year"}: <span className="text-brand font-bold">{fmt(view === "month" ? monthTotal : yearTotal)}</span>
          </p>
          <div className="flex border border-border">
            <button
              onClick={() => { setView("month"); setSelectedDay(null); }}
              className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 ${view === "month" ? "bg-foreground text-background" : ""}`}
            >Month</button>
            <button
              onClick={() => { setView("year"); setSelectedDay(null); }}
              className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 ${view === "year" ? "bg-foreground text-background" : ""}`}
            >Year</button>
          </div>
        </div>
      </div>

      {/* Body */}
      {view === "month" ? (
        <div className="p-4">
          <div className="grid grid-cols-7 gap-px bg-foreground/10 border border-foreground/10">
            {DOW.map((d, i) => (
              <div key={i} className="bg-background text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground py-1">{d}</div>
            ))}
            {cells.map((d, idx) => {
              if (d === null) return <div key={idx} className="bg-background h-20" />;
              const k = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const entry = byDay.get(k);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
              const isSelected = selectedDay === k;
              return (
                <button
                  key={idx}
                  onClick={() => entry && setSelectedDay(isSelected ? null : k)}
                  className={`bg-background h-20 p-2 text-left transition-colors ${entry ? "hover:bg-brand/10 cursor-pointer" : "cursor-default"} ${isSelected ? "bg-brand/20" : ""}`}
                >
                  <div className={`text-xs font-mono ${isToday ? "text-brand font-bold" : ""}`}>{d}</div>
                  {entry && (
                    <div className="mt-1">
                      <div className="text-[11px] font-mono font-bold text-brand">{fmt(entry.total)}</div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{entry.items.length} pmt</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <div className="mt-4 border-t border-foreground/20 pt-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                {selectedDay} · <span className="text-brand font-bold">{fmt(selectedTotal)}</span>
              </p>
              <div className="space-y-2">
                {selectedItems.map((it) => (
                  <div key={it.id} className="flex justify-between items-center border-b border-border py-2">
                    <div>
                      <p className="text-sm font-mono font-bold">{it.clients?.company_name || "Client"}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{it.service} · {new Date(it.paid_at!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <p className="text-sm font-mono font-bold text-brand">{fmt(Number(it.price))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {MONTHS.map((m, i) => {
            const total = byMonth.get(`${year}-${i}`) || 0;
            return (
              <button
                key={i}
                onClick={() => { setView("month"); setMonth(i); setSelectedDay(null); }}
                className="bg-background p-4 text-left hover:bg-brand/10 transition-colors"
              >
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{m}</div>
                <div className="text-lg font-mono font-bold mt-1 text-brand">{fmt(total)}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}