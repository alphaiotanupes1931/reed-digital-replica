import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export type AppsUser = { id: string; email: string; name: string };

export function useAppsAuth() {
  const [user, setUser] = useState<AppsUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const sync = (session: any) => {
      if (!mounted) return;
      if (!session) {
        navigate("/apps/login");
        return;
      }
      const u = session.user;
      setUser({
        id: u.id,
        email: u.email,
        name: (u.user_metadata?.full_name as string) || u.email.split("@")[0],
      });
      setLoading(false);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => sync(session));
    supabase.auth.getSession().then(({ data }) => sync(data.session));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  return { user, loading };
}