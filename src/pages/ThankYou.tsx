import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const ThankYou = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <span className="section-label font-mono">Confirmation</span>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-4">
                Thank you.
              </h1>
              <p className="text-muted-foreground font-mono text-lg">
                We've received your message and will get back to you within 24 hours.
              </p>
              <div className="pt-6">
                <Button asChild size="lg">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ThankYou;
