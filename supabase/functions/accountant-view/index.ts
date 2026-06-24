import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashPasscode(code: string) {
  const data = new TextEncoder().encode(code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { token, passcode } = await req.json();
    if (!token || !passcode) {
      return new Response(JSON.stringify({ error: "Token and passcode required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: settings } = await supabase
      .from("accountant_settings")
      .select("*")
      .eq("share_token", token)
      .maybeSingle();
    if (!settings) {
      return new Response(JSON.stringify({ error: "Invalid link" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
    if (!settings.published) {
      return new Response(JSON.stringify({ error: "Finances are not currently published." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    const hash = await hashPasscode(String(passcode));
    if (hash !== settings.share_passcode_hash) {
      return new Response(JSON.stringify({ error: "Incorrect passcode" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const ownerId = settings.owner_user_id;
    const result: Record<string, unknown> = {
      published: true,
      sections: {
        bills: settings.show_bills,
        invoices: settings.show_invoices,
        writeoffs: settings.show_writeoffs,
        notes: settings.show_notes,
        taxes: settings.show_taxes ?? true,
      },
    };

    // Owner display name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name")
      .eq("user_id", ownerId)
      .maybeSingle();
    result.owner = profile ?? null;

    if (settings.show_bills) {
      const { data: bills } = await supabase
        .from("monthly_bills")
        .select("id, company_name, price, notes, created_at")
        .eq("owner_user_id", ownerId);
      result.bills = bills ?? [];
    }
    if (settings.show_invoices) {
      const { data: invoices } = await supabase
        .from("invoices")
        .select("id, amount, status, paid_at, created_at, description, client_id")
        .eq("owner_user_id", ownerId)
        .order("created_at", { ascending: false });
      result.invoices = invoices ?? [];
    }
    if (settings.show_notes) {
      const { data: notes } = await supabase
        .from("daily_notes")
        .select("id, content, note_type, note_date, created_at")
        .eq("owner_user_id", ownerId)
        .order("note_date", { ascending: false })
        .limit(200);
      result.notes = notes ?? [];
    }
    if (settings.show_writeoffs) {
      // Phase 3 will add bank_transactions; placeholder for now
      result.writeoffs = [];
    }

    if (settings.show_taxes ?? true) {
      const [{ data: income }, { data: w2Docs }, { data: expenses }, { data: mileage }, { data: reminders }] = await Promise.all([
        supabase.from("tax_income_entries").select("id, entry_date, source, amount, notes, invoice_id, date_precision").eq("owner_user_id", ownerId).order("entry_date", { ascending: false }),
        supabase.from("tax_w2_documents").select("id, year, employer, file_path, file_name, mime_type, size_bytes, notes, created_at").eq("owner_user_id", ownerId).order("year", { ascending: false }),
        supabase.from("tax_expenses").select("id, entry_date, category, description, amount, receipt_note").eq("owner_user_id", ownerId).order("entry_date", { ascending: false }),
        supabase.from("tax_mileage_entries").select("id, entry_date, purpose, miles, gas_amount, vehicle").eq("owner_user_id", ownerId).order("entry_date", { ascending: false }),
        supabase.from("tax_reminders").select("id, title, amount, due_date, paid, notes").eq("owner_user_id", ownerId).order("due_date", { ascending: true }),
      ]);
      const w2DocsWithUrls = await Promise.all(
        (w2Docs ?? []).map(async (d: any) => {
          const { data: signed } = await supabase.storage.from("w2-forms").createSignedUrl(d.file_path, 60 * 60);
          return { ...d, download_url: signed?.signedUrl ?? null };
        })
      );
      result.taxes = {
        income: income ?? [],
        w2_documents: w2DocsWithUrls,
        expenses: expenses ?? [],
        mileage: mileage ?? [],
        reminders: reminders ?? [],
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});