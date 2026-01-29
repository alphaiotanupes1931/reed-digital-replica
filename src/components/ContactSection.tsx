import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-foreground text-background">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <span className="text-xs uppercase tracking-[0.2em] text-background/60">
            Contact
          </span>
          <h2 className="text-display-sm md:text-display font-serif mt-4 mb-6">
            Let's Work Together
          </h2>
          <div className="flex justify-center mb-8">
            <div className="w-12 h-px bg-background/30" />
          </div>
          <p className="text-lg text-background/70 mb-12 max-w-xl mx-auto leading-relaxed">
            Ready to start your next project? We'd love to hear from you. 
            Schedule a consultation to discuss your vision.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="mailto:hello@reeddigitalgroup.com"
              className="inline-flex items-center justify-center gap-2 bg-background text-foreground font-medium px-8 py-3 text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90 w-full sm:w-auto"
            >
              Get in Touch
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 border border-background/30 text-background font-medium px-8 py-3 text-sm uppercase tracking-widest transition-all duration-200 hover:bg-background/10 w-full sm:w-auto"
            >
              Schedule a Call
            </a>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-background/20">
            <div className="flex flex-col items-center gap-3">
              <Mail className="w-5 h-5 text-background/60" strokeWidth={1.5} />
              <span className="text-sm text-background/80">
                hello@reeddigitalgroup.com
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Phone className="w-5 h-5 text-background/60" strokeWidth={1.5} />
              <span className="text-sm text-background/80">
                (443) 555-0123
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="w-5 h-5 text-background/60" strokeWidth={1.5} />
              <span className="text-sm text-background/80">
                Baltimore, Maryland
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
