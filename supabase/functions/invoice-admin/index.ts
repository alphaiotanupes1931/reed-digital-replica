import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_PASSWORD = "shell0423";

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

    if (action === "list_clients") {
      const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ clients }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_client") {
      const { company_name, email, owner_name } = data;
      const { data: existing } = await supabase
        .from("clients").select("*").eq("email", email).maybeSingle();
      if (existing) {
        const { data: updated, error } = await supabase
          .from("clients")
          .update({ company_name, owner_name })
          .eq("id", existing.id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ client: updated }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: client, error } = await supabase
        .from("clients")
        .insert({ company_name, email, owner_name })
        .select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ client }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save_sow") {
      const { client_id, scope_of_work, phases, owner_name, company_name, project_type, project_build_cost, project_maintenance_cost, project_estimated_total } = data;
      const updates: Record<string, unknown> = {};
      if (scope_of_work !== undefined) updates.scope_of_work = scope_of_work;
      if (phases !== undefined) updates.phases = phases;
      if (owner_name !== undefined) updates.owner_name = owner_name;
      if (company_name !== undefined) updates.company_name = company_name;
      if (project_type !== undefined) updates.project_type = project_type;
      if (project_build_cost !== undefined) updates.project_build_cost = project_build_cost;
      if (project_maintenance_cost !== undefined) updates.project_maintenance_cost = project_maintenance_cost;
      if (project_estimated_total !== undefined) updates.project_estimated_total = project_estimated_total;
      const { error } = await supabase.from("clients").update(updates).eq("id", client_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_sow_comment") {
      const { client_id, comment_index } = data;
      const { data: c } = await supabase.from("clients").select("sow_comments").eq("id", client_id).maybeSingle();
      const existing: Array<{ author: string; message: string; created_at: string }> = Array.isArray(c?.sow_comments) ? c!.sow_comments : [];
      if (typeof comment_index !== "number" || comment_index < 0 || comment_index >= existing.length) {
        throw new Error("Invalid comment index");
      }
      existing.splice(comment_index, 1);
      const { error } = await supabase.from("clients").update({ sow_comments: existing }).eq("id", client_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_invoice") {
      const { company_name, email, service, price, due_date, deposit_required, deposit_amount, deposit_due_date, message, owner_name, client_id, payment_method } = data;
      // Normalize payment_method: accepts "stripe", "zelle", "stripe,zelle", or an array.
      const normalizeMethod = (v: unknown): string => {
        const arr = Array.isArray(v)
          ? v
          : typeof v === "string"
          ? v.split(",")
          : [];
        const clean = arr
          .map((m: unknown) => String(m).trim().toLowerCase())
          .filter((m: string) => m === "stripe" || m === "zelle");
        const unique = Array.from(new Set(clean));
        return unique.length ? unique.join(",") : "stripe";
      };

      let client;
      if (client_id) {
        const { data: existing } = await supabase.from("clients").select("*").eq("id", client_id).maybeSingle();
        client = existing;
      } else {
        const { data: byEmail } = await supabase
          .from("clients").select("*").eq("email", email).maybeSingle();
        client = byEmail;
      }

      if (!client) {
        const { data: newClient, error: insertError } = await supabase
          .from("clients")
          .insert({ company_name, email, owner_name: owner_name || null })
          .select()
          .single();

        if (insertError) throw insertError;
        client = newClient;
      } else {
        const upd: Record<string, unknown> = {};
        if (company_name) upd.company_name = company_name;
        if (owner_name) upd.owner_name = owner_name;
        if (Object.keys(upd).length) await supabase.from("clients").update(upd).eq("id", client.id);
      }

      // Enforce: only one ACTIVE (non-deactivated) invoice per client at a time.
      const { data: activeExisting } = await supabase
        .from("invoices")
        .select("id")
        .eq("client_id", client.id)
        .eq("deactivated", false)
        .limit(1);
      if (activeExisting && activeExisting.length > 0) {
        return new Response(
          JSON.stringify({
            error:
              "This client already has an active invoice. Deactivate it first before creating a new one.",
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
        message: message || null,
        payment_method: normalizeMethod(payment_method),
      });

      if (invoiceError) throw invoiceError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_deliverables") {
      const { invoice_id, deliverables } = data;
      const { error } = await supabase
        .from("invoices")
        .update({ deliverables })
        .eq("id", invoice_id);

      if (error) throw error;

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

    if (action === "set_status") {
      const { invoice_id, status } = data;
      const updates: Record<string, unknown> = { status };
      if (status === "paid") {
        updates.deposit_paid = true;
      }
      const { error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", invoice_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_payment_method") {
      const { invoice_id, payment_method } = data;
      const arr = Array.isArray(payment_method)
        ? payment_method
        : typeof payment_method === "string"
        ? payment_method.split(",")
        : [];
      const clean = arr
        .map((m: unknown) => String(m).trim().toLowerCase())
        .filter((m: string) => m === "stripe" || m === "zelle");
      const unique = Array.from(new Set(clean));
      const method = unique.length ? unique.join(",") : "stripe";
      const { error } = await supabase
        .from("invoices")
        .update({ payment_method: method })
        .eq("id", invoice_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_visibility") {
      const { invoice_id, hidden_from_client } = data;
      const { error } = await supabase
        .from("invoices")
        .update({ hidden_from_client: !!hidden_from_client })
        .eq("id", invoice_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_sow_hidden") {
      const { client_id, sow_hidden } = data;
      const { error } = await supabase
        .from("clients")
        .update({ sow_hidden: !!sow_hidden })
        .eq("id", client_id);
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

    if (action === "set_deactivated") {
      const { invoice_id, deactivated } = data;
      if (!deactivated) {
        // Re-activating: must not conflict with another active invoice on same client.
        const { data: inv } = await supabase
          .from("invoices")
          .select("client_id")
          .eq("id", invoice_id)
          .maybeSingle();
        if (!inv) throw new Error("Invoice not found");
        const { data: conflict } = await supabase
          .from("invoices")
          .select("id")
          .eq("client_id", inv.client_id)
          .eq("deactivated", false)
          .neq("id", invoice_id)
          .limit(1);
        if (conflict && conflict.length > 0) {
          return new Response(
            JSON.stringify({
              error:
                "This client already has another active invoice. Deactivate that one first to reactivate this invoice.",
            }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      const { error } = await supabase
        .from("invoices")
        .update({ deactivated: !!deactivated })
        .eq("id", invoice_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_payment_history") {
      const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
      if (!STRIPE_SECRET_KEY) throw new Error("Stripe not configured");
      const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

      const { client_id } = data;
      // Pull all invoices for the client (including deactivated) for full history.
      const { data: invs, error: invErr } = await supabase
        .from("invoices")
        .select("id, service, price, stripe_checkout_session_id, stripe_payment_intent_id, stripe_subscription_id, created_at")
        .eq("client_id", client_id);
      if (invErr) throw invErr;

      const payments: Array<{
        invoice_id: string | null;
        service: string | null;
        amount: number;
        currency: string;
        status: string;
        date: string;
        kind: "one_time" | "subscription" | "custom";
        description?: string;
      }> = [];

      for (const inv of (invs || [])) {
        // One-time / deposit checkout session
        if (inv.stripe_checkout_session_id) {
          try {
            const session = await stripe.checkout.sessions.retrieve(inv.stripe_checkout_session_id);
            if (session.payment_intent && session.payment_status === "paid") {
              const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string);
              payments.push({
                invoice_id: inv.id,
                service: inv.service,
                amount: (pi.amount_received || pi.amount) / 100,
                currency: pi.currency.toUpperCase(),
                status: pi.status,
                date: new Date(pi.created * 1000).toISOString(),
                kind: "one_time",
              });
            }
          } catch (e) { console.error("session lookup failed", e); }
        }
        // Subscription invoices (monthly maintenance)
        if (inv.stripe_subscription_id) {
          try {
            const list = await stripe.invoices.list({ subscription: inv.stripe_subscription_id, limit: 100 });
            for (const sInv of list.data) {
              if (sInv.status === "paid" && sInv.amount_paid > 0) {
                payments.push({
                  invoice_id: inv.id,
                  service: inv.service,
                  amount: sInv.amount_paid / 100,
                  currency: (sInv.currency || "usd").toUpperCase(),
                  status: "paid",
                  date: new Date((sInv.status_transitions?.paid_at || sInv.created) * 1000).toISOString(),
                  kind: "subscription",
                  description: sInv.lines?.data?.[0]?.description || "Subscription payment",
                });
              }
            }
          } catch (e) { console.error("subscription lookup failed", e); }
        }
      }

      // Also include custom one-off payments (Stripe sessions with metadata.client_id matching).
      try {
        // Search the latest 100 paid checkout sessions referencing this client via metadata.
        const sessions = await stripe.checkout.sessions.list({ limit: 100 });
        for (const s of sessions.data) {
          if (s.metadata?.client_id === client_id && s.metadata?.payment_type === "custom_one_time" && s.payment_status === "paid") {
            payments.push({
              invoice_id: null,
              service: s.metadata?.note || "Custom payment",
              amount: (s.amount_total || 0) / 100,
              currency: (s.currency || "usd").toUpperCase(),
              status: "paid",
              date: new Date(s.created * 1000).toISOString(),
              kind: "custom",
            });
          }
        }
      } catch (e) { console.error("custom session list failed", e); }

      payments.sort((a, b) => (a.date < b.date ? 1 : -1));

      return new Response(JSON.stringify({ payments, count: payments.length, total: payments.reduce((s, p) => s + p.amount, 0) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_invoice_legacy_dup") {
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

    if (action === "update_invoice") {
      const { invoice_id, service, price, due_date, message, deposit_required, deposit_amount, deposit_due_date, payment_method } = data;
      const updates: Record<string, unknown> = {};
      if (service !== undefined) updates.service = service;
      if (price !== undefined) updates.price = price;
      if (due_date !== undefined) updates.due_date = due_date;
      if (message !== undefined) updates.message = message;
      if (deposit_required !== undefined) updates.deposit_required = deposit_required;
      if (deposit_amount !== undefined) updates.deposit_amount = deposit_amount;
      if (deposit_due_date !== undefined) updates.deposit_due_date = deposit_due_date;
      if (payment_method !== undefined) {
        const arr = Array.isArray(payment_method)
          ? payment_method
          : typeof payment_method === "string"
          ? payment_method.split(",")
          : [];
        const clean = arr
          .map((m: unknown) => String(m).trim().toLowerCase())
          .filter((m: string) => m === "stripe" || m === "zelle");
        const unique = Array.from(new Set(clean));
        updates.payment_method = unique.length ? unique.join(",") : "stripe";
      }
      const { error } = await supabase.from("invoices").update(updates).eq("id", invoice_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_invoice_disabled_old_marker") {
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

    if (action === "delete_client") {
      const { client_id } = data;
      // Delete invoices first (no FK cascade configured)
      const { error: invErr } = await supabase.from("invoices").delete().eq("client_id", client_id);
      if (invErr) throw invErr;
      const { error } = await supabase.from("clients").delete().eq("id", client_id);
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
