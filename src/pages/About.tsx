import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">About</span>
              <TypedHeader text="Who We Are" className="mt-4 mb-6" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <p className="text-xl leading-relaxed">
                Reed Digital Group is a boutique development studio dedicated to crafting 
                exceptional digital experiences for businesses that demand quality.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Founded with a commitment to quality over quantity, we partner with select 
                clients who value thoughtful design and meticulous execution. Our team brings 
                together expertise in development, design, and strategy to deliver solutions 
                that stand apart.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                We believe in building lasting relationships with our clients. Every project 
                begins with understanding your unique challenges and goals. From there, we 
                craft tailored solutions that not only meet your immediate needs but scale 
                with your business.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Based in Baltimore, Maryland, we serve small businesses, mid-size companies, 
                and government agencies nationwide. We're proud to be a certified small 
                business and registered in SAM for federal contracting opportunities.
              </p>
            </div>

            {/* Values */}
            <div className="mt-16 pt-16 border-t border-border">
              <h3 className="text-lg font-medium mb-8 text-center">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    We never cut corners. Every line of code is written with care.
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium mb-2">Transparency</h4>
                  <p className="text-sm text-muted-foreground">
                    Clear communication throughout every project phase.
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium mb-2">Partnership</h4>
                  <p className="text-sm text-muted-foreground">
                    Your success is our success. We're invested in your growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-16 pt-8 border-t border-border text-center">
              <span className="text-xs text-muted-foreground tracking-widest font-mono">
                Small Business · SAM Registered · Federal Contractor Ready
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
