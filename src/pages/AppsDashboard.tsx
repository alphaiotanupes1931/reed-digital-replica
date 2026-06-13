import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const adminApps = [
  { label: "Invoice Admin", desc: "Create, send, and manage invoices for your clients.", href: "/apps/admin/invoices" },
  { label: "Bills Tracker", desc: "Track monthly bills, recurring income, and net cash position.", href: "/apps/admin/bills" },
  { label: "Tax Tracker", desc: "Log quarterly estimates and tax obligations.", href: "/apps/admin/taxes" },
];

const clientApps = [
  { label: "Client Portal", desc: "The page your clients open to view & pay invoices you've sent.", href: "/apps/client/portal" },
];

const AppsDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const sync = async (session: any) => {
      if (!mounted) return;
      if (!session) {
        navigate("/apps/login");
        return;
      }
      const u = session.user;
      // Onboarding gate: send first-time users through onboarding before showing dashboard
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, onboarded, business_id, business_name")
        .eq("user_id", u.id)
        .maybeSingle();
      if (!profile?.onboarded) {
        navigate("/apps/onboarding", { replace: true });
        return;
      }
      setBusinessId(profile?.business_id ?? null);
      setBusinessName(profile?.business_name ?? null);
      setUser({
        email: u.email,
        name:
          profile?.full_name ||
          (u.user_metadata?.full_name as string) ||
          (u.email?.split("@")[0] ?? "there"),
      });
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => sync(session));
    supabase.auth.getSession().then(({ data }) => sync(data.session));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/apps");
  };

  const copyId = async () => {
    if (!businessId) return;
    await navigator.clipboard.writeText(businessId);
    toast({ title: "Business ID copied" });
  };

  const copyPortalLink = async () => {
    const url = `${window.location.origin}/portal`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Portal link copied", description: "Send this to your clients along with your Business ID." });
  };

  return (
    <div className="min-h-screen bg-background font-apps">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-between border-b-2 border-foreground pb-8 mb-12"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, {user?.name || "Elaine"}
              </h1>
              {user?.email && (
                <p className="text-sm text-muted-foreground mt-3">Signed in as {user.email}</p>
              )}
            </div>
            <button
              onClick={signOut}
              className="text-xs uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Sign Out
            </button>
          </motion.div>

          {businessId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="border-2 border-foreground p-6 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Your Business ID — share with clients only
                </p>
                <p className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-brand">{businessId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Clients enter this at <span className="text-foreground">/portal</span> to find {businessName || "your business"}. Keep it private — anyone with it can look up your business name.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={copyId}
                  className="text-xs uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
                >
                  Copy ID
                </button>
                <button
                  onClick={copyPortalLink}
                  className="text-xs uppercase tracking-widest border border-foreground/40 px-4 py-2 hover:border-foreground transition-colors"
                >
                  Copy portal link
                </button>
              </div>
            </motion.div>
          )}

          {[
            { title: "Admin", subtitle: "Management", items: adminApps },
            { title: "Client", subtitle: "What you share with your clients.", items: clientApps },
          ].map((section, sIdx) => (
            <section key={section.title} className="mb-12">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{section.title}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{section.subtitle}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((app, i) => (
                  <motion.div
                    key={app.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + sIdx * 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={app.href}
                      className="block border-2 border-foreground p-8 hover:border-brand hover:bg-brand/5 transition-all group h-full"
                    >
                      <h3 className="text-lg font-bold tracking-tight mb-4 group-hover:text-brand transition-colors">
                        {app.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppsDashboard;