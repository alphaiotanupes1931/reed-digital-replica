import TypedHeader from "@/components/TypedHeader";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <span className="section-label font-mono">Contact</span>
          <TypedHeader text="Let's talk." className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-12 font-mono">
            Ready when you are.
          </p>

          {/* Contact Info - Just text */}
          <div className="space-y-4">
            <a 
              href="mailto:hello@reeddigitalgroup.com" 
              className="block text-lg hover:text-muted-foreground transition-colors font-mono"
            >
              hello@reeddigitalgroup.com
            </a>
            <p className="text-muted-foreground font-mono">
              (443) 555-0123
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              Baltimore, Maryland
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
