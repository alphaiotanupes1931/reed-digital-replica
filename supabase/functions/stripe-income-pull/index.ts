import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    const authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: userData } = jwt ? await authClient.auth.getUser(jwt) : { data: { user: null } } as any;
    const userId = userData?.user?.id as string | undefined;
    if (!userId) return new Response(JSON.stringify({ error: "Sign in required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_income_key, stripe_income_last_synced_at, stripe_income_choice")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.stripe_income_key) {
      return new Response(JSON.stringify({ skipped: true, reason: "no_key" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const stripe = new Stripe(profile.stripe_income_key, { apiVersion: "2025-08-27.basil" as any });

    // Pull charges since last sync (or year start). Cap to 100 newest.
    const sinceTs = profile.stripe_income_last_synced_at
      ? Math.floor(new Date(profile.stripe_income_last_synced_at).getTime() / 1000)
      : Math.floor(new Date(`${new Date().getFullYear()}-01-01T00:00:00Z`).getTime() / 1000);

    let charges: Stripe.Charge[] = [];
    try {
      const res = await stripe.charges.list({ limit: 100, created: { gte: sinceTs } });
      charges = res.data;
    } catch (err: any) {
      return new Response(JSON.stringify({ error: `Stripe error: ${err.message}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const successful = charges.filter((c) => c.status === "succeeded" && !c.refunded);
    let inserted = 0;
    for (const c of successful) {
      const amount = (c.amount_captured ?? c.amount) / 100;
      const date = new Date(c.created * 1000).toISOString().slice(0, 10);
      const source = c.description || c.statement_descriptor || (c.metadata?.product as string) || "Stripe charge";
      const { error } = await admin.from("tax_income_entries").upsert({
        owner_user_id: userId,
        entry_date: date,
        date_precision: "day",
        source,
        amount,
        notes: c.receipt_url || null,
        stripe_charge_id: c.id,
      } as any, { onConflict: "owner_user_id,stripe_charge_id", ignoreDuplicates: true });
      if (!error) inserted++;
    }

    await admin.from("profiles").update({ stripe_income_last_synced_at: new Date().toISOString() } as any).eq("user_id", userId);

    return new Response(JSON.stringify({ ok: true, scanned: successful.length, inserted }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});