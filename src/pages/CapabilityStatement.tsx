import { Mail, MapPin, Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CapabilityStatement = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-background border border-border rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-gray-300">
        {/* Header */}
        <div className="bg-foreground text-background p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-background/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-2xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Reed Digital Group LLC</h1>
                <p className="text-background/70 text-sm">Modern Technology Solutions for Mission Success</p>
              </div>
            </div>
            <div className="text-right text-sm hidden sm:block">
              <p className="font-semibold">CAPABILITY STATEMENT</p>
              <p className="opacity-70">Federal Contracting</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Left Column */}
          <div className="md:col-span-2 p-6 space-y-6 border-r border-border">
            {/* Core Competencies */}
            <section>
              <h2 className="text-lg font-semibold border-b-2 border-foreground pb-1 mb-3">
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <ul className="space-y-1">
                  {["Custom Software Development", "Web Application Development", "Mobile Application Development", "Cloud Solutions (AWS, Azure)", "Database Design & Management"].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-foreground mt-1">■</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {["IT Consulting & Strategy", "System Integration Services", "UI/UX Design & Prototyping", "Agile Project Management", "Technical Support & Maintenance"].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-foreground mt-1">■</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Differentiators */}
            <section>
              <h2 className="text-lg font-semibold border-b-2 border-foreground pb-1 mb-3">
                Differentiators
              </h2>
              <ul className="text-sm space-y-2">
                {[
                  { title: "Agile Methodology", desc: "Iterative development with continuous stakeholder engagement ensures alignment with mission requirements." },
                  { title: "Small Business Agility", desc: "Lean operations enable rapid response, direct communication, and flexible contracting." },
                  { title: "Modern Technology Stack", desc: "Expertise in current frameworks and cloud-native architectures for scalable, maintainable solutions." },
                  { title: "Fast Turnaround", desc: "Accelerated delivery timelines without compromising quality or security standards." },
                  { title: "Cost-Effective Solutions", desc: "Competitive pricing with transparent billing and no hidden overhead costs." },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-2">
                    <span className="text-foreground font-bold">✓</span>
                    <span><strong>{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Past Performance */}
            <section>
              <h2 className="text-lg font-semibold border-b-2 border-foreground pb-1 mb-3">
                Past Performance
              </h2>
              <div className="text-sm space-y-3">
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="font-semibold">Commercial Web & Application Development</p>
                  <p className="text-muted-foreground mt-1">Delivered 50+ custom web applications and mobile solutions for small businesses, startups, and organizations. Projects include e-commerce platforms, member management systems, and business process automation tools.</p>
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="font-semibold">Consulting & Digital Transformation</p>
                  <p className="text-muted-foreground mt-1">Provided IT strategy consulting and digital presence development for professional services firms, resulting in improved operational efficiency and client engagement.</p>
                </div>
                <p className="text-muted-foreground italic">Federal-ready. Actively pursuing GSA Schedule and government prime/subcontracting opportunities.</p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="p-6 bg-secondary/50 space-y-5">
            {/* NAICS Codes */}
            <section>
              <h2 className="text-sm font-semibold border-b-2 border-foreground pb-1 mb-2">
                NAICS CODES
              </h2>
              <ul className="text-xs space-y-1">
                <li><span className="font-mono font-semibold">541511</span> <span className="text-muted-foreground">Custom Computer Programming</span> <span className="text-xs font-semibold">(PRIMARY)</span></li>
                <li><span className="font-mono font-semibold">541512</span> <span className="text-muted-foreground">Computer Systems Design</span></li>
                <li><span className="font-mono font-semibold">541519</span> <span className="text-muted-foreground">Other Computer Related Services</span></li>
                <li><span className="font-mono font-semibold">518210</span> <span className="text-muted-foreground">Data Processing & Hosting</span></li>
                <li><span className="font-mono font-semibold">541611</span> <span className="text-muted-foreground">Admin. Management Consulting</span></li>
              </ul>
            </section>

            {/* PSC Codes */}
            <section>
              <h2 className="text-sm font-semibold border-b-2 border-foreground pb-1 mb-2">
                PSC CODES
              </h2>
              <ul className="text-xs space-y-1">
                <li><span className="font-mono font-semibold">DA01</span> <span className="text-muted-foreground">IT & Telecom - Business App/Mail</span></li>
                <li><span className="font-mono font-semibold">DA10</span> <span className="text-muted-foreground">IT & Telecom - Web-Based SW Svcs</span></li>
              </ul>
            </section>

            {/* Company Data */}
            <section>
              <h2 className="text-sm font-semibold border-b-2 border-foreground pb-1 mb-2">
                COMPANY DATA
              </h2>
              <ul className="text-xs space-y-2">
                <li><span className="text-muted-foreground block">UEI Number</span><span className="font-mono font-semibold">[UEI PENDING]</span></li>
                <li><span className="text-muted-foreground block">CAGE Code</span><span className="font-mono font-semibold">[CAGE PENDING]</span></li>
                <li><span className="text-muted-foreground block">Business Type</span><span className="font-semibold">Small Business</span></li>
                <li><span className="text-muted-foreground block">Entity Structure</span><span className="font-semibold">LLC</span></li>
                <li><span className="text-muted-foreground block">Headquarters</span><span className="font-semibold">Baltimore, Maryland</span></li>
              </ul>
            </section>

            {/* Status */}
            <section>
              <h2 className="text-sm font-semibold border-b-2 border-foreground pb-1 mb-2">
                STATUS
              </h2>
              <ul className="text-xs space-y-1">
                <li className="flex items-center gap-2"><span>●</span><span>Small Business (SB)</span></li>
                <li className="flex items-center gap-2 text-muted-foreground"><span>○</span><span>SAM.gov Registered (Pending)</span></li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-sm font-semibold border-b-2 border-foreground pb-1 mb-2">
                POINT OF CONTACT
              </h2>
              <div className="text-xs space-y-2">
                <p className="font-semibold">Terell Reed</p>
                <p className="text-muted-foreground">Founder & CEO</p>
                <div className="space-y-1 mt-2">
                  <p className="flex items-center gap-2"><Mail className="w-3 h-3" /><span>hello@reeddigitalgroup.com</span></p>
                  <p className="flex items-center gap-2"><Globe className="w-3 h-3" /><span>reeddigitalgroup.com</span></p>
                  <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /><span>Baltimore, MD</span></p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-foreground text-background p-3 text-center">
          <p className="text-xs opacity-80">
            <span className="font-semibold">Reed Digital Group LLC</span> — Modern Technology Solutions for Government & Commercial Clients
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="max-w-4xl mx-auto mt-6 text-center print:hidden">
        <button onClick={() => window.print()} className="btn-primary">
          Download as PDF
        </button>
        <p className="text-sm text-muted-foreground mt-2">Use browser print to save as PDF</p>
      </div>
    </div>
  );
};

export default CapabilityStatement;
