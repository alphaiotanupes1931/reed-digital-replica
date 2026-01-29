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
            <a 
              href="tel:3013324084"
              className="block text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              (301) 332-4084
            </a>
            <p className="text-sm text-muted-foreground font-mono">
              Remote Based Agency
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
