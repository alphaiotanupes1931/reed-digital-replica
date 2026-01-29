import { ArrowRight, Mail, Calendar } from "lucide-react";

const ContactCTA = () => {
  return (
    <section id="contact" className="py-32 relative glow-top">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label">Get Started</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to build something <span className="text-gradient">amazing</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Book a free 30-minute consultation. We'll discuss your project, 
            timeline, and provide a transparent quote with no obligations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="mailto:hello@reeddigitalgroup.com" className="btn-primary flex items-center gap-2 text-base w-full sm:w-auto justify-center">
              <Mail size={18} /> Get in Touch
            </a>
            <a href="#" className="btn-ghost flex items-center gap-2 text-base w-full sm:w-auto justify-center">
              <Calendar size={18} /> Schedule a Call
            </a>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 card-dark p-8 md:p-12">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-gradient mb-2">Free Consultation</p>
              <p className="text-sm text-muted-foreground">30-60 minutes, no commitment</p>
            </div>
            <div className="text-center border-y md:border-y-0 md:border-x border-border py-8 md:py-0">
              <p className="font-display text-2xl font-bold text-gradient mb-2">Clear Pricing</p>
              <p className="text-sm text-muted-foreground">Detailed quote within 48 hours</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-gradient mb-2">Fast Start</p>
              <p className="text-sm text-muted-foreground">Begin within 1-2 weeks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
