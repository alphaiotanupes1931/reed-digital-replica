import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

const ContactPage = () => {
  useEffect(() => {
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

  const contactItems = [
    { label: "Email", value: "reeddigitalgroup@gmail.com", href: "mailto:reeddigitalgroup@gmail.com" },
    { label: "Phone", value: "(301) 332-4084", href: "tel:3013324084" },
    { label: "Location", value: "Remote" },
    { label: "Hours", value: "Mon–Sun · 9–5 EST" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          {/* Simple Hero */}
          <section className="mb-20">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center">
                <span className="section-label font-mono">Contact</span>
                <h1 className="mt-4 mb-6 text-4xl md:text-5xl font-bold tracking-tight">
                  Get in touch
                </h1>
                <p className="text-muted-foreground text-sm">
                  Pick a way to reach us, or book a free call below.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Info Cards */}
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-20 border border-border">
                {contactItems.map((item, index) => (
                  <ScrollReveal key={item.label} delay={index * 0.1}>
                    <div className="bg-background p-6 text-center h-full">
                      <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">{item.label}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-mono hover:text-brand transition-colors break-all">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-mono">{item.value}</p>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Calendly Section */}
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                      Book a free call
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Pick a time. We usually reply within a day.
                    </p>
                  </motion.div>
                  <motion.div
                    className="border border-border overflow-hidden"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="calendly-inline-widget"
                      data-url="https://calendly.com/terellebony/consultation-with-terell-reed?hide_event_type_details=1&hide_gdpr_banner=1"
                      style={{ minWidth: '280px', height: '650px' }}
                    />
                  </motion.div>
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

export default ContactPage;
