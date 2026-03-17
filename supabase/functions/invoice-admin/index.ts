import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_PASSWORD = "rdg2024admin";

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

    if (action === "create_invoice") {
      const { company_name, email, service, price, due_date } = data;

      // Upsert client
      let { data: client, error: clientError } = await supabase
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
        // Update company name if changed
        await supabase.from("clients").update({ company_name }).eq("id", client.id);
      }

      const { error: invoiceError } = await supabase.from("invoices").insert({
        client_id: client.id,
        service,
        price,
        due_date,
        status: "draft",
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
