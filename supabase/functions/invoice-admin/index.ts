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
