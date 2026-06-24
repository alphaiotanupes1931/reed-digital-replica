import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const tiles = [
  { label: "Notes", desc: "Daily notes, goals & standups", href: "/home-office/work-assistant" },
  { label: "Invoices", desc: "Clients, billing & payments", href: "/admin" },
  { label: "Bills", desc: "Monthly bills vs income", href: "/home-office/bills" },
  { label: "Accounting", desc: "Income, expenses & reports", href: "/home-office/accounting" },
  { label: "Taxes", desc: "Spreadsheet, mileage & accountant updates", href: "/home-office/taxes" },
  { label: "Profile", desc: "Business info & payment setup", href: "/home-office/profile" },
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
        .select("full_name, onboarded, subscribed, business_id, business_name, recovery_setup_complete")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (!profile?.onboarded) {
        navigate("/home-office/onboarding");
        return;
      }
      if (!profile?.recovery_setup_complete) {
        navigate("/home-office/recovery-setup");
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
    <div className="min-h-screen bg-background font-mono relative">
      {/* Sticky pill nav */}
      <nav className="sticky top-4 z-40 mx-auto mt-4 w-[calc(100%-1.5rem)] max-w-5xl rounded-full border border-foreground/10 bg-background/80 backdrop-blur-xl px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
          ← RDG
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden md:block">
          Home Office {displayName ? `· ${displayName}` : ""}
        </span>
        <button
          onClick={handleLogout}
          className="text-[10px] uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-foreground/15 hover:border-foreground/40 transition-colors"
        >
          Log out
        </button>
      </nav>

      <main className="pt-16 md:pt-24 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Dashboard
            </div>
            <h1 className="text-5xl md:text-7xl tracking-[-0.04em] leading-[0.95] font-medium">
              Welcome back,
              <br />
              <span className="italic text-brand">{displayName || "friend"}.</span>
            </h1>
            <p className="mt-6 text-base text-muted-foreground max-w-lg">
              Your business, one quiet workspace. Pick up where you left off.
            </p>
          </motion.div>

          {/* Business ID card */}
          {businessId && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-12 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                    Your business ID
                  </p>
                  <code className="text-2xl md:text-3xl tracking-[0.2em] text-brand">
                    {businessId}
                  </code>
                  <p className="text-xs text-muted-foreground mt-3 max-w-md">
                    Share with clients to pay at{" "}
                    <span className="text-foreground">reeddigitalgroup.com/portal</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(businessId);
                      toast.success("Business ID copied");
                    }}
                    className="text-[10px] uppercase tracking-[0.3em] px-4 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/85 transition-colors"
                  >
                    Copy ID
                  </button>
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="text-[10px] uppercase tracking-[0.3em] px-4 py-2.5 rounded-full border border-foreground/15 hover:border-foreground/40 transition-colors"
                  >
                    Instructions
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tiles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
            {tiles.map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <Link
                  to={tile.href}
                  className="block bg-background p-7 md:p-8 h-full hover:bg-foreground/[0.03] transition-colors group"
                >
                  <div className="flex items-start justify-between mb-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">
                      Open →
                    </span>
                  </div>
                  <h2 className="text-2xl tracking-tight mb-2 group-hover:text-brand transition-colors">
                    {tile.label}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tile.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-12 py-10 border-t border-foreground/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>© Reed Digital Group</span>
          <Link to="/home-office/help" className="hover:text-foreground transition-colors">Help & Support</Link>
        </div>
      </footer>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-lg font-mono">
          <DialogHeader>
            <DialogTitle>How clients pay you</DialogTitle>
            <DialogDescription>Share these 3 steps with your client.</DialogDescription>
          </DialogHeader>

          <ol className="space-y-3 text-sm mt-2">
            <li><span className="text-brand font-bold">1.</span> Send them your Business ID: <code className="text-brand font-bold">{businessId}</code></li>
            <li><span className="text-brand font-bold">2.</span> Tell them to go to <span className="font-bold">https://reeddigitalgroup.com/portal</span></li>
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
                  const body = `Hi,\n\nYour invoice is ready. Here's how to pay:\n\n1. Go to: https://reeddigitalgroup.com/portal\n2. Enter our Business ID: ${businessId}\n3. Enter the email address this invoice was sent to\n4. Pay with card, Zelle, or Cash App\n\nThanks,\n${displayName || businessName}`;
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

1. Go to: https://reeddigitalgroup.com/portal
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
