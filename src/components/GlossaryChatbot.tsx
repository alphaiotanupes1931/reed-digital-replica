import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Term {
  term: string;
  definition: string;
}

const GLOSSARY: Term[] = [
  { term: "SOW", definition: "Scope of Work — a document outlining what we'll build, the deliverables, features, timeline, and project boundaries." },
  { term: "Scope of Work", definition: "A document outlining what we'll build, the deliverables, features, timeline, and project boundaries." },
  { term: "Invoice", definition: "An itemized bill for services rendered. It lists the work, the price, any deposit, fees, and the due date." },
  { term: "Deposit", definition: "An upfront partial payment that secures your spot on the schedule and starts the project. The remainder is due on completion." },
  { term: "Balance", definition: "The remaining amount due on an invoice after the deposit has been paid." },
  { term: "Deliverables", definition: "The finished items you receive at the end of the project — files, source code, design assets, links, or documentation." },
  { term: "CMS", definition: "Content Management System — a back-end interface that lets you edit your website content (text, photos, menu items) without needing a developer." },
  { term: "CRM", definition: "Customer Relationship Management — software for tracking your leads, customers, and communications." },
  { term: "Domain", definition: "Your website's address on the internet, like yourbusiness.com." },
  { term: "Hosting", definition: "The service that keeps your website online and accessible 24/7." },
  { term: "DNS", definition: "Domain Name System — the system that connects your domain name to your website's server." },
  { term: "SSL", definition: "Secure Sockets Layer — the technology that encrypts data between your site and visitors. Shown as the padlock in browsers." },
  { term: "HTTPS", definition: "Hypertext Transfer Protocol Secure — the secure version of HTTP, indicated by the padlock and used by all modern websites." },
  { term: "SEO", definition: "Search Engine Optimization — work done to help your site rank higher on Google and other search engines." },
  { term: "Backend", definition: "The server-side part of an app — the database, business logic, and authentication. Users don't see it directly." },
  { term: "Frontend", definition: "The visual part of a website or app that users see and interact with in their browser." },
  { term: "UI", definition: "User Interface — the visual design and layout of buttons, forms, and screens users interact with." },
  { term: "UX", definition: "User Experience — how a product feels to use; flow, ease, clarity, and satisfaction." },
  { term: "Responsive", definition: "A design that automatically adapts to look good on phones, tablets, and desktops." },
  { term: "Mobile-first", definition: "A design approach that prioritizes the mobile experience before scaling up to larger screens." },
  { term: "Wireframe", definition: "A simple black-and-white layout sketch that shows where elements go before any visual design happens." },
  { term: "Mockup", definition: "A high-fidelity static visual of what the final design will look like." },
  { term: "Prototype", definition: "A clickable, interactive version of a design used to test flows before development." },
  { term: "Landing Page", definition: "A focused single-page website built around one goal, like collecting leads or selling one product." },
  { term: "MVP", definition: "Minimum Viable Product — the smallest version of an app that delivers core value, used to launch quickly and learn." },
  { term: "API", definition: "Application Programming Interface — a way for two pieces of software to talk to each other and exchange data." },
  { term: "Database", definition: "An organized collection of your app's data — users, orders, posts, etc. — that can be queried and updated." },
  { term: "Authentication", definition: "The system that verifies who a user is, usually with email/password or social login." },
  { term: "Authorization", definition: "The system that controls what an authenticated user is allowed to do or see." },
  { term: "Repository", definition: "A storage location for your project's source code, usually on GitHub. Tracks every change over time." },
  { term: "Git", definition: "Version control software that tracks code changes so we can collaborate safely and roll back if needed." },
  { term: "Deployment", definition: "The process of publishing your website or app live to the internet." },
  { term: "Staging", definition: "A test environment that mirrors production, used to preview changes before they go live." },
  { term: "Production", definition: "The live version of your site that real customers use." },
  { term: "Bug", definition: "An unintended error or unexpected behavior in software." },
  { term: "Feature", definition: "A specific capability or piece of functionality in your app." },
  { term: "Integration", definition: "Connecting your app to a third-party service like Stripe, Google, Mailchimp, etc." },
  { term: "Webhook", definition: "An automated message sent from one app to another when an event happens — for example, Stripe pinging us when a payment succeeds." },
  { term: "Stripe", definition: "A payment processor we use to accept credit card payments securely." },
  { term: "Processing Fee", definition: "A small fee (2.9% + $0.30) added by the card processor to cover the cost of accepting card payments." },
  { term: "Phase", definition: "A milestone in your project — for example: Discovery, Design, Development, Launch." },
  { term: "Discovery", definition: "The first project phase where we learn about your business, goals, audience, and requirements." },
  { term: "Revisions", definition: "Rounds of edits and adjustments to a deliverable based on your feedback." },
  { term: "Brand", definition: "The overall identity of your business — logo, colors, fonts, tone of voice, and visual style." },
  { term: "Logo", definition: "The visual mark that represents your business." },
  { term: "Favicon", definition: "The small icon that appears in browser tabs next to your site name." },
  { term: "Analytics", definition: "Tools like Google Analytics that show you how many visitors come to your site, where from, and what they do." },
  { term: "Conversion", definition: "When a visitor takes a desired action — like buying, booking, or signing up." },
  { term: "Lead", definition: "A potential customer who has shown interest, usually by submitting a form or contact request." },
  { term: "Newsletter", definition: "Recurring email sent to subscribers — useful for staying top-of-mind with customers." },
  { term: "Calendly", definition: "A scheduling tool that lets clients book meetings on your calendar without back-and-forth emails." },
  { term: "Embed", definition: "Placing a third-party widget (map, video, form, calendar) directly inside your website." },
  { term: "Backlog", definition: "A running list of features, ideas, and bugs that are planned but not yet started. We pull from the backlog as the project moves forward." },
  { term: "Sprint", definition: "A short focused work cycle (usually 1–2 weeks) where we tackle a defined set of tasks from the backlog." },
  { term: "Milestone", definition: "A significant checkpoint in the project — like finishing design, launching the beta, or going live." },
  { term: "Scope Creep", definition: "When new requests get added beyond the original Scope of Work, expanding the project's size, time, and cost." },
  { term: "Change Order", definition: "A formal addition to the Scope of Work covering new requests, with updated pricing and timeline." },
  { term: "Kickoff", definition: "The first official meeting that starts the project — we align on goals, timeline, and next steps." },
  { term: "Handoff", definition: "Transferring final files, accounts, and access to you at the end of the project." },
  { term: "Refactor", definition: "Cleaning up or restructuring existing code without changing what it does — improves speed and maintainability." },
  { term: "QA", definition: "Quality Assurance — testing the site or app to catch bugs and issues before launch." },
  { term: "Cache", definition: "Stored copies of files that make your site load faster. Sometimes needs to be cleared to see updates." },
  { term: "404", definition: "The error shown when a page doesn't exist at the URL someone visited." },
  { term: "Plugin", definition: "An add-on that extends what your website can do — like a contact form, gallery, or booking widget." },
  { term: "Webhook", definition: "An automated message one app sends another when something happens — e.g., Stripe notifying us of a payment." },
  { term: "Token", definition: "A secure code that proves identity or permission — used for logins, API access, and password resets." },
];

