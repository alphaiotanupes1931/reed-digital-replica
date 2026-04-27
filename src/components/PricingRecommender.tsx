import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type Choice = { label: string; value: string; hint?: string };

type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
};

const questions: Question[] = [
  {
    id: "goal",
    prompt: "What's your primary goal?",
    choices: [
      { label: "Launch a new website", value: "launch", hint: "First site or full rebuild" },
      { label: "Replace an old site", value: "replace", hint: "Modernize what you have" },
      { label: "Add e-commerce / portal", value: "ecom", hint: "Sell or manage users" },
      { label: "Custom platform / app", value: "custom", hint: "Multi-user, integrations" },
    ],
  },
  {
    id: "size",
    prompt: "How many pages do you need?",
    choices: [
      { label: "1 – 5 pages", value: "xs" },
      { label: "5 – 10 pages", value: "sm" },
      { label: "10 – 20 pages", value: "md" },
      { label: "20+ / unlimited", value: "lg" },
    ],
  },
  {
    id: "model",
    prompt: "How do you want to pay?",
    choices: [
      { label: "Monthly — no upfront cost", value: "managed", hint: "We build, host, maintain" },
      { label: "One-time — own it outright", value: "outright", hint: "Buy the build, manage yourself" },
      { label: "Not sure yet", value: "either" },
    ],
  },
  {
    id: "support",
    prompt: "How much ongoing support do you want?",
    choices: [
      { label: "Light — a few updates a month", value: "light" },
      { label: "Active — regular changes & SEO", value: "active" },
      { label: "Hands-on — strategy + priority", value: "heavy" },
      { label: "Dedicated team", value: "dedicated" },
    ],
  },
];

type Recommendation = {
  plan: string;
  price: string;
  cadence: string;
  why: string;
  alt?: { plan: string; price: string; note: string };
};

function recommend(answers: Record<string, string>): Recommendation {
  const { goal, size, model, support } = answers;

  // Outright build path
  if (model === "outright") {
    if (goal === "custom" || size === "lg") {
      return {
        plan: "Enterprise Build",
        price: "$15k+",
        cadence: "one-time",
        why: "Complex integrations, APIs, and multi-user systems are scoped individually.",
        alt: { plan: "Scale (managed)", price: "$1,000/mo", note: "Skip the upfront cost — build included." },
      };
    }
    if (goal === "ecom" || size === "md") {
      return {
        plan: "Professional Build",
        price: "$8k – $15k",
        cadence: "one-time",
        why: "10–20 pages with e-commerce or portal functionality, owned outright.",
        alt: { plan: "Professional (managed)", price: "$700/mo", note: "Same scope, no build fee." },
      };
    }
    if (size === "sm") {
      return {
        plan: "Business Build",
        price: "$3.5k – $7.5k",
        cadence: "one-time",
        why: "5–10 pages with CMS, blog, and animations — yours to own.",
        alt: { plan: "Business (managed)", price: "$500/mo", note: "Same scope, no build fee." },
      };
    }
    return {
      plan: "Starter Build",
      price: "$1.5k – $3k",
      cadence: "one-time",
      why: "1–5 page responsive site with basic SEO, owned outright.",
      alt: { plan: "Starter (managed)", price: "$300/mo", note: "Same scope, no build fee." },
    };
  }

  // Managed / unsure path — recommend monthly
  if (goal === "custom" || support === "dedicated" || size === "lg") {
    return {
      plan: "Scale",
      price: "$1,000/mo",
      cadence: "monthly · no build fee",
      why: "Unlimited pages, advanced integrations, dedicated PM, and bi-weekly strategy calls.",
      alt: { plan: "Enterprise", price: "Custom", note: "If you need SLA, compliance, or multi-site." },
    };
  }
  if (goal === "ecom" || size === "md" || support === "heavy") {
    return {
      plan: "Professional",
      price: "$700/mo",
      cadence: "monthly · no build fee",
      why: "Up to 20 pages, e-commerce or client portal, unlimited minor changes, monthly strategy call.",
      alt: { plan: "Business", price: "$500/mo", note: "If you want lighter ongoing scope." },
    };
  }
  if (size === "sm" || support === "active") {
    return {
      plan: "Business",
      price: "$500/mo",
      cadence: "monthly · no build fee",
      why: "Up to 10 pages, CMS, blog, on-page SEO, and 5 updates per month. Most popular pick.",
      alt: { plan: "Starter", price: "$300/mo", note: "If you only need a small site to start." },
    };
  }
  return {
    plan: "Starter",
    price: "$300/mo",
    cadence: "monthly · no build fee",
    why: "Up to 5 responsive pages, hosting, SSL, basic SEO, and 2 monthly updates. Lowest entry point.",
    alt: { plan: "Business", price: "$500/mo", note: "Step up when you need a CMS or blog." },
  };
}

const PricingRecommender = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= questions.length;
  const rec = done ? recommend(answers) : null;

  const select = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  const progress = Math.min(step, questions.length) / questions.length;

  return (
    <div className="border-2 border-border p-6 md:p-10 bg-card">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
          Plan Finder
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground">
          {done ? "Recommendation" : `Question ${step + 1} of ${questions.length}`}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Answer 4 quick questions and we'll point you to the right plan — no email required.
      </p>

      {/* Progress bar */}
      <div className="h-px bg-border mb-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!done && (
          <motion.div
            key={questions[step].id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-xl md:text-2xl font-medium mb-6">{questions[step].prompt}</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {questions[step].choices.map((c) => (
                <button
                  key={c.value}
                  onClick={() => select(questions[step].id, c.value)}
                  className="text-left p-4 border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    {c.label}
                  </div>
                  {c.hint && (
                    <div className="text-[11px] text-muted-foreground mt-1 font-mono">{c.hint}</div>
                  )}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 text-[11px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider"
              >
                ← Back
              </button>
            )}
          </motion.div>
        )}

        {done && rec && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Best fit
            </div>
            <div className="flex items-baseline flex-wrap gap-x-4 gap-y-1 mb-4">
              <h4 className="text-3xl md:text-4xl font-medium">{rec.plan}</h4>
              <span className="font-mono text-2xl text-primary">{rec.price}</span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                {rec.cadence}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{rec.why}</p>

            {rec.alt && (
              <div className="border-l-2 border-border pl-4 mb-8">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  Also consider
                </div>
                <div className="text-sm">
                  <span className="font-medium">{rec.alt.plan}</span>
                  <span className="font-mono text-muted-foreground ml-2">{rec.alt.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{rec.alt.note}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-block bg-brand text-brand-foreground px-6 py-3 text-sm font-medium hover:bg-brand/90 transition-colors"
              >
                Book Free Consultation →
              </Link>
              <button
                onClick={reset}
                className="inline-block border border-border px-6 py-3 text-sm font-medium hover:border-foreground transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingRecommender;