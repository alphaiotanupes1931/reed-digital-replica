import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_PASSWORD = "admin123";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, password, ...data } = await req.json();

    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "list_invoices") {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("*, clients(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ invoices }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_invoice") {
      const { company_name, email, service, price, due_date, deposit_required, deposit_amount, deposit_due_date } = data;

      let { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (!client) {
        const { data: newClient, error: insertError } = await supabase
          .from("clients")
          .insert({ company_name, email })
          .select()
          .single();

        if (insertError) throw insertError;
        client = newClient;
      } else {
        await supabase.from("clients").update({ company_name }).eq("id", client.id);
      }

      const { error: invoiceError } = await supabase.from("invoices").insert({
        client_id: client.id,
        service,
        price,
        due_date,
        status: "approved",
        deposit_required: deposit_required || false,
        deposit_amount: deposit_amount || null,
        deposit_due_date: deposit_due_date || null,
      });

      if (invoiceError) throw invoiceError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "approve_invoice") {
      const { invoice_id } = data;
      const { error } = await supabase
        .from("invoices")
        .update({ status: "approved" })
        .eq("id", invoice_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_invoice") {
      const { invoice_id } = data;
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoice_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "sync_payments") {
      const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
      if (!STRIPE_SECRET_KEY) throw new Error("Stripe not configured");

      const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

      // Get all unpaid invoices that have a checkout session
      const { data: unpaidInvoices, error: fetchErr } = await supabase
        .from("invoices")
        .select("*")
        .neq("status", "paid")
        .not("stripe_checkout_session_id", "is", null);

      if (fetchErr) throw fetchErr;

      let updatedCount = 0;

      for (const inv of (unpaidInvoices || [])) {
        try {
          const session = await stripe.checkout.sessions.retrieve(inv.stripe_checkout_session_id);
          
          if (session.payment_status === "paid") {
            const isDeposit = session.metadata?.is_deposit === "true";
            
            if (isDeposit) {
              await supabase
                .from("invoices")
                .update({
                  deposit_paid: true,
                  stripe_payment_intent_id: session.payment_intent as string,
                })
                .eq("id", inv.id);
            } else {
              await supabase
                .from("invoices")
                .update({
                  status: "paid",
                  stripe_payment_intent_id: session.payment_intent as string,
                })
                .eq("id", inv.id);
            }
            updatedCount++;
          }
        } catch (e) {
          // Skip invalid sessions
          console.error(`Failed to check session for invoice ${inv.id}:`, e);
        }
      }

      return new Response(JSON.stringify({ success: true, updated: updatedCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
