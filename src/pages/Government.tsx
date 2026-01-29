import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const GovernmentPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="section-label font-mono">Government</span>
                  <TypedHeader text="Federal Contracting" className="mt-4 mb-6" />
                  <p className="text-muted-foreground">
                    Certified small business ready to support government agencies.
                  </p>
                </div>
              </ScrollReveal>

              {/* Company Data */}
              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">State ID</p>
                    <p className="font-mono text-sm">W26278200</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">FEIN</p>
                    <p className="font-mono text-sm">39-3305308</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm">Small Business</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-sm">Brandywine, MD</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* NAICS Codes */}
              <ScrollReveal delay={0.15}>
                <div className="mb-12">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    NAICS Codes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {[
                      { code: "541511", desc: "Custom Computer Programming (Primary)" },
                      { code: "541512", desc: "Computer Systems Design" },
                      { code: "541519", desc: "Other Computer Related Services" },
                      { code: "541611", desc: "Admin. Management Consulting" },
                    ].map((item) => (
                      <div key={item.code} className="flex justify-between py-2 border-b border-border">
                        <span className="font-mono">{item.code}</span>
                        <span className="text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Core Competencies */}
              <ScrollReveal delay={0.2}>
                <div className="mb-16">
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
                    Core Competencies
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      "Web Development",
                      "Mobile Apps",
                      "Cloud Solutions",
                      "UI/UX Design",
                      "508 Compliance",
                      "IT Consulting",
                    ].map((item) => (
                      <span key={item} className="px-4 py-2 border border-border text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.25}>
                <div className="text-center">
                  <Link 
                    to="/capability-statement" 
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    View Capability Statement
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default GovernmentPage;