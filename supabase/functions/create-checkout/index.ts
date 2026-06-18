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

    const {
      invoice_id,
      pay_deposit,
      payment_type,
      include_maintenance,
      maintenance_price,
      maintenance_label,
      pay_monthly_plan,
    } = await req.json();
    if (!invoice_id) throw new Error("invoice_id is required");
    const mode: "payment" | "subscription" =
      payment_type === "subscription" || include_maintenance || pay_monthly_plan ? "subscription" : "payment";

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

    // ── Monthly payment plan branch ─────────────────────────────────────────
    if (pay_monthly_plan) {
      if (invoice.payment_plan !== "monthly" || !invoice.plan_monthly_amount || !invoice.plan_end_date) {
        throw new Error("This invoice has no monthly payment plan configured.");
      }
      const monthly = Number(invoice.plan_monthly_amount);
      const months = Number(invoice.plan_months || 0);
      const monthlyTotal = addFee(monthly);

      // Stripe subscription that auto-cancels at plan end date.
      const cancelAt = Math.floor(new Date(invoice.plan_end_date as string).getTime() / 1000);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: client.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${invoice.service} — Monthly Plan (${months} months)`,
                description: `${months} monthly payments of $${monthly.toFixed(2)} — ${client.company_name}`,
              },
              unit_amount: Math.round(monthlyTotal * 100),
              recurring: { interval: "month" as const },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: {
          cancel_at: cancelAt,
          metadata: {
            invoice_id: invoice.id,
            client_id: client.id,
            type: "invoice_monthly_plan",
            months: String(months),
          },
        },
        success_url: `${origin}/portal/thank-you`,
        cancel_url: `${origin}/portal?payment=cancelled`,
        metadata: {
          invoice_id: invoice.id,
          payment_type: "monthly_plan",
        },
      });

      await supabase
        .from("invoices")
        .update({
          stripe_checkout_session_id: session.id,
          payment_type: "subscription",
        })
        .eq("id", invoice.id);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    // Subscription mode disallows deposit-only payments and always charges full total monthly
    const isSubscription = mode === "subscription";
    const bundled = !!include_maintenance && !pay_deposit;
    const finalUnitAmount = isSubscription && !bundled
      ? Math.round(addFee(invoice.price) * 100)
      : Math.round(paymentAmount * 100);
    const finalName = isSubscription && !bundled
      ? `${invoice.service} (Monthly) - ${client.company_name}`
      : `${description} - ${client.company_name}`;

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: finalName,
            description:
              isSubscription && !bundled
                ? `Recurring monthly charge`
                : `Invoice due ${invoice.due_date}`,
          },
          unit_amount: finalUnitAmount,
          ...(isSubscription && !bundled
            ? { recurring: { interval: "month" as const } }
            : {}),
        },
        quantity: 1,
      },
    ];

    // Bundle monthly maintenance subscription, starting next month (use trial_end)
    let trialEnd: number | undefined;
    if (bundled) {
      const monthly = Number(maintenance_price);
      if (!monthly || monthly <= 0) throw new Error("Invalid maintenance_price");
      const monthlyTotal = addFee(monthly);
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${maintenance_label || "Monthly Maintenance"} - ${client.company_name}`,
            description: "Recurring monthly website maintenance — first charge on the 1st of next month",
          },
          unit_amount: Math.round(monthlyTotal * 100),
          recurring: { interval: "month" as const },
        },
        quantity: 1,
      });
      const now = new Date();
      trialEnd = Math.floor(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0) / 1000
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: client.email,
      line_items: lineItems,
      mode,
      ...(bundled && trialEnd
        ? {
            subscription_data: {
              trial_end: trialEnd,
              metadata: {
                client_id: client.id,
                plan_label: maintenance_label || "Monthly Maintenance",
                monthly_base_price: String(maintenance_price),
                type: "maintenance_subscription_bundled",
              },
            },
          }
        : {}),
      success_url: `${origin}/portal/thank-you`,
      cancel_url: `${origin}/portal?payment=cancelled`,
      metadata: {
        invoice_id: invoice.id,
        is_deposit: pay_deposit ? "true" : "false",
        payment_type: isSubscription
          ? bundled
            ? "bundled_build_plus_subscription"
            : "subscription"
          : "one_time",
      },
    });

    await supabase
      .from("invoices")
      .update({
        stripe_checkout_session_id: session.id,
        payment_type: isSubscription ? "subscription" : "one_time",
      })
      .eq("id", invoice.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("create-checkout error:", error?.message, error?.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
