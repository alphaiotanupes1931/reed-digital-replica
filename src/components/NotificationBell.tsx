import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type Notif = { id: string; kind: string; title: string; body: string | null; cta_url: string | null; created_at: string; read_at: string | null };

export default function NotificationBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data } = await supabase
      .from("system_notifications")
      .select("id, kind, title, body, cta_url, created_at, read_at")
      .is("dismissed_at", null)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setItems(data as Notif[]);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  const unread = items.filter((i) => !i.read_at).length;

  const markAllRead = async () => {
    const ids = items.filter((i) => !i.read_at).map((i) => i.id);
    if (ids.length === 0) return;
    await supabase.from("system_notifications").update({ read_at: new Date().toISOString() } as any).in("id", ids);
    load();
  };

  const dismiss = async (id: string) => {
    await supabase.from("system_notifications").update({ dismissed_at: new Date().toISOString() } as any).eq("id", id);
    load();
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open) markAllRead(); }}
        className="relative text-[10px] uppercase tracking-[0.3em] px-3 py-2 border border-foreground/15 hover:border-foreground/40 transition-colors"
        aria-label="Notifications"
      >
        Inbox
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand text-brand-foreground text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-background border border-foreground/15 z-50 shadow-xl">
          <div className="px-4 py-3 border-b border-foreground/10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Notifications</div>
          {items.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">All clear.</div>
          ) : items.map((n) => (
            <div key={n.id} className="px-4 py-3 border-b border-foreground/10 last:border-b-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-1">{n.body}</p>}
                  {n.cta_url && (
                    <Link to={n.cta_url} onClick={() => setOpen(false)} className="text-[10px] uppercase tracking-widest text-brand mt-2 inline-block">Open →</Link>
                  )}
                </div>
                <button onClick={() => dismiss(n.id)} className="text-[10px] text-muted-foreground hover:text-destructive">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}