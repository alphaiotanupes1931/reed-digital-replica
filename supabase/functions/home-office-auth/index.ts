import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_USERNAME = "terell.reed";
const ADMIN_PASSWORD = "shell0423";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, username, password, ...data } = await req.json();

    // Auth check
    if (action === "login") {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ success: true, token: "rdg-home-office-2024" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Verify token for all other actions
    if (data.token !== "rdg-home-office-2024") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Daily notes actions
    if (action === "get_notes") {
      const { date } = data;
      const { data: notes, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("note_date", date)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ notes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_notes_range") {
      const { start_date, end_date } = data;
      const { data: notes, error } = await supabase
        .from("daily_notes")
        .select("*")
        .gte("note_date", start_date)
        .lte("note_date", end_date)
        .order("note_date", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ notes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_all_note_dates") {
      const { data: dates, error } = await supabase
        .from("daily_notes")
        .select("note_date")
        .order("note_date", { ascending: false });
      if (error) throw error;
      const uniqueDates = [...new Set(dates.map((d: any) => d.note_date))];
      return new Response(JSON.stringify({ dates: uniqueDates }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_note") {
      const { content, note_type, note_date } = data;
      const { data: note, error } = await supabase
        .from("daily_notes")
        .insert({ content, note_type: note_type || "note", note_date: note_date || new Date().toISOString().split("T")[0] })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ note }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_note") {
      const { id } = data;
      const { error } = await supabase.from("daily_notes").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Goals actions
    if (action === "get_goals") {
      const { data: goals, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ goals }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_goal") {
      const { title, description } = data;
      const { data: goal, error } = await supabase
        .from("goals")
        .insert({ title, description })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ goal }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "toggle_goal") {
      const { id, completed } = data;
      const { error } = await supabase
        .from("goals")
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_goal") {
      const { id } = data;
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Monthly bills actions
    if (action === "get_bills") {
      const { data: bills, error } = await supabase
        .from("monthly_bills")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ bills }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_bill") {
      const { company_name, price, notes } = data;
      const { data: bill, error } = await supabase
        .from("monthly_bills")
        .insert({ company_name, price: Number(price) || 0, notes: notes || null })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ bill }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_bill") {
      const { id, company_name, price, notes } = data;
      const updates: Record<string, unknown> = {};
      if (company_name !== undefined) updates.company_name = company_name;
      if (price !== undefined) updates.price = Number(price) || 0;
      if (notes !== undefined) updates.notes = notes;
      const { error } = await supabase.from("monthly_bills").update(updates).eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_bill") {
      const { id } = data;
      const { error } = await supabase.from("monthly_bills").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Maintenance income from clients table
    if (action === "get_maintenance_income") {
      const { data: clients, error } = await supabase
        .from("clients")
        .select("id, company_name, owner_name, email, maintenance_plan")
        .not("maintenance_plan", "is", null);
      if (error) throw error;
      return new Response(JSON.stringify({ clients }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
