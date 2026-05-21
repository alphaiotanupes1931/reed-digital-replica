import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import logo from "@/assets/rdg-header-logo.png";

const terms = {
  title: "Terms of Service",
  updated: "May 21, 2026",
  sections: [
    {
      h: "1. Agreement",
      p: "By creating an RDG Apps account you agree to these Terms and our Privacy Policy. RDG Apps is operated by Reed Digital Group LLC (\"RDG\", \"we\", \"us\"). If you do not agree, do not use the service.",
    },
    {
      h: "2. Your account",
      p: "You are responsible for the activity on your account, for keeping your password secure, and for any subcontractors or staff you invite. You must be at least 18 and authorized to act for your business. Notify us immediately of any unauthorized use.",
    },
    {
      h: "3. Subscriptions, trial & billing",
      p: "New accounts receive a 14-day free trial. After the trial, your selected plan ($5, $10, or $15 / month) renews automatically each month until cancelled. You can cancel anytime from your account settings; cancellation takes effect at the end of the current billing period. Fees are non-refundable except where required by law.",
    },
    {
      h: "4. Your data",
      p: "You own everything you upload — receipts, invoices, transactions, notes. We process it only to deliver the service, generate reports, and provide support. We do not sell your data. You can export your data at any time and request deletion under our Privacy Policy.",
    },
    {
      h: "5. Acceptable use",
      p: "Don't upload illegal content, attempt to break or probe the service, reverse engineer the apps, resell the service without a written agreement, or use the platform to defraud third parties. We may suspend accounts that violate these rules.",
    },
    {
      h: "6. Tax disclaimer",
      p: "RDG Apps helps you organize financial records. It is not a CPA, attorney, or tax preparer. Reports are informational and should be reviewed by a qualified professional before filing. RDG is not liable for tax filings, penalties, or financial decisions made using the service.",
    },
    {
      h: "7. Service availability",
      p: "We aim for high uptime but do not guarantee uninterrupted service. Scheduled maintenance, third-party outages (Stripe, Plaid, hosting), and force majeure events may interrupt access. We are not liable for incidental losses from downtime.",
    },
    {
      h: "8. Limitation of liability",
      p: "To the maximum extent permitted by law, RDG's total liability for any claim arising from the service is limited to the fees you paid in the 12 months before the claim. We are not liable for indirect, consequential, or punitive damages.",
    },
    {
      h: "9. Changes",
      p: "We may update these Terms. Material changes will be announced by email or in-app at least 14 days before they take effect. Continued use after changes means you accept them.",
    },
    {
      h: "10. Contact",
      p: "Questions? Email legal@reeddigitalgroup.com.",
    },
  ],
};

const privacy = {
  title: "Privacy Policy",
  updated: "May 21, 2026",
  sections: [
    {
      h: "1. What we collect",
      p: "Account info (name, email, password hash), billing info (handled by Stripe — we never see card numbers), and the financial data you upload (receipts, transactions, invoices, mileage). We also collect basic usage logs (IP, browser, pages viewed) to operate and secure the service.",
    },
    {
      h: "2. How we use it",
      p: "To run the apps, generate your reports, process payments, send service email (receipts, security alerts, product updates you can opt out of), and prevent fraud or abuse.",
    },
    {
      h: "3. Who we share with",
      p: "Service providers that help us operate: Stripe (payments), Plaid (bank connections, only if you connect them), our hosting and email providers, and our analytics. Each is bound by contract to handle your data securely. We do not sell or rent personal data.",
    },
    {
      h: "4. Security",
      p: "Data is encrypted in transit (TLS) and at rest. Access is restricted by role and audited. We use industry-standard authentication and recommend you enable strong passwords. No system is perfectly secure — report suspected issues to security@reeddigitalgroup.com.",
    },
    {
      h: "5. Retention",
      p: "We keep your data while your account is active and for up to 7 years after closure to support tax recordkeeping and legal obligations. You can request earlier deletion at any time, subject to those obligations.",
    },
    {
      h: "6. Your rights",
      p: "You may access, correct, export, or delete your personal data. California, EU/UK, and similar residents have additional rights (CCPA, GDPR). Email privacy@reeddigitalgroup.com to exercise them; we respond within 30 days.",
    },
    {
      h: "7. Cookies",
      p: "We use a small number of essential cookies (login session, CSRF) and optional analytics cookies. You can disable non-essential cookies in your browser without losing core functionality.",
    },
    {
      h: "8. Children",
      p: "RDG Apps is not directed to children under 16. We do not knowingly collect data from them.",
    },
    {
      h: "9. Changes",
      p: "Material changes to this policy will be notified by email or in-app at least 14 days in advance.",
    },
    {
      h: "10. Contact",
      p: "Reed Digital Group LLC · privacy@reeddigitalgroup.com",
    },
  ],
};

const AppsLegal = ({ kind }: { kind?: "terms" | "privacy" }) => {
  const params = useParams();
  const which = kind || (params.kind === "privacy" ? "privacy" : "terms");
  const doc = which === "privacy" ? privacy : terms;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [which]);

  return (
    <div className="min-h-screen bg-background font-apps text-foreground flex flex-col">
      <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-foreground/10">
        <Link to="/apps" className="flex items-center gap-2">
          <img src={logo} alt="RDG" className="h-7 w-auto" />
        </Link>
        <div className="flex gap-6 text-xs">
          <Link to="/apps/legal/terms" className={which === "terms" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}>
            Terms
          </Link>
          <Link to="/apps/legal/privacy" className={which === "privacy" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}>
            Privacy
          </Link>
        </div>
      </div>

      <main className="flex-1 px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-widest text-brand mb-3">Legal · Updated {doc.updated}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">{doc.title}</h1>

          <div className="space-y-10">
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-sm font-semibold tracking-tight mb-2">{s.h}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.p}</p>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-foreground/10 text-xs text-muted-foreground">
            © 2026 Reed Digital Group LLC · All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppsLegal;