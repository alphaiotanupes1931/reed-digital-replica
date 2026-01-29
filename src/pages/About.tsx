import { Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import founderImage from "@/assets/founder.png";
import comptiaLogo from "@/assets/comptia-logo.png";
import ciscoLogo from "@/assets/cisco-logo.png";

const certifications = [
  { name: "CompTIA A+", logo: comptiaLogo },
  { name: "CompTIA Network+", logo: comptiaLogo },
  { name: "Cisco CCNA", logo: ciscoLogo },
  { name: "Cisco CyberOps", logo: ciscoLogo },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Hero */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-24">
              <span className="section-label font-mono">About</span>
              <TypedHeader text="Building the future, one pixel at a time" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                Digital solutions for government agencies, corporations, and organizations.
              </p>
            </div>
          </ScrollReveal>

          {/* Minimal Stats */}
          <ScrollReveal delay={0.1}>
            <div className="flex justify-center gap-16 mb-24">
              <div className="text-center">
                <div className="text-3xl font-medium">2020</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">Established</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-medium">4+</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">Award Nominations</div>
              </div>
            </div>
          </ScrollReveal>

          {/* Story - Condensed */}
          <ScrollReveal delay={0.15}>
            <div className="max-w-2xl mx-auto mb-24 text-center">
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2020, we've grown into a professional agency serving government and enterprise clients. 
                Our approach: understand deeply, build thoughtfully, iterate constantly.
              </p>
            </div>
          </ScrollReveal>

          {/* Founder Section */}
          <ScrollReveal delay={0.2}>
            <div className="mb-24 py-16 bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-[240px_1fr] gap-12 items-start">
                  {/* Image */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-48 h-48 md:w-full md:h-auto aspect-square overflow-hidden mb-4">
                      <img 
                        src={founderImage} 
                        alt="Terell Reed" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-medium">Terell Reed</h3>
                    <p className="text-sm text-muted-foreground">Founder & CEO</p>
                    <p className="text-xs text-muted-foreground font-mono mt-2">
                      B.S. Computer Science, Morgan State
                    </p>
                  </div>

                  {/* Bio - Condensed */}
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Entrepreneur and technologist serving government agencies and corporations. 
                      Former System Administrator for Prince George's County Council and Security 
                      Engineering intern at MITRE.
                    </p>
                    <p>
                      Expertise in full-stack development, mobile apps, cybersecurity, and network 
                      infrastructure. Member of Kappa Alpha Psi Fraternity, Inc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Certifications - Minimal */}
          <ScrollReveal delay={0.25}>
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-mono text-muted-foreground text-center mb-8 uppercase tracking-wider">
                Certifications
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                {certifications.map((cert) => (
                  <div 
                    key={cert.name} 
                    className="flex items-center gap-3 px-4 py-2"
                  >
                    <img 
                      src={cert.logo} 
                      alt={cert.name}
                      className="h-5 w-auto"
                    />
                    <span className="text-sm text-muted-foreground">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Client Quote */}
          <ScrollReveal delay={0.3}>
            <div className="max-w-3xl mx-auto mb-20">
              <div className="text-center">
                <Quote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-6" />
                <blockquote className="text-lg leading-relaxed text-muted-foreground mb-6">
                  "Reed Digital Group is a highly professional web design company that delivers outstanding customer service and clear, consistent communication. Their onboarding process was smooth, their pricing was transparent with no hidden fees, and they delivered ahead of schedule. What truly set them apart was their continued follow-up weeks and even months after the website launch."
                </blockquote>
                <cite className="text-sm font-medium not-italic">
                  — OQP Solutions
                </cite>
              </div>
            </div>
          </ScrollReveal>

          {/* Bottom */}
          <div className="text-center">
            <span className="text-xs text-muted-foreground tracking-widest font-mono">
              Small Business · SAM Registered · Federal Contractor Ready
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
