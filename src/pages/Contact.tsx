import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const ContactPage = () => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Thank You Section */}
              <ScrollReveal>
                <div className="text-center mb-20">
                  <span className="section-label font-mono">Welcome</span>
                  <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-4 mb-6">
                    Thank you for visiting.
                  </h1>
                  <p className="text-muted-foreground font-mono text-lg max-w-xl mx-auto">
                    We appreciate you taking the time to learn about Reed Digital Group. 
                    We'd love to hear from you — reach out or book a call below.
                  </p>
                </div>
              </ScrollReveal>

              {/* Divider */}
              <div className="flex items-center justify-center mb-16">
                <div className="h-px w-16 bg-border" />
                <span className="px-4 text-xs text-muted-foreground font-mono uppercase tracking-widest">Get in Touch</span>
                <div className="h-px w-16 bg-border" />
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                {/* Left - Contact Info */}
                <ScrollReveal>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Email</h3>
                      <a 
                        href="mailto:info@reeddigitalgroup.com" 
                        className="text-xl hover:text-muted-foreground transition-colors font-mono"
                      >
                        info@reeddigitalgroup.com
                      </a>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Phone</h3>
                      <a 
                        href="tel:3013324084"
                        className="text-xl font-mono text-muted-foreground hover:text-foreground transition-colors"
                      >
                        (301) 332-4084
                      </a>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Location</h3>
                      <p className="text-muted-foreground font-mono">
                        Remote Based Agency
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium mb-3">Office Hours</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        Monday – Sunday: 9:00 AM – 5:00 PM EST
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within one business day.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Right - Calendly */}
                <ScrollReveal delay={0.1}>
                  <div>
                    <h3 className="text-sm font-medium mb-4">Schedule a Call</h3>
                    <div 
                      className="calendly-inline-widget border border-border" 
                      data-url="https://calendly.com/terellebony/consultation-with-terell-reed?hide_event_type_details=1&hide_gdpr_banner=1"
                      style={{ minWidth: '280px', height: '600px' }}
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;