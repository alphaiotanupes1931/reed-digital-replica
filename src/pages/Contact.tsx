import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            {/* Header */}
            <span className="section-label font-mono">Contact</span>
            <TypedHeader text="Let's talk." className="mt-4 mb-6" />
            <p className="text-muted-foreground mb-16 font-mono">
              Ready when you are.
            </p>

            {/* Contact Info */}
            <div className="space-y-8 mb-16">
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
            </div>

            {/* Hours */}
            <div className="border-t border-border pt-8">
              <h3 className="text-sm font-medium mb-4">Office Hours</h3>
              <div className="space-y-1 text-sm text-muted-foreground font-mono">
                <p>Monday – Sunday: 9:00 AM – 5:00 PM EST</p>
              </div>
            </div>

            {/* Response time */}
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                We typically respond within one business day.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
