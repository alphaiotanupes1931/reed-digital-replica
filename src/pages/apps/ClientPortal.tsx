import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAppsAuth } from "./useAppsAuth";
import AppsShell from "./AppsShell";
import { useToast } from "@/hooks/use-toast";

type Invoice = {
  id: string;
  service: string;
  price: number;
  due_date: string;
  status: string;
  created_at: string;
  message: string | null;
  client_id: string;
  clients?: { company_name: string; email: string } | null;
};

export default function ClientPortal() {
  const { user } = useAppsAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("invoices")
      .select("id, service, price, due_date, status, created_at, message, client_id, clients!inner(company_name, email)")
      .eq("owner_user_id", user.id)
      .in("status", ["approved", "sent", "paid"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setInvoices(data as any);
        setLoading(false);
      });
  }, [user?.id]);

  const shareUrl = user ? `${window.location.origin}/apps/client/portal?owner=${user.id}` : "";
  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied", description: "Send this to your clients." });
  };

  return (
    <AppsShell title="Client Portal" subtitle="What your clients see when they open their invoices.">
      <div className="border border-foreground/15 rounded-md p-5 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-muted/20">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Shareable link</div>
          <div className="text-xs font-mono mt-1 truncate">{shareUrl}</div>
        </div>
        <button onClick={copy} className="text-xs uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors shrink-0">
          Copy link
        </button>
      </div>

      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Active invoices</h2>
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : invoices.length === 0 ? (
        <div className="border border-dashed border-foreground/20 rounded-md p-12 text-center">
          <p className="text-sm text-muted-foreground">No client-visible invoices yet. Create one in Invoice Admin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="border border-foreground/15 rounded-md p-5">
              <div className="flex items-baseline justify-between">
                <div className="font-semibold text-sm">{inv.service}</div>
                <div className="text-sm">${inv.price.toFixed(2)}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {inv.clients?.company_name} · Due {inv.due_date} · <span className={inv.status === "paid" ? "text-brand" : ""}>{inv.status}</span>
              </div>
              {inv.message && <p className="text-xs text-muted-foreground mt-3 border-l-2 border-brand pl-3">{inv.message}</p>}
            </div>
          ))}
        </div>
      )}
    </AppsShell>
  );
}