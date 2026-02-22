import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowDown } from "lucide-react";

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
    { icon: Mail, label: "Email", value: "info@reeddigitalgroup.com", href: "mailto:info@reeddigitalgroup.com" },
    { icon: Phone, label: "Phone", value: "(301) 332-4084", href: "tel:3013324084" },
    { icon: MapPin, label: "Location", value: "Remote Based Agency" },
    { icon: Clock, label: "Office Hours", value: "Mon – Sun: 9 AM – 5 PM EST" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          {/* Hero Thank You Section */}
          <section className="relative overflow-hidden mb-24">
            {/* Animated background text */}
            <motion.div
              className="bg-text top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              WELCOME
            </motion.div>

            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                {/* Animated label */}
                <motion.span
                  className="section-label font-mono inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Thank You for Visiting
                </motion.span>

                {/* Main heading with staggered words */}
                <motion.h1
                  className="text-5xl md:text-7xl font-semibold tracking-tight mt-6 mb-6"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                >
                  We're glad
                  <br />
                  <motion.span
                    className="text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    you're here.
                  </motion.span>
                </motion.h1>

                {/* Animated line */}
                <motion.div
                  className="h-px bg-primary mx-auto mb-8"
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  transition={{ delay: 0.9, duration: 0.8, ease: "easeInOut" }}
                />

                {/* Description */}
                <motion.p
                  className="text-muted-foreground font-mono text-lg max-w-xl mx-auto mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  We appreciate you taking the time to explore Reed Digital Group.
                  Let's turn your vision into reality.
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Reach Out</span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowDown className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Floating particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/20"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${15 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.15, 0.5, 0.15],
                }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </section>

          {/* Contact Info Cards */}
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                {contactItems.map((item, index) => (
                  <ScrollReveal key={item.label} delay={index * 0.1}>
                    <motion.div
                      className="group border border-border p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 relative overflow-hidden"
                      whileHover={{ y: -4 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="relative z-10">
                        <item.icon className="w-5 h-5 text-primary mx-auto mb-3" />
                        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{item.label}</h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-mono hover:text-primary transition-colors break-all"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-mono text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Divider */}
              <ScrollReveal>
                <div className="flex items-center justify-center mb-16">
                  <motion.div
                    className="h-px bg-border"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="px-4 text-xs text-muted-foreground font-mono uppercase tracking-widest">
                    Book a Call
                  </span>
                  <motion.div
                    className="h-px bg-border"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
              </ScrollReveal>

              {/* Calendly Section */}
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                      Schedule a Consultation
                    </h2>
                    <p className="text-muted-foreground font-mono">
                      Pick a time that works for you. We typically respond within one business day.
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
