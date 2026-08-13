import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "valid" | "done" | "already" | "invalid";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setState("invalid");
        return;
      }
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState("invalid");
          return;
        }
        if (data?.email) setEmail(data.email);
        setState(data?.already_unsubscribed ? "already" : "valid");
      } catch {
        setState("invalid");
      }
    };
    validate();
  }, [token]);

  const confirm = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      setState("done");
    } catch {
      setState("invalid");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Reed Digital Group
        </p>

        {state === "loading" && <p className="text-sm text-muted-foreground">Checking your link…</p>}

        {state === "valid" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Unsubscribe?</h1>
            <p className="text-sm text-muted-foreground">
              {email ? `${email} will stop receiving these emails.` : "You'll stop receiving these emails."}
            </p>
            <button
              onClick={confirm}
              disabled={submitting}
              className="w-full bg-brand text-brand-foreground rounded-full py-3 text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Updating…" : "Confirm unsubscribe"}
            </button>
          </>
        )}

        {state === "done" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">You're unsubscribed</h1>
            <p className="text-sm text-muted-foreground">
              {email || "This address"} won't receive these emails anymore.
            </p>
          </>
        )}

        {state === "already" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Already unsubscribed</h1>
            <p className="text-sm text-muted-foreground">Nothing else to do here.</p>
          </>
        )}

        {state === "invalid" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Link not valid</h1>
            <p className="text-sm text-muted-foreground">
              This unsubscribe link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
