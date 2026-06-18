import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function sha256(input: string) {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "get_questions") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) return json({ error: "Email required" }, 400);

      // Look up auth user by email
      const { data: users, error: lerr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (lerr) throw lerr;
      const user = users.users.find((u) => u.email?.toLowerCase() === email);
      // Always return generic to avoid enumeration — but we still need questions to show.
      if (!user) return json({ error: "Account not found or recovery not set up." }, 404);

      const { data: profile } = await supabase
        .from("profiles")
        .select("security_question_1, security_question_2, recovery_setup_complete")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.recovery_setup_complete || !profile.security_question_1 || !profile.security_question_2) {
        return json({ error: "Recovery not set up for this account." }, 404);
      }

      return json({
        question_1: profile.security_question_1,
        question_2: profile.security_question_2,
      });
    }

    if (action === "reset_password") {
      const email = String(body.email || "").trim().toLowerCase();
      const birthdate = String(body.birthdate || "").trim();
      const answer1 = String(body.answer_1 || "");
      const answer2 = String(body.answer_2 || "");
      const newPassword = String(body.new_password || "");

      if (!email || !birthdate || !answer1 || !answer2 || !newPassword) {
        return json({ error: "Missing fields" }, 400);
      }
      if (newPassword.length < 8) return json({ error: "Password too short" }, 400);

      const { data: users, error: lerr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (lerr) throw lerr;
      const user = users.users.find((u) => u.email?.toLowerCase() === email);
      if (!user) return json({ error: "Verification failed." }, 401);

      const { data: profile } = await supabase
        .from("profiles")
        .select("birthdate, security_answer_1_hash, security_answer_2_hash, recovery_setup_complete")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.recovery_setup_complete) return json({ error: "Recovery not set up." }, 401);

      const a1 = await sha256(answer1);
      const a2 = await sha256(answer2);

      const okBirthdate = profile.birthdate === birthdate;
      const okA1 = profile.security_answer_1_hash === a1;
      const okA2 = profile.security_answer_2_hash === a2;

      if (!okBirthdate || !okA1 || !okA2) {
        const wrong: string[] = [];
        if (!okBirthdate) wrong.push("birthdate");
        if (!okA1) wrong.push("question_1");
        if (!okA2) wrong.push("question_2");
        const labels = wrong.map((w) =>
          w === "birthdate" ? "birthdate" : w === "question_1" ? "first security question" : "second security question"
        );
        const human =
          labels.length === 1
            ? `The ${labels[0]} you entered doesn't match our records.`
            : `The ${labels.slice(0, -1).join(", ")} and ${labels.slice(-1)} you entered don't match our records.`;
        return json({ error: human, wrong_fields: wrong }, 401);
      }

      const { error: uerr } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword });
      if (uerr) throw uerr;

      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("ho-recovery error", err);
    return json({ error: (err as Error).message || "Server error" }, 500);
  }
});