import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { client_id, amount, note } = await req.json();
    if (!client_id) throw new Error("client_id is required");
    const amt = Number(amount);
    if (!amt || amt <= 0 || amt > 100000) throw new Error("Invalid amount");

    const { data: client, error } = await supabase
      .from("clients")
      .select("id, company_name, email")
      .eq("id", client_id)
      .single();
    if (error || !client) throw new Error("Client not found");

    // Fee: 2.9% + $1.30
    const FEE_RATE = 0.029;
    const FEE_FLAT = 1.30;
    const total = Math.round((amt + amt * FEE_RATE + FEE_FLAT) * 100) / 100;

    const origin = req.headers.get("origin") || "https://lovable.dev";
    const cleanNote = (note || "").toString().slice(0, 200);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: client.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Custom Payment - ${client.company_name}`,
              description: cleanNote || "Additional payment",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/portal/thank-you`,
      cancel_url: `${origin}/portal?payment=cancelled`,
      metadata: {
        client_id: client.id,
        payment_type: "custom_one_time",
        base_amount: String(amt),
        note: cleanNote,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("create-custom-payment error:", error?.message, error?.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});