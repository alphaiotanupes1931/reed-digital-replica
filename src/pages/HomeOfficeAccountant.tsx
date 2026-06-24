import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotificationBell from "@/components/NotificationBell";

type AcctLink = { id: string; client_user_id: string; status: string; requested_at: string; accepted_at: string | null };
type ClientProfile = { user_id: string; full_name: string | null; business_name: string | null };

export default function HomeOfficeAccountant() {
  const navigate = useNavigate();
  const [accountantId, setAccountantId] = useState("");
  const [fullName, setFullName] = useState("");
  const [links, setLinks] = useState<AcctLink[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ClientProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { navigate("/home-office/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("account_type, accountant_id, full_name").eq("user_id", auth.user.id).maybeSingle();
      if (!prof || prof.account_type !== "accountant") { navigate("/home-office"); return; }
      setAccountantId(prof.accountant_id || "");
      setFullName(prof.full_name || "");
      await loadLinks();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLinks = async () => {
    const { data: l } = await supabase.from("accountant_clients").select("id, client_user_id, status, requested_at, accepted_at").order("requested_at", { ascending: false });
    const rows = (l || []) as AcctLink[];
    setLinks(rows);
    if (rows.length > 0) {
      const ids = rows.map((r) => r.client_user_id);
      const { data: p } = await supabase.from("profiles").select("user_id, full_name, business_name").in("user_id", ids);
      const map: Record<string, ClientProfile> = {};
      (p || []).forEach((x: any) => { map[x.user_id] = x; });
      setProfiles(map);
    }
  };

  const accept = async (id: string) => {
    const { error } = await supabase.from("accountant_clients").update({ status: "active", accepted_at: new Date().toISOString() } as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Client accepted.");
    loadLinks();
  };
  const decline = async (id: string) => {
    const { error } = await supabase.from("accountant_clients").update({ status: "removed" } as any).eq("id", id);
    if (error) return toast.error(error.message);
    loadLinks();
  };

  const copyId = () => { navigator.clipboard.writeText(accountantId); toast.success("Accountant ID copied"); };
  const logout = async () => { await supabase.auth.signOut(); navigate("/home-office/login"); };

  const pending = links.filter((l) => l.status === "pending");
  const active = links.filter((l) => l.status === "active");

  if (loading) return <div className="min-h-screen bg-background font-mono flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-background font-mono">
      <nav className="sticky top-0 z-40 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-xl px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← RDG</Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden md:block">Accountant {fullName ? `· ${fullName}` : ""}</span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button onClick={logout} className="text-[10px] uppercase tracking-[0.3em] px-4 py-2 border border-foreground/15 hover:border-foreground/40">Log out</button>
        </div>
      </nav>

      <main className="pt-16 md:pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Accountant workspace</div>
            <h1 className="text-5xl md:text-7xl tracking-[-0.04em] leading-[0.95] font-medium">
              Welcome,<br /><span className="italic text-brand">{fullName || "friend"}.</span>
            </h1>
          </motion.div>

          <div className="mb-12 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Your accountant ID</p>
              <code className="text-2xl md:text-3xl tracking-[0.2em] text-brand">{accountantId || "—"}</code>
              <p className="text-xs text-muted-foreground mt-3 max-w-md">Share this with your clients. They enter it in their Taxes tab to connect their books to you.</p>
            </div>
            <button onClick={copyId} className="text-[10px] uppercase tracking-[0.3em] px-4 py-2.5 bg-foreground text-background hover:bg-foreground/85">Copy ID</button>
          </div>

          <section className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Pending requests · {pending.length}</h2>
            {pending.length === 0 ? (
              <div className="border border-dashed border-foreground/15 p-8 text-center text-xs text-muted-foreground rounded-2xl">No pending requests.</div>
            ) : (
              <div className="space-y-3">
                {pending.map((l) => {
                  const p = profiles[l.client_user_id];
                  const name = p?.business_name || p?.full_name || "A client";
                  return (
                    <div key={l.id} className="rounded-2xl border border-foreground/10 p-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Requested {new Date(l.requested_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => decline(l.id)} className="text-[10px] uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:border-destructive hover:text-destructive">Decline</button>
                        <button onClick={() => accept(l.id)} className="text-[10px] uppercase tracking-widest bg-foreground text-background px-4 py-1.5">Accept</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Active clients · {active.length}</h2>
            {active.length === 0 ? (
              <div className="border border-dashed border-foreground/15 p-8 text-center text-xs text-muted-foreground rounded-2xl">No active clients yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.map((l) => {
                  const p = profiles[l.client_user_id];
                  const name = p?.business_name || p?.full_name || "Client";
                  return (
                    <div key={l.id} className="rounded-2xl border border-foreground/10 p-5">
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Connected {l.accepted_at ? new Date(l.accepted_at).toLocaleDateString() : ""}</p>
                      <p className="text-[10px] text-muted-foreground mt-3">Read-only client portal links are coming next — for now, ask your client to share their accountant portal link from their Taxes tab.</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}