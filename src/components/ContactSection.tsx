import { ArrowRight, Mail, Calendar } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-foreground text-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-background/60 uppercase tracking-wider mb-4">
            Get Started
          </p>
          <h2 className="text-display-sm md:text-display font-bold mb-6">
            Ready to build something great?
          </h2>
          <p className="text-lg text-background/70 mb-10 max-w-xl mx-auto">
            Book a free consultation. We'll discuss your project, timeline, and provide a transparent quote.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="mailto:hello@reeddigitalgroup.com"
              className="inline-flex items-center gap-2 bg-background text-foreground font-medium px-6 py-3 rounded-full transition-all duration-200 hover:opacity-90 w-full sm:w-auto justify-center"
            >
              <Mail size={18} /> Get in touch
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border border-background/30 text-background font-medium px-6 py-3 rounded-full transition-all duration-200 hover:bg-background/10 w-full sm:w-auto justify-center"
            >
              <Calendar size={18} /> Schedule a call
            </a>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold mb-1">Free</p>
              <p className="text-sm text-background/60">30-min consultation</p>
            </div>
            <div className="md:border-x border-background/20 md:px-8">
              <p className="text-2xl font-bold mb-1">48h</p>
              <p className="text-sm text-background/60">Quote turnaround</p>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">1-2 weeks</p>
              <p className="text-sm text-background/60">Project kickoff</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
