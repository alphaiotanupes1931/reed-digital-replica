import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function randomToken(len = 24) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, len);
}

function randomPasscode() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const num = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2];
  return (num % 1000000).toString().padStart(6, "0");
}

async function hashPasscode(code: string) {
  const data = new TextEncoder().encode(code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, ...data } = await req.json();

    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const { data: userData, error: userErr } = await authClient.auth.getUser(jwt);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const userId = userData.user.id;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "get_settings") {
      let { data: settings } = await supabase
        .from("accountant_settings")
        .select("*")
        .eq("owner_user_id", userId)
        .maybeSingle();
      if (!settings) {
        const ins = await supabase
          .from("accountant_settings")
          .insert({ owner_user_id: userId })
          .select()
          .single();
        settings = ins.data;
      }
      const { data: invites } = await supabase
        .from("accountant_invites")
        .select("*")
        .eq("owner_user_id", userId)
        .is("revoked_at", null)
        .order("created_at", { ascending: false });
      // never return passcode hash
      if (settings) delete (settings as any).share_passcode_hash;
      return new Response(JSON.stringify({ settings, invites: invites ?? [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_settings") {
      const { published, show_bills, show_invoices, show_writeoffs, show_notes } = data;
      const updates: Record<string, unknown> = {};
      if (published !== undefined) updates.published = !!published;
      if (show_bills !== undefined) updates.show_bills = !!show_bills;
      if (show_invoices !== undefined) updates.show_invoices = !!show_invoices;
      if (show_writeoffs !== undefined) updates.show_writeoffs = !!show_writeoffs;
      if (show_notes !== undefined) updates.show_notes = !!show_notes;
      // upsert
      const { data: existing } = await supabase
        .from("accountant_settings")
        .select("id")
        .eq("owner_user_id", userId)
        .maybeSingle();
      if (!existing) {
        await supabase.from("accountant_settings").insert({ owner_user_id: userId, ...updates });
      } else {
        await supabase.from("accountant_settings").update(updates).eq("owner_user_id", userId);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate_share") {
      const token = randomToken(24);
      const passcode = randomPasscode();
      const hash = await hashPasscode(passcode);
      const { data: existing } = await supabase
        .from("accountant_settings")
        .select("id")
        .eq("owner_user_id", userId)
        .maybeSingle();
      if (!existing) {
        await supabase.from("accountant_settings").insert({
          owner_user_id: userId,
          share_token: token,
          share_passcode_hash: hash,
        });
      } else {
        await supabase
          .from("accountant_settings")
          .update({ share_token: token, share_passcode_hash: hash })
          .eq("owner_user_id", userId);
      }
      return new Response(JSON.stringify({ token, passcode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "revoke_share") {
      await supabase
        .from("accountant_settings")
        .update({ share_token: null, share_passcode_hash: null })
        .eq("owner_user_id", userId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_invite") {
      const { email } = data;
      if (!email || typeof email !== "string") {
        return new Response(JSON.stringify({ error: "Email required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      const invite_token = randomToken(32);
      const { data: invite, error } = await supabase
        .from("accountant_invites")
        .insert({ owner_user_id: userId, email: email.toLowerCase().trim(), invite_token })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ invite }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "revoke_invite") {
      const { id } = data;
      await supabase
        .from("accountant_invites")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", id)
        .eq("owner_user_id", userId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Month closes
    if (action === "list_month_closes") {
      const { data: closes } = await supabase
        .from("month_closes")
        .select("*")
        .eq("owner_user_id", userId);
      return new Response(JSON.stringify({ closes: closes ?? [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "close_month") {
      const { year, month } = data;
      const { error } = await supabase
        .from("month_closes")
        .upsert({ owner_user_id: userId, year, month, closed_at: new Date().toISOString() }, { onConflict: "owner_user_id,year,month" });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reopen_month") {
      const { year, month } = data;
      await supabase
        .from("month_closes")
        .delete()
        .eq("owner_user_id", userId)
        .eq("year", year)
        .eq("month", month);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});