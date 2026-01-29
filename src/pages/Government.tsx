import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Building2, FileText, Shield, Users } from "lucide-react";

const GovernmentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="section-label font-mono">Government</span>
                <TypedHeader text="Federal Contracting" className="mt-4 mb-6" />
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Reed Digital Group LLC is a certified small business ready to support 
                  federal, state, and local government agencies with IT consulting, 
                  web development, and digital transformation services.
                </p>
              </div>
            </ScrollReveal>

            {/* Company Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <ScrollReveal delay={0.1}>
                <div className="border border-border p-6 hover:border-foreground/20 transition-colors">
                  <Building2 className="w-6 h-6 mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Company Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Legal Name:</span> <span className="font-mono">Reed Digital Group LLC</span></p>
                    <p><span className="text-muted-foreground">State ID:</span> <span className="font-mono">W26278200</span></p>
                    <p><span className="text-muted-foreground">FEIN:</span> <span className="font-mono">39-3305308</span></p>
                    <p><span className="text-muted-foreground">Status:</span> Small Business</p>
                    <p><span className="text-muted-foreground">Entity Type:</span> Limited Liability Company</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="border border-border p-6 hover:border-foreground/20 transition-colors">
                  <Users className="w-6 h-6 mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Principal</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Owner:</span> Terell Reed</p>
                    <p><span className="text-muted-foreground">Title:</span> Managing Member</p>
                    <p><span className="text-muted-foreground">Location:</span> Brandywine, MD 20613</p>
                    <p><span className="text-muted-foreground">County:</span> Prince George's</p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="font-mono">info@reeddigitalgroup.com</span></p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              <ScrollReveal>
                <div className="border-b border-border pb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">NAICS Codes</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 bg-muted/30">
                      <span className="font-mono font-medium">541511</span>
                      <span className="text-muted-foreground">Custom Computer Programming Services (Primary)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 hover:bg-muted/20 transition-colors">
                      <span className="font-mono">541512</span>
                      <span className="text-muted-foreground">Computer Systems Design Services</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 hover:bg-muted/20 transition-colors">
                      <span className="font-mono">541519</span>
                      <span className="text-muted-foreground">Other Computer Related Services</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 hover:bg-muted/20 transition-colors">
                      <span className="font-mono">541430</span>
                      <span className="text-muted-foreground">Graphic Design Services</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 hover:bg-muted/20 transition-colors">
                      <span className="font-mono">541611</span>
                      <span className="text-muted-foreground">Administrative Management Consulting Services</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="border-b border-border pb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Core Competencies</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        Custom Web Application Development
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        Mobile App Development (iOS & Android)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        UI/UX Design & Accessibility (508 Compliance)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        Digital Branding & Design Services
                      </li>
                    </ul>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        Cloud Infrastructure (AWS, Azure)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        IT Consulting & Technical Support
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        Systems Integration & Modernization
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">•</span>
                        Database Design & Management
                      </li>
                    </ul>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="border-b border-border pb-8">
                  <h3 className="text-lg font-medium mb-4">Business Description</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Reed Digital Group LLC provides tech consulting services including website and mobile app 
                    development, digital design, branding, and IT support to small businesses, startups, 
                    and government agencies in Maryland and nationwide. We are committed to delivering 
                    high-quality, accessible, and secure digital solutions that meet the unique requirements 
                    of federal, state, and local government contracts.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="text-center pt-4">
                  <a 
                    href="/capability-statement" 
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    View Capability Statement
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GovernmentPage;
