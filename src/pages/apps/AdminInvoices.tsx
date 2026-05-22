import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppsAuth } from "./useAppsAuth";
import AppsShell from "./AppsShell";

type Invoice = {
  id: string;
  service: string;
  price: number;
  due_date: string;
  status: string;
  client_id: string;
  message: string | null;
  created_at: string;
};

type Client = { id: string; company_name: string; email: string };

export default function AdminInvoices() {
  const { user } = useAppsAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [newClient, setNewClient] = useState({ company_name: "", email: "" });
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [inv, cl] = await Promise.all([
      supabase.from("invoices").select("id, service, price, due_date, status, client_id, message, created_at").eq("owner_user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("clients").select("id, company_name, email").eq("owner_user_id", user.id).order("company_name"),
    ]);
    if (inv.data) setInvoices(inv.data as Invoice[]);
    if (cl.data) setClients(cl.data as Client[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    let targetClientId = clientId;
    if (!targetClientId) {
      if (!newClient.company_name || !newClient.email) {
        toast({ title: "Pick or add a client", variant: "destructive" });
        return;
      }
      const { data, error } = await supabase.from("clients").insert({
        company_name: newClient.company_name,
        email: newClient.email.toLowerCase().trim(),
        owner_user_id: user.id,
      }).select("id").single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      targetClientId = data.id;
    }
    if (!service || !price || !dueDate) {
      toast({ title: "Service, price, due date required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("invoices").insert({
      client_id: targetClientId,
      service,
      price: parseFloat(price),
      due_date: dueDate,
      message: message || null,
      status: "approved",
      owner_user_id: user.id,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Invoice created" });
    setShowForm(false);
    setClientId(""); setNewClient({ company_name: "", email: "" });
    setService(""); setPrice(""); setDueDate(""); setMessage("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const markPaid = async (id: string, current: string) => {
    const next = current === "paid" ? "approved" : "paid";
    const { error } = await supabase.from("invoices").update({ status: next } as any).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const clientName = (cid: string) => clients.find(c => c.id === cid)?.company_name || "—";

  return (
    <AppsShell title="Invoice Admin" subtitle="Manage invoices for your clients. Only you can see this.">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(s => !s)}
          className="text-xs uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          {showForm ? "Cancel" : "New Invoice"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createInvoice} className="border border-foreground/15 rounded-md p-6 mb-8 space-y-4 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Existing client</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm">
                <option value="">— Add new below —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company_name} ({c.email})</option>)}
              </select>
            </div>
            {!clientId && (
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Company name" value={newClient.company_name} onChange={e => setNewClient(s => ({ ...s, company_name: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
                <input placeholder="Email" type="email" value={newClient.email} onChange={e => setNewClient(s => ({ ...s, email: e.target.value }))} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Service" value={service} onChange={e => setService(e.target.value)} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
            <input placeholder="Price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" />
          </div>
          <textarea placeholder="Message to client (optional)" value={message} onChange={e => setMessage(e.target.value)} className="w-full border border-foreground/15 bg-background px-3 py-2 rounded-md text-sm" rows={2} />
          <button type="submit" className="bg-foreground text-background px-5 py-2 text-sm rounded-md hover:bg-brand hover:text-brand-foreground transition-colors">Create</button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : invoices.length === 0 ? (
        <div className="border border-dashed border-foreground/20 rounded-md p-12 text-center">
          <p className="text-sm text-muted-foreground">No invoices yet. Create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="border border-foreground/15 rounded-md p-4 flex items-center justify-between hover:border-brand/40 transition-colors">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{inv.service} <span className="text-muted-foreground font-normal">· {clientName(inv.client_id)}</span></div>
                <div className="text-xs text-muted-foreground mt-1">Due {inv.due_date} · ${inv.price.toFixed(2)} · <span className={inv.status === "paid" ? "text-brand" : ""}>{inv.status}</span></div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => markPaid(inv.id, inv.status)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:bg-muted rounded-sm">
                  {inv.status === "paid" ? "Unpaid" : "Mark paid"}
                </button>
                <button onClick={() => remove(inv.id)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppsShell>
  );
}