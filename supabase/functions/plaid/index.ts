import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAID_ENV = (Deno.env.get("PLAID_ENV") || "sandbox").toLowerCase();
const PLAID_BASE = `https://${PLAID_ENV}.plaid.com`;
const PLAID_CLIENT_ID = Deno.env.get("PLAID_CLIENT_ID")!;
const PLAID_SECRET = Deno.env.get("PLAID_SECRET")!;

async function plaid(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${PLAID_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, ...body }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error_message || json?.error_code || `Plaid ${path} failed`);
  return json;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { action, ...payload } = await req.json();

    if (action === "create_link_token") {
      const out = await plaid("/link/token/create", {
        user: { client_user_id: user.id },
        client_name: "RDG Accounting",
        products: ["transactions"],
        country_codes: ["US"],
        language: "en",
      });
      return new Response(JSON.stringify({ link_token: out.link_token }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "exchange_public_token") {
      const { public_token, institution_name } = payload as { public_token: string; institution_name?: string };
      const ex = await plaid("/item/public_token/exchange", { public_token });
      await admin.from("plaid_items").insert({
        owner_user_id: user.id,
        item_id: ex.item_id,
        access_token: ex.access_token,
        institution_name: institution_name || null,
      });
      return new Response(JSON.stringify({ ok: true, item_id: ex.item_id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "sync") {
      const { data: items } = await admin.from("plaid_items").select("*").eq("owner_user_id", user.id);
      let added = 0;
      for (const item of items || []) {
        let cursor: string | null = item.cursor;
        let hasMore = true;
        while (hasMore) {
          const body: Record<string, unknown> = { access_token: item.access_token };
          if (cursor) body.cursor = cursor;
          const res = await plaid("/transactions/sync", body);
          const rows = (res.added || []).map((t: any) => ({
            owner_user_id: user.id,
            plaid_item_id: item.id,
            transaction_id: t.transaction_id,
            account_id: t.account_id,
            name: t.name,
            merchant_name: t.merchant_name,
            amount: t.amount,
            iso_currency_code: t.iso_currency_code,
            category: (t.personal_finance_category?.primary || (t.category || []).join(" / ")) ?? null,
            txn_date: t.date,
            pending: t.pending,
          }));
          if (rows.length) {
            await admin.from("bank_transactions").upsert(rows, { onConflict: "transaction_id", ignoreDuplicates: true });
            added += rows.length;
          }
          cursor = res.next_cursor;
          hasMore = res.has_more;
        }
        await admin.from("plaid_items").update({ cursor, last_synced_at: new Date().toISOString() }).eq("id", item.id);
      }
      return new Response(JSON.stringify({ ok: true, added }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "set_write_off") {
      const { id, value } = payload as { id: string; value: boolean | null };
      await admin.from("bank_transactions")
        .update({ is_write_off: value, reviewed_at: value === null ? null : new Date().toISOString() })
        .eq("id", id).eq("owner_user_id", user.id);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "disconnect") {
      const { id } = payload as { id: string };
      const { data: item } = await admin.from("plaid_items").select("access_token").eq("id", id).eq("owner_user_id", user.id).maybeSingle();
      if (item) {
        try { await plaid("/item/remove", { access_token: item.access_token }); } catch (_) {}
      }
      await admin.from("plaid_items").delete().eq("id", id).eq("owner_user_id", user.id);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});