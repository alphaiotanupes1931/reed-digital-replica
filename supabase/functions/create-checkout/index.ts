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

    const { invoice_id, pay_deposit } = await req.json();
    if (!invoice_id) throw new Error("invoice_id is required");

    // Get invoice with client info
    const { data: invoice, error: invError } = await supabase
      .from("invoices")
      .select("*, clients(*)")
      .eq("id", invoice_id)
      .single();

    if (invError || !invoice) throw new Error("Invoice not found");
    if (invoice.status === "paid") throw new Error("Invoice already paid");

    const client = invoice.clients;
    const origin = req.headers.get("origin") || "https://lovable.dev";

    // Fee calculation: 2.9% + $0.30
    const FEE_RATE = 0.029;
    const FEE_FLAT = 1.30;
    const addFee = (amount: number) => Math.round((amount + amount * FEE_RATE + FEE_FLAT) * 100) / 100;

    // Determine amount based on deposit or full payment
    let baseAmount: number;
    let description: string;

    if (pay_deposit && invoice.deposit_required && invoice.deposit_amount) {
      baseAmount = invoice.deposit_amount;
      description = `Deposit for ${invoice.service}`;
    } else if (invoice.deposit_required && invoice.deposit_paid && invoice.deposit_amount) {
      baseAmount = invoice.price - invoice.deposit_amount;
      description = `Remaining balance for ${invoice.service}`;
    } else {
      baseAmount = invoice.price;
      description = invoice.service;
    }

    const paymentAmount = addFee(baseAmount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: client.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${description} - ${client.company_name}`,
              description: `Invoice due ${invoice.due_date}`,
            },
            unit_amount: Math.round(paymentAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/portal/thank-you`,
      cancel_url: `${origin}/portal?payment=cancelled`,
      metadata: {
        invoice_id: invoice.id,
        is_deposit: pay_deposit ? "true" : "false",
      },
    });

    await supabase
      .from("invoices")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", invoice.id);

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