const findAnswer = (query: string): Term | null => {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  // Exact match
  let match = GLOSSARY.find((t) => t.term.toLowerCase() === q);
  if (match) return match;
  // Word boundary match
  match = GLOSSARY.find((t) => {
    const term = t.term.toLowerCase();
    return q.split(/\s+/).includes(term) || q.includes(` ${term} `) || q.startsWith(`${term} `) || q.endsWith(` ${term}`);
  });
  if (match) return match;
  // Loose contains
  return GLOSSARY.find((t) => q.includes(t.term.toLowerCase())) || null;
};

interface Msg {
  role: "user" | "bot";
  content: string;
  suggestions?: string[];
}

export const GlossaryChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      content:
        "Hi — I'm your project glossary. Ask me what any term means (SOW, invoice, deposit, CMS…) and I'll explain it in plain English.",
      suggestions: ["What is a SOW?", "What is an invoice?", "What is a CMS?", "What is a deposit?"],
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const userMsg: Msg = { role: "user", content: q };
    const found = findAnswer(q);
    const botMsg: Msg = found
      ? { role: "bot", content: `${found.term} — ${found.definition}` }
      : {
          role: "bot",
          content:
            "I don't have that one yet. Try terms like SOW, invoice, deposit, deliverables, CMS, hosting, or domain. For anything else, email reeddigitalgroup@gmail.com and we'll explain.",
        };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center font-mono text-xs uppercase tracking-[0.15em]"
        aria-label="Open glossary chatbot"
      >
        {open ? "Close" : "Help"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[28rem] border-2 border-foreground bg-background flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="border-b-2 border-foreground p-4">
              <p className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Glossary</p>
              <p className="text-sm font-mono font-bold text-foreground mt-1">Ask about any term</p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[85%] p-3 text-xs font-mono leading-relaxed ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "border border-border text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {messages.length === 1 && messages[0].suggestions && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {messages[0].suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-[10px] font-mono uppercase tracking-[0.15em] border border-border hover:border-foreground px-3 py-1.5 text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t-2 border-foreground p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask: what is a deposit?"
                className="flex-1 bg-transparent border border-border focus:border-foreground px-3 h-10 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-4 border-2 border-foreground bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-background hover:text-foreground transition-colors"
              >
                Ask
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
