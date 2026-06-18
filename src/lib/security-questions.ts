export const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was the name of your elementary school?",
  "What was your childhood best friend's first name?",
  "What was the make and model of your first car?",
  "What was your favorite teacher's last name?",
  "What street did you grow up on?",
  "What was your favorite childhood book?",
  "What was the title of your first job?",
];

export async function hashAnswer(answer: string): Promise<string> {
  const normalized = answer.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}