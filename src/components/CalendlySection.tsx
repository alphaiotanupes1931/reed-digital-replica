import { useEffect } from "react";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";

const CalendlySection = () => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section id="schedule" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="section-label font-mono">Schedule</span>
            <TypedHeader text="Book a Consultation" className="mt-4 mb-6" />
            <p className="text-muted-foreground">
              Ready to discuss your project? Schedule a free consultation call.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/terellebony/consultation-with-terell-reed?hide_event_type_details=1&hide_gdpr_banner=1"
              style={{ minWidth: '320px', height: '700px' }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CalendlySection;