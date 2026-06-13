import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

interface Invite {
  id: string;
  email: string;
  accepted_at: string | null;
  invite_token: string;
  created_at: string;
}

const Accounting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AccountantSettings | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newPasscode, setNewPasscode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const call = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("accountant-admin", {
      body: { action, ...payload },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await call("get_settings");
      setSettings(data.settings);
      setInvites(data.invites ?? []);
      if (data.settings?.share_token) {
        setShareUrl(`${window.location.origin}/accountant/${data.settings.share_token}`);
      } else {
        setShareUrl(null);
      }
    } catch (e) {
      toast({ title: "Error loading settings", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [call, toast]);

  useEffect(() => {
    if (!sessionStorage.getItem("ho-token")) {
      navigate("/home-office/login");
      return;
    }
    load();
  }, [navigate, load]);

  const updateSettings = async (patch: Partial<AccountantSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      await call("update_settings", patch as Record<string, unknown>);
    } catch (e) {
      toast({ title: "Failed to save", description: (e as Error).message, variant: "destructive" });
      load();
    }
  };

  const generateShare = async () => {
    try {
      const data = await call("generate_share");
      setNewPasscode(data.passcode);
      setShareUrl(`${window.location.origin}/accountant/${data.token}`);
      toast({ title: "Share link generated", description: "Copy the passcode now — it won't be shown again." });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const revokeShare = async () => {
    if (!confirm("Revoke the current share link?")) return;
    try {
      await call("revoke_share");
      setShareUrl(null);
      setNewPasscode(null);
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const sendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) return;
    try {
      await call("create_invite", { email });
      setInviteEmail("");
      load();
      toast({ title: "Invite added", description: "Email delivery will come in a future update — for now, share the link with your accountant manually." });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const revokeInvite = async (id: string) => {
    try {
      await call("revoke_invite", { id });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied" });
  };

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[20vw] font-bold text-foreground/[0.03] uppercase tracking-widest select-none">RDG</span>
      </div>
      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/home-office" className="text-xs text-muted-foreground hover:text-brand uppercase tracking-widest">← Home Office</Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Accounting</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>

            {loading ? (
              <p className="mt-12 text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div className="mt-12 space-y-12">
                {/* Publish toggle */}
                <section className="border-2 border-foreground/20 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Master switch</p>
                      <h2 className="text-xl font-bold mt-1">Publish Finances</h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        {settings?.published
                          ? "Your accountant can view the sections enabled below."
                          : "Your finances are hidden. Accountants see a 'not published' message."}
                      </p>
                    </div>
                    <Button
                      onClick={() => updateSettings({ published: !settings?.published })}
                      variant={settings?.published ? "default" : "outline"}
                    >
                      {settings?.published ? "PUBLISHED" : "PUBLISH"}
                    </Button>
                  </div>
                </section>

                {/* Permissions */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">What accountants can see</h2>
                  <div className="border-2 border-foreground/20 divide-y-2 divide-foreground/20">
                    {[
                      { key: "show_bills", label: "Bills", desc: "Monthly recurring bills" },
                      { key: "show_invoices", label: "Invoices & Revenue", desc: "Paid invoices and revenue calendar" },
                      { key: "show_writeoffs", label: "Write-offs", desc: "Reviewed bank transactions (coming with Plaid)" },
                      { key: "show_notes", label: "Notes", desc: "Your private daily notes — off by default" },
                    ].map((row) => {
                      const k = row.key as keyof AccountantSettings;
                      const checked = !!settings?.[k];
                      return (
                        <label key={row.key} className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-foreground/[0.02]">
                          <div>
                            <p className="font-bold text-sm">{row.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{row.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => updateSettings({ [row.key]: e.target.checked } as Partial<AccountantSettings>)}
                            className="h-5 w-5 accent-brand"
                          />
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* Share link */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Share link + passcode</h2>
                  <div className="border-2 border-foreground/20 p-6 space-y-4">
                    {shareUrl ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">Link</p>
                          <div className="flex gap-2 mt-1">
                            <code className="flex-1 px-3 py-2 bg-foreground/5 text-xs break-all">{shareUrl}</code>
                            <Button variant="outline" size="sm" onClick={() => copy(shareUrl)}>COPY</Button>
                          </div>
                        </div>
                        {newPasscode && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-brand">Passcode (shown once)</p>
                            <div className="flex gap-2 mt-1">
                              <code className="flex-1 px-3 py-2 bg-brand/10 text-xl tracking-widest font-bold">{newPasscode}</code>
                              <Button variant="outline" size="sm" onClick={() => copy(newPasscode)}>COPY</Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Save this — you can regenerate if lost.</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={generateShare}>REGENERATE</Button>
                          <Button variant="outline" size="sm" onClick={revokeShare}>REVOKE</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Generate a unique link and 6-digit passcode to share with your accountant. No account needed.
                        </p>
                        <Button onClick={generateShare}>GENERATE SHARE LINK</Button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Email invites */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Email invites</h2>
                  <div className="border-2 border-foreground/20 p-6 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="accountant@firm.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <Button onClick={sendInvite}>ADD</Button>
                    </div>
                    {invites.length > 0 ? (
                      <ul className="divide-y-2 divide-foreground/10">
                        {invites.map((inv) => (
                          <li key={inv.id} className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-sm font-bold">{inv.email}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {inv.accepted_at ? "Accepted" : "Pending"} · {new Date(inv.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => revokeInvite(inv.id)}>REVOKE</Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">No invites yet.</p>
                    )}
                  </div>
                </section>

                {/* Plaid placeholder */}
                <section className="border-2 border-dashed border-foreground/20 p-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Coming next</p>
                  <h2 className="text-xl font-bold mt-1">Bank Connection & Write-offs</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect your bank via Plaid to auto-import transactions. Check or X each one as a write-off, then close out the month.
                  </p>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accounting;
