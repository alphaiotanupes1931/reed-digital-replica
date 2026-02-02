import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/rdg-header-logo.png";

const CapabilityStatement = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <Link to="/government" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={16} />
          Back to Government
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-background border border-border overflow-hidden print:border-0">
        {/* Header */}
        <div className="bg-foreground text-background p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img 
                src={logo} 
                alt="Reed Digital Group" 
                className="h-12 invert"
              />
              <div>
                <h1 className="text-2xl font-medium tracking-tight">Reed Digital Group LLC</h1>
                <p className="text-background/60 text-sm mt-1">Modern Technology Solutions for Mission Success</p>
              </div>
            </div>
            <div className="text-right text-sm hidden sm:block">
              <p className="font-mono text-xs tracking-wider opacity-60">CAPABILITY STATEMENT</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Column */}
          <div className="md:col-span-2 p-8 space-y-8">
            {/* Core Competencies */}
            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <ul className="space-y-2">
                  {["Custom Software Development", "Web Application Development", "Mobile App Development", "Cloud Solutions (AWS, Azure)", "Database Design & Management"].map((item) => (
                    <li key={item} className="text-muted-foreground">{item}</li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {["IT Consulting & Strategy", "System Integration", "UI/UX Design", "Agile Project Management", "Technical Support"].map((item) => (
                    <li key={item} className="text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Differentiators */}
            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
                Differentiators
              </h2>
              <div className="space-y-3 text-sm">
                {[
                  { title: "Agile Methodology", desc: "Iterative development with continuous stakeholder engagement" },
                  { title: "Small Business Agility", desc: "Rapid response, direct communication, flexible contracting" },
                  { title: "Modern Tech Stack", desc: "Cloud-native architectures for scalable solutions" },
                  { title: "Fast Turnaround", desc: "Accelerated delivery without compromising quality" },
                  { title: "Cost-Effective", desc: "Competitive pricing with transparent billing" },
                ].map((item) => (
                  <div key={item.title}>
                    <span className="font-medium">{item.title}</span>
                    <span className="text-muted-foreground"> — {item.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Past Performance */}
            <section>
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
                Past Performance
              </h2>
              <div className="text-sm space-y-4">
                <div>
                  <p className="font-medium">Commercial Web & Application Development</p>
                  <p className="text-muted-foreground mt-1">
                    50+ custom web applications and mobile solutions for businesses and organizations.
                  </p>
                </div>
                <div>
                  <p className="font-medium">IT Consulting & Digital Transformation</p>
                  <p className="text-muted-foreground mt-1">
                    Strategy consulting and digital presence development for professional services firms.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-4">
                  Federal-ready. Actively pursuing GSA Schedule and government contracting opportunities.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="p-8 bg-muted/50 space-y-6 border-l border-border">
            {/* NAICS Codes */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                NAICS Codes
              </h2>
              <div className="space-y-1 text-sm">
                <div><span className="font-mono">541511</span> <span className="text-muted-foreground text-xs">(Primary)</span></div>
                <div className="text-muted-foreground text-xs">Custom Computer Programming</div>
                <div className="font-mono mt-2">541512</div>
                <div className="text-muted-foreground text-xs">Computer Systems Design</div>
                <div className="font-mono mt-2">541519</div>
                <div className="text-muted-foreground text-xs">Other Computer Related Services</div>
                <div className="font-mono mt-2">541611</div>
                <div className="text-muted-foreground text-xs">Admin. Management Consulting</div>
              </div>
            </section>

            {/* PSC Codes */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                PSC Codes
              </h2>
              <div className="space-y-1 text-sm">
                <div className="font-mono">DA01</div>
                <div className="text-muted-foreground text-xs">IT & Telecom - Business App</div>
                <div className="font-mono mt-2">DA10</div>
                <div className="text-muted-foreground text-xs">IT & Telecom - Web-Based Services</div>
              </div>
            </section>

            {/* Company Data */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Company Data
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">UEI Number</div>
                  <div className="font-mono">Pending</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">CAGE Code</div>
                  <div className="font-mono">Pending</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Business Type</div>
                  <div>Small Business</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Entity</div>
                  <div>LLC</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Location</div>
                  <div>Brandywine, MD</div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Point of Contact
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">Terell Reed</p>
                <p className="text-muted-foreground text-xs">Founder & CEO</p>
                <div className="space-y-1 mt-3 text-xs text-muted-foreground">
                  <p>info@reeddigitalgroup.com</p>
                  <p>(301) 332-4084</p>
                  <p>reeddigitalgroup.com</p>
                  <p>Brandywine, MD</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-foreground text-background py-4 px-8">
          <p className="text-xs text-center opacity-60 font-mono">
            Reed Digital Group LLC — Modern Technology Solutions for Government & Commercial Clients
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="max-w-4xl mx-auto mt-8 text-center print:hidden">
        <button 
          onClick={() => window.print()} 
          className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
        >
          Download as PDF
        </button>
        <p className="text-xs text-muted-foreground mt-2 font-mono">Use browser print to save as PDF</p>
      </div>
    </div>
  );
};

export default CapabilityStatement;
