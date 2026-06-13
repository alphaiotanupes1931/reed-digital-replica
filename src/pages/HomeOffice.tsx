import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const tiles = [
  { label: "Work Assistant", desc: "Daily notes, goals & standups", href: "/home-office/work-assistant" },
  { label: "Invoices", desc: "Admin dashboard & billing", href: "/admin" },
  { label: "Bills Tracker", desc: "Monthly bills vs maintenance income", href: "/home-office/bills" },
  { label: "ROI Tracker", desc: "Coming Soon — Plaid integration", href: "/home-office/roi-tracker" },
  { label: "Profile", desc: "Business name, payment methods & Stripe key", href: "/home-office/profile" },
  { label: "Help", desc: "Contact & support", href: "/home-office/help" },
];

const HomeOffice = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("");
  const [businessId, setBusinessId] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/home-office/welcome");
        return;
      }
      // Owner bypass — full access, no onboarding/paywall
      if (data.user.email?.toLowerCase() === "terellebony@gmail.com" || data.user.email?.toLowerCase() === "kimorataylor294@gmail.com") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, business_id, business_name")
          .eq("user_id", data.user.id)
          .maybeSingle();
        setDisplayName(profile?.full_name || "Terelle");
        setBusinessId(profile?.business_id || "");
        setBusinessName(profile?.business_name || "Reed Digital Group");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, onboarded, subscribed, business_id, business_name")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (!profile?.onboarded) {
        navigate("/home-office/onboarding");
        return;
      }
      // Hard paywall: must be subscribed (also re-verify via Stripe)
      try {
        const { data: sub } = await supabase.functions.invoke("ho-check-subscription");
        if (!sub?.subscribed) {
          navigate("/home-office/onboarding?step=paywall");
          return;
        }
      } catch {
        if (!profile?.subscribed) {
          navigate("/home-office/onboarding?step=paywall");
          return;
        }
      }
      setDisplayName(profile.full_name || "");
      setBusinessId(profile.business_id || "");
      setBusinessName(profile.business_name || "");
    })();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: "global" } as any);
    } catch {
      // ignore
    }
    sessionStorage.removeItem("ho-token");
    // Wipe any cached supabase auth tokens from localStorage
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    // Hard reload to fully reset auth state before the login page mounts
    window.location.replace("/home-office/login");
  };

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden">
      {/* Gold top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />

      {/* RDG watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[20vw] font-bold text-foreground/[0.03] uppercase tracking-widest select-none">
          RDG
        </span>
      </div>

      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Link to="/home-office" className="inline-block">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight hover:text-brand transition-colors">Home Office</h1>
              <p className="text-sm text-brand italic mt-1">by RDG</p>
            </Link>
            <div className="flex items-center justify-between mt-4">
              <p className="text-muted-foreground text-sm">
                Welcome{displayName ? `, ${displayName}` : ""}
              </p>
              <button
                onClick={handleLogout}
                className="text-[10px] uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:border-brand hover:text-brand transition-colors"
              >
                Log Out
              </button>
            </div>

            {businessId && (
              <div className="mt-6 border-2 border-foreground p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Your Business ID
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <code className="text-xl md:text-2xl font-bold tracking-[0.2em] text-brand">
                    {businessId}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(businessId);
                      toast.success("Business ID copied");
                    }}
                    className="text-[10px] uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:border-brand hover:text-brand transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Give this ID to your client so they can pay their invoice at{" "}
                  <span className="text-foreground">https://reeddigitalgroup.com/portal</span>
                </p>
                <button
                  onClick={() => setShowInstructions(true)}
                  className="mt-3 text-xs underline text-brand hover:text-brand/80"
                >
                  Click here for instructions
                </button>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tiles.map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to={tile.href}
                  className="block border-2 border-foreground p-8 hover:border-brand hover:bg-brand/5 transition-all group"
                >
                  <h2 className="text-lg font-bold tracking-tight group-hover:text-brand transition-colors">
                    {tile.label}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2">{tile.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-lg font-mono">
          <DialogHeader>
            <DialogTitle>How clients pay you</DialogTitle>
            <DialogDescription>Share these 3 steps with your client.</DialogDescription>
          </DialogHeader>

          <ol className="space-y-3 text-sm mt-2">
            <li><span className="text-brand font-bold">1.</span> Send them your Business ID: <code className="text-brand font-bold">{businessId}</code></li>
            <li><span className="text-brand font-bold">2.</span> Tell them to go to <span className="font-bold">{window.location.origin}/portal</span></li>
            <li><span className="text-brand font-bold">3.</span> They enter your Business ID + their email to see and pay the invoice.</li>
          </ol>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Email draft for your client
              </p>
              <button
                onClick={() => {
                  const subject = `Invoice from ${businessName || "us"}`;
                  const body = `Hi,\n\nYour invoice is ready. Here's how to pay:\n\n1. Go to: ${window.location.origin}/portal\n2. Enter our Business ID: ${businessId}\n3. Enter the email address this invoice was sent to\n4. Pay with card, Zelle, or Cash App\n\nThanks,\n${displayName || businessName}`;
                  navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
                  toast.success("Email copied to clipboard");
                }}
                className="text-[10px] uppercase tracking-widest border border-foreground/30 px-2 py-1 hover:border-brand hover:text-brand transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="text-xs whitespace-pre-wrap bg-muted/30 border border-border p-3 leading-relaxed">
{`Subject: Invoice from ${businessName || "us"}

Hi,

Your invoice is ready. Here's how to pay:

1. Go to: ${window.location.origin}/portal
2. Enter our Business ID: ${businessId}
3. Enter the email address this invoice was sent to
4. Pay with card, Zelle, or Cash App

Thanks,
${displayName || businessName}`}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeOffice;
