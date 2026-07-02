import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import NotificationBell from "@/components/NotificationBell";
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
        .select("full_name, onboarded, subscribed, business_id, business_name, recovery_setup_complete, account_type")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (profile?.account_type === "accountant") {
        navigate("/home-office/accountant", { replace: true });
        return;
      }
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
    <div className="min-h-screen bg-background font-mono">
      <nav className="border-b border-foreground/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← RDG
        </Link>
        <span className="text-xs uppercase tracking-widest text-muted-foreground hidden md:block">
          Home Office {displayName ? `· ${displayName}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest px-3 py-2 border border-foreground/20 hover:border-foreground/50"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl tracking-tight font-bold">
            Welcome back{displayName ? `, ${displayName}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick up where you left off.
          </p>
        </div>

        {businessId && (
          <div className="mb-8 border border-foreground/15 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Your business ID
              </p>
              <code className="text-xl md:text-2xl tracking-widest text-brand">{businessId}</code>
              <p className="text-xs text-muted-foreground mt-2">
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
                className="text-xs uppercase tracking-widest px-4 py-2 bg-foreground text-background hover:bg-foreground/85"
              >
                Copy ID
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="text-xs uppercase tracking-widest px-4 py-2 border border-foreground/20 hover:border-foreground/50"
              >
                Instructions
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.href}
              className="block border border-foreground/15 p-6 hover:border-foreground/40 transition-colors"
            >
              <h2 className="text-lg mb-1">{tile.label}</h2>
              <p className="text-sm text-muted-foreground">{tile.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      <footer className="px-6 py-6 border-t border-foreground/10 flex justify-end text-xs uppercase tracking-widest text-muted-foreground">
        <Link to="/home-office/help" className="hover:text-foreground">Help</Link>
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
