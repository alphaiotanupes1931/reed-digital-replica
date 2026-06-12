import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();

    // Validate Supabase JWT from Authorization header
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
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

    // Daily notes actions
    if (action === "get_notes") {
      const { date } = data;
      const { data: notes, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("owner_user_id", userId)
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
        .eq("owner_user_id", userId)
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
        .eq("owner_user_id", userId)
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
        .insert({ content, note_type: note_type || "note", note_date: note_date || new Date().toISOString().split("T")[0], owner_user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ note }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_note") {
      const { id } = data;
      const { error } = await supabase.from("daily_notes").delete().eq("id", id).eq("owner_user_id", userId);
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
        .eq("owner_user_id", userId)
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
        .insert({ title, description, owner_user_id: userId })
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
        .eq("id", id)
        .eq("owner_user_id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_goal") {
      const { id } = data;
      const { error } = await supabase.from("goals").delete().eq("id", id).eq("owner_user_id", userId);
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
        .eq("owner_user_id", userId)
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
        .insert({ company_name, price: Number(price) || 0, notes: notes || null, owner_user_id: userId })
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
      const { error } = await supabase.from("monthly_bills").update(updates).eq("id", id).eq("owner_user_id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_bill") {
      const { id } = data;
      const { error } = await supabase.from("monthly_bills").delete().eq("id", id).eq("owner_user_id", userId);
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
        .eq("owner_user_id", userId)
        .not("maintenance_plan", "is", null);
      if (error) throw error;
      return new Response(JSON.stringify({ clients }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extra income actions
    if (action === "get_extra_income") {
      const { data: items, error } = await supabase
        .from("extra_income")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ items }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_extra_income") {
      const { source, price, notes, category } = data;
      const { data: item, error } = await supabase
        .from("extra_income")
        .insert({ source, price: Number(price) || 0, notes: notes || null, category: category || "extra", owner_user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ item }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_extra_income") {
      const { id, source, price, notes, category } = data;
      const updates: Record<string, unknown> = {};
      if (source !== undefined) updates.source = source;
      if (price !== undefined) updates.price = Number(price) || 0;
      if (notes !== undefined) updates.notes = notes;
      if (category !== undefined) updates.category = category;
      const { error } = await supabase.from("extra_income").update(updates).eq("id", id).eq("owner_user_id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_extra_income") {
      const { id } = data;
      const { error } = await supabase.from("extra_income").delete().eq("id", id).eq("owner_user_id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tax reminders actions
    if (action === "get_tax_reminders") {
      const { data: items, error } = await supabase
        .from("tax_reminders")
        .select("*")
        .eq("owner_user_id", userId)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ items }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_tax_reminder") {
      const { title, amount, due_date, notes, paid } = data;
      const { data: item, error } = await supabase
        .from("tax_reminders")
        .insert({
          title,
          amount: Number(amount) || 0,
          due_date: due_date || null,
          notes: notes || null,
          paid: !!paid,
          owner_user_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ item }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_tax_reminder") {
      const { id, title, amount, due_date, notes, paid } = data;
      const updates: Record<string, unknown> = {};
      if (title !== undefined) updates.title = title;
      if (amount !== undefined) updates.amount = Number(amount) || 0;
      if (due_date !== undefined) updates.due_date = due_date || null;
      if (notes !== undefined) updates.notes = notes;
      if (paid !== undefined) updates.paid = !!paid;
      const { error } = await supabase.from("tax_reminders").update(updates).eq("id", id).eq("owner_user_id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_tax_reminder") {
      const { id } = data;
      const { error } = await supabase.from("tax_reminders").delete().eq("id", id).eq("owner_user_id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
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
