import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AccountantSettings {
  published: boolean;
  show_bills: boolean;
  show_invoices: boolean;
  show_writeoffs: boolean;
  show_notes: boolean;
  share_token: string | null;
}
interface Invite { id: string; email: string; accepted_at: string | null; invite_token: string; created_at: string; }
interface PlaidItem { id: string; institution_name: string | null; last_synced_at: string | null; }
interface Txn {
  id: string; name: string; merchant_name: string | null;
  amount: number; category: string | null; txn_date: string; is_write_off: boolean | null;
}
interface MonthClose { year: number; month: number; closed_at: string; }

const monthLabel = (y: number, m: number) =>
  new Date(y, m - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

const Accounting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AccountantSettings | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newPasscode, setNewPasscode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const [plaidItems, setPlaidItems] = useState<PlaidItem[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [closes, setCloses] = useState<MonthClose[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState<"share" | "writeoffs">("share");

  const callAdmin = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("accountant-admin", { body: { action, ...payload } });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const callPlaid = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("plaid", { body: { action, ...payload } });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const loadAccountant = useCallback(async () => {
    const data = await callAdmin("get_settings");
    setSettings(data.settings);
    setInvites(data.invites ?? []);
    setShareUrl(data.settings?.share_token ? `${window.location.origin}/accountant/${data.settings.share_token}` : null);
  }, [callAdmin]);

  const loadFinance = useCallback(async () => {
    const [{ data: items }, { data: tx }, { data: mc }] = await Promise.all([
      supabase.from("plaid_items").select("id,institution_name,last_synced_at").order("created_at"),
      supabase.from("bank_transactions").select("id,name,merchant_name,amount,category,txn_date,is_write_off").order("txn_date", { ascending: false }).limit(500),
      supabase.from("month_closes").select("year,month,closed_at"),
    ]);
    setPlaidItems(items ?? []);
    setTxns((tx ?? []) as Txn[]);
    setCloses((mc ?? []) as MonthClose[]);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("ho-token")) { navigate("/home-office/login"); return; }
    Promise.all([loadAccountant(), loadFinance()])
      .catch((e) => toast({ title: "Load failed", description: (e as Error).message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [navigate, loadAccountant, loadFinance, toast]);

  const updateSettings = async (patch: Partial<AccountantSettings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...patch });
    try { await callAdmin("update_settings", patch as Record<string, unknown>); }
    catch (e) { toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" }); loadAccountant(); }
  };

  const generateShare = async () => {
    const data = await callAdmin("generate_share");
    setNewPasscode(data.passcode);
    setShareUrl(`${window.location.origin}/accountant/${data.token}`);
    loadAccountant();
  };
  const revokeShare = async () => { if (!confirm("Revoke the current share link?")) return; await callAdmin("revoke_share"); setShareUrl(null); setNewPasscode(null); loadAccountant(); };
  const sendInvite = async () => { const email = inviteEmail.trim(); if (!email) return; await callAdmin("create_invite", { email }); setInviteEmail(""); loadAccountant(); };
  const revokeInvite = async (id: string) => { await callAdmin("revoke_invite", { id }); loadAccountant(); };
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast({ title: "Copied" }); };

  // Plaid Link
  const initLink = async () => {
    try { const d = await callPlaid("create_link_token"); setLinkToken(d.link_token); }
    catch (e) { toast({ title: "Plaid error", description: (e as Error).message, variant: "destructive" }); }
  };
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        await callPlaid("exchange_public_token", { public_token, institution_name: metadata.institution?.name });
        toast({ title: "Bank connected" });
        setLinkToken(null);
        await loadFinance();
        await sync();
      } catch (e) { toast({ title: "Connect failed", description: (e as Error).message, variant: "destructive" }); }
    },
    onExit: () => setLinkToken(null),
  });
  useEffect(() => { if (linkToken && ready) open(); }, [linkToken, ready, open]);

  const sync = async () => {
    setSyncing(true);
    try { const d = await callPlaid("sync"); toast({ title: `Synced ${d.added ?? 0} transactions` }); await loadFinance(); }
    catch (e) { toast({ title: "Sync failed", description: (e as Error).message, variant: "destructive" }); }
    finally { setSyncing(false); }
  };
  const disconnect = async (id: string) => { if (!confirm("Disconnect this bank?")) return; await callPlaid("disconnect", { id }); loadFinance(); };

  const setWriteOff = async (id: string, value: boolean | null) => {
    setTxns((prev) => prev.map((t) => t.id === id ? { ...t, is_write_off: value } : t));
    try { await callPlaid("set_write_off", { id, value }); }
    catch (e) { toast({ title: "Failed", description: (e as Error).message, variant: "destructive" }); loadFinance(); }
  };

  // Group txns by year-month
  const grouped = useMemo(() => {
    const map = new Map<string, { year: number; month: number; rows: Txn[] }>();
    for (const t of txns) {
      const d = new Date(t.txn_date);
      const y = d.getFullYear(); const m = d.getMonth() + 1;
      const key = `${y}-${m}`;
      if (!map.has(key)) map.set(key, { year: y, month: m, rows: [] });
      map.get(key)!.rows.push(t);
    }
    return Array.from(map.values()).sort((a, b) => b.year - a.year || b.month - a.month);
  }, [txns]);

  const isClosed = (y: number, m: number) => closes.some((c) => c.year === y && c.month === m);

  const toggleClose = async (y: number, m: number) => {
    const now = new Date();
    const isCurrent = y === now.getFullYear() && (m === now.getMonth() + 1);
    if (isClosed(y, m)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("month_closes").delete().eq("owner_user_id", user.id).eq("year", y).eq("month", m);
    } else {
      if (isCurrent && !confirm(`${monthLabel(y, m)} is the current month. Mark it reviewed anyway?`)) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("month_closes").insert({ owner_user_id: user.id, year: y, month: m });
    }
    loadFinance();
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <main className="py-12">
        <div className="container max-w-3xl mx-auto px-6">
          <Link to="/home-office" className="text-xs text-muted-foreground hover:text-brand uppercase tracking-widest">← Home Office</Link>
          <h1 className="text-2xl font-bold tracking-tight mt-3">Accounting</h1>
          <p className="text-xs text-muted-foreground mt-1">Bank sync, write-offs, and accountant access.</p>

          {/* Tabs */}
          <div className="mt-8 flex gap-6 border-b border-foreground/10">
            {(["share", "writeoffs"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-3 text-xs uppercase tracking-widest transition-colors ${tab === t ? "text-foreground border-b-2 border-brand -mb-px" : "text-muted-foreground hover:text-foreground"}`}>
                {t === "share" ? "Accountant Access" : "Write-offs"}
              </button>
            ))}
          </div>

          {loading ? <p className="mt-8 text-sm text-muted-foreground">Loading…</p> : tab === "share" ? (
            <div className="mt-8 space-y-8">
              {/* Publish */}
              <section className="flex items-center justify-between gap-4 py-4 border-b border-foreground/10">
                <div>
                  <p className="text-sm font-bold">Publish finances</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {settings?.published ? "Visible to accountants with a link" : "Hidden from accountants"}
                  </p>
                </div>
                <Button size="sm" onClick={() => updateSettings({ published: !settings?.published })} variant={settings?.published ? "default" : "outline"}>
                  {settings?.published ? "ON" : "OFF"}
                </Button>
              </section>

              {/* Permissions */}
              <section>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Visible sections</p>
                <div className="space-y-0">
                  {[
                    { key: "show_bills", label: "Bills" },
                    { key: "show_invoices", label: "Invoices & revenue" },
                    { key: "show_writeoffs", label: "Write-offs" },
                    { key: "show_notes", label: "Notes (private by default)" },
                  ].map((row) => {
                    const k = row.key as keyof AccountantSettings;
                    return (
                      <label key={row.key} className="flex items-center justify-between py-3 border-b border-foreground/10 cursor-pointer">
                        <span className="text-sm">{row.label}</span>
                        <input type="checkbox" checked={!!settings?.[k]}
                          onChange={(e) => updateSettings({ [row.key]: e.target.checked } as Partial<AccountantSettings>)}
                          className="h-4 w-4 accent-brand" />
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Share link */}
              <section>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Share link</p>
                {shareUrl ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <code className="flex-1 px-3 py-2 bg-foreground/5 text-xs break-all">{shareUrl}</code>
                      <Button variant="outline" size="sm" onClick={() => copy(shareUrl)}>Copy</Button>
                    </div>
                    {newPasscode && (
                      <div className="flex gap-2 items-center">
                        <code className="flex-1 px-3 py-2 bg-brand/10 text-lg tracking-widest font-bold">{newPasscode}</code>
                        <Button variant="outline" size="sm" onClick={() => copy(newPasscode)}>Copy</Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={generateShare}>Regenerate</Button>
                      <Button variant="outline" size="sm" onClick={revokeShare}>Revoke</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" onClick={generateShare}>Generate link + passcode</Button>
                )}
              </section>

              {/* Invites */}
              <section>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Email invites</p>
                <div className="flex gap-2 mb-3">
                  <Input type="email" placeholder="accountant@firm.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  <Button size="sm" onClick={sendInvite}>Add</Button>
                </div>
                {invites.length > 0 ? (
                  <ul>
                    {invites.map((inv) => (
                      <li key={inv.id} className="flex items-center justify-between py-2 border-b border-foreground/10">
                        <div>
                          <p className="text-sm">{inv.email}</p>
                          <p className="text-xs text-muted-foreground">{inv.accepted_at ? "Accepted" : "Pending"}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => revokeInvite(inv.id)}>Revoke</Button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-xs text-muted-foreground">No invites yet.</p>}
              </section>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {/* Banks */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Connected banks</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={sync} disabled={syncing || plaidItems.length === 0}>
                      {syncing ? "Syncing…" : "Sync"}
                    </Button>
                    <Button size="sm" onClick={initLink}>Connect bank</Button>
                  </div>
                </div>
                {plaidItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No banks connected yet.</p>
                ) : (
                  <ul>
                    {plaidItems.map((it) => (
                      <li key={it.id} className="flex items-center justify-between py-2 border-b border-foreground/10">
                        <div>
                          <p className="text-sm">{it.institution_name || "Bank"}</p>
                          <p className="text-xs text-muted-foreground">
                            {it.last_synced_at ? `Synced ${new Date(it.last_synced_at).toLocaleString()}` : "Not synced yet"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => disconnect(it.id)}>Disconnect</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Months */}
              {grouped.length === 0 ? (
                <p className="text-xs text-muted-foreground">Connect a bank and sync to review transactions.</p>
              ) : grouped.map((g) => {
                const closed = isClosed(g.year, g.month);
                const writeOffTotal = g.rows.filter((r) => r.is_write_off === true).reduce((s, r) => s + Number(r.amount), 0);
                const unreviewed = g.rows.filter((r) => r.is_write_off === null).length;
                return (
                  <section key={`${g.year}-${g.month}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold">{monthLabel(g.year, g.month)}</p>
                        <p className="text-xs text-muted-foreground">
                          {g.rows.length} txns · {unreviewed} unreviewed · write-offs ${writeOffTotal.toFixed(2)}
                        </p>
                      </div>
                      <Button size="sm" variant={closed ? "default" : "outline"} onClick={() => toggleClose(g.year, g.month)}>
                        {closed ? "Reviewed" : "Mark reviewed"}
                      </Button>
                    </div>
                    <ul className="border-t border-foreground/10">
                      {g.rows.map((t) => (
                        <li key={t.id} className="flex items-center justify-between gap-3 py-3 border-b border-foreground/10">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate">{t.merchant_name || t.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(t.txn_date).toLocaleDateString()} · {t.category || "Uncategorized"} · ${Number(t.amount).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setWriteOff(t.id, t.is_write_off === true ? null : true)}
                              className={`w-8 h-8 border text-sm font-bold ${t.is_write_off === true ? "bg-brand text-background border-brand" : "border-foreground/20 hover:border-brand"}`}
                              aria-label="Write off">✓</button>
                            <button
                              onClick={() => setWriteOff(t.id, t.is_write_off === false ? null : false)}
                              className={`w-8 h-8 border text-sm font-bold ${t.is_write_off === false ? "bg-foreground text-background border-foreground" : "border-foreground/20 hover:border-foreground"}`}
                              aria-label="Not a write off">✕</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Accounting;