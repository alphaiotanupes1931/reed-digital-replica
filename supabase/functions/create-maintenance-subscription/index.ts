import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FEE_RATE = 0.029;
const FEE_FLAT = 1.30;
const addFee = (amount: number) =>
  Math.round((amount + amount * FEE_RATE + FEE_FLAT) * 100) / 100;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe not configured");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { client_id, monthly_price, plan_label } = await req.json();
    if (!client_id) throw new Error("client_id is required");
    const price = Number(monthly_price);
    if (!price || price <= 0) throw new Error("Invalid monthly_price");

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("*")
      .eq("id", client_id)
      .maybeSingle();
    if (clientErr || !client) throw new Error("Client not found");

    const total = addFee(price);
    const unitAmount = Math.round(total * 100);

    // First charge on the 1st of next month (UTC)
    const now = new Date();
    const trialEnd = Math.floor(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0) / 1000
    );

    const origin = req.headers.get("origin") || "https://reeddigitalgroup.com";
    const label = plan_label || "Monthly Maintenance";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: client.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${label} - ${client.company_name}`,
              description: "Recurring monthly website maintenance",
            },
            unit_amount: unitAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_end: trialEnd,
        metadata: {
          client_id: client.id,
          plan_label: label,
          monthly_base_price: String(price),
        },
      },
      success_url: `${origin}/portal?payment=success`,
      cancel_url: `${origin}/portal?payment=cancelled`,
      metadata: {
        client_id: client.id,
        plan_label: label,
        type: "maintenance_subscription",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});