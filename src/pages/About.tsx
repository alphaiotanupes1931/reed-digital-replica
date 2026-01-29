import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import founderImage from "@/assets/founder.png";

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            {/* Hero */}
            <ScrollReveal>
              <div className="max-w-2xl mx-auto text-center mb-20">
                <span className="section-label font-mono">About</span>
                <TypedHeader text="Building digital experiences" className="mt-4 mb-6" />
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.1}>
              <div className="flex justify-center gap-16 mb-20 text-center">
                <div>
                  <div className="text-2xl font-mono">2020</div>
                  <div className="text-xs text-muted-foreground mt-1">Founded</div>
                </div>
                <div>
                  <div className="text-2xl font-mono">50+</div>
                  <div className="text-xs text-muted-foreground mt-1">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-mono">4+</div>
                  <div className="text-xs text-muted-foreground mt-1">Awards</div>
                </div>
              </div>
            </ScrollReveal>

            {/* Founder */}
            <ScrollReveal delay={0.15}>
              <div className="max-w-2xl mx-auto mb-20">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 overflow-hidden rounded-full mb-6">
                    <img 
                      src={founderImage} 
                      alt="Terell Reed" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium mb-1">Terell Reed</h3>
                  <p className="text-sm text-muted-foreground mb-4">Founder & CEO</p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    Computer Science graduate from Morgan State University. 
                    Former System Administrator for Prince George's County Council 
                    and Security Engineering intern at MITRE.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Bottom */}
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-mono">
                Small Business · SAM Registered · Federal Contractor Ready
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AboutPage;