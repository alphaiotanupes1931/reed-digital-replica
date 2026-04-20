import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Comment {
  author: "client" | "admin";
  message: string;
  created_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, action, message, status, comment_index, maintenance_plan } = await req.json();
    if (!email) throw new Error("Email required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: client, error: cErr } = await supabase
      .from("clients").select("*").eq("email", email).maybeSingle();
    if (cErr) throw cErr;
    if (!client) throw new Error("Client not found");

    const updates: Record<string, unknown> = {};
    const existing: Comment[] = Array.isArray(client.sow_comments) ? client.sow_comments : [];

    if (action === "set_status") {
      if (!["approved", "rejected", "pending"].includes(status)) throw new Error("Invalid status");
      updates.sow_status = status;
    }

    if (action === "add_comment") {
      if (!message || typeof message !== "string" || !message.trim()) throw new Error("Message required");
      existing.push({
        author: "client",
        message: message.trim().slice(0, 2000),
        created_at: new Date().toISOString(),
      });
      updates.sow_comments = existing;
    }

    if (action === "delete_comment") {
      if (typeof comment_index !== "number" || comment_index < 0 || comment_index >= existing.length) {
        throw new Error("Invalid comment index");
      }
      // Clients can only delete their own comments
      if (existing[comment_index].author !== "client") {
        throw new Error("You can only delete your own comments");
      }
      existing.splice(comment_index, 1);
      updates.sow_comments = existing;
    }

    if (action === "set_maintenance_plan") {
      // Allow any string up to 100 chars, or null/empty to clear
      if (maintenance_plan !== null && (typeof maintenance_plan !== "string" || maintenance_plan.length > 100)) {
        throw new Error("Invalid maintenance plan");
      }
      updates.maintenance_plan = maintenance_plan ? maintenance_plan.trim() : null;
    }

    if (!Object.keys(updates).length) throw new Error("No update");

    const { error } = await supabase.from("clients").update(updates).eq("id", client.id);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
