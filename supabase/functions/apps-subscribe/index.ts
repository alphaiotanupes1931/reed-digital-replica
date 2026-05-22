import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_PRICES = new Set([
  "price_1TZkBeLmYe19xWnILOPARN9c", // Starter
  "price_1TZkBfLmYe19xWnIDRoMFspp", // Suite
  "price_1TZkBfLmYe19xWnIwlTExp38", // Business
]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user?.email) throw new Error("You must be signed in to start a subscription");
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const priceId = body.priceId as string | undefined;
    if (!priceId || !ALLOWED_PRICES.has(priceId)) throw new Error("Invalid plan selected");

    const origin = req.headers.get("origin") || "https://reeddigitalgroup.com";

    // Reuse existing Stripe customer if any
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { user_id: user.id },
      },
      allow_promotion_codes: true,
      success_url: `${origin}/apps/dashboard?checkout=success`,
      cancel_url: `${origin}/apps/dashboard?checkout=cancelled`,
      metadata: { user_id: user.id, price_id: priceId },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});