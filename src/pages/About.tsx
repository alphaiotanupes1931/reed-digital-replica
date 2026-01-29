import { Award, Building, Users, Trophy, GraduationCap, Shield, Network, Target, Lightbulb, Handshake } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import founderImage from "@/assets/founder.png";

const stats = [
  { label: "Established", value: "2020" },
  { label: "Clients Served", value: "50+" },
  { label: "Government Experience", value: "Proven" },
  { label: "Award Nominations", value: "Multiple" },
];

const certifications = [
  { name: "CompTIA A+ Certified", org: "CompTIA", year: "2023" },
  { name: "CompTIA Network+ Certified", org: "CompTIA", year: "2023" },
  { name: "Cisco Certified Network Associate", org: "Cisco", year: "2022" },
  { name: "Cisco CyberOps Associate", org: "Cisco", year: "2022" },
];

const values = [
  {
    number: "01",
    title: "Purpose-Driven",
    description: "Every project starts with understanding your goals. We align our solutions with your vision for measurable impact.",
    icon: Target,
  },
  {
    number: "02",
    title: "Innovation First",
    description: "We stay ahead of the curve, leveraging cutting-edge technologies to give your business a competitive edge.",
    icon: Lightbulb,
  },
  {
    number: "03",
    title: "Partnership Approach",
    description: "We see ourselves as an extension of your team. Your success is our success, and we're invested in the long haul.",
    icon: Handshake,
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Hero Section */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-20">
              <span className="section-label font-mono">About Us</span>
              <TypedHeader text="Building the future, one pixel at a time" className="mt-4 mb-6" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Reed Digital Group is a professional digital solutions agency specializing in custom websites, 
                mobile applications, IT infrastructure, and branding for government agencies, corporations, 
                and organizations ready to make an impact.
              </p>
            </div>
          </ScrollReveal>

          {/* Firm Qualifications */}
          <ScrollReveal delay={0.1}>
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-medium mb-2">Firm Qualifications</h2>
                <p className="text-muted-foreground">
                  A certified, experienced team trusted by government agencies and enterprise clients
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-6 border border-border rounded-sm">
                    <div className="text-2xl font-medium mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Our Story */}
          <ScrollReveal delay={0.15}>
            <div className="max-w-3xl mx-auto mb-24">
              <h2 className="text-2xl font-medium mb-8 text-center">Our Story</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, Reed Digital Group has grown from a solo endeavor into a professional 
                  digital agency serving government agencies, corporations, and non-profit organizations 
                  across multiple sectors.
                </p>
                <p>
                  Our contract work with Prince George's County Council and other government clients 
                  demonstrates our commitment to delivering secure, compliant, and reliable solutions 
                  for public sector organizations. We understand the unique requirements of government 
                  contracts and maintain the highest standards of professionalism.
                </p>
                <p>
                  We believe that great digital products are born from the intersection of beautiful design, 
                  robust technology, and strategic thinking. Every project we take on is an opportunity to 
                  create something meaningful that delivers measurable results.
                </p>
                <p>
                  Our approach is simple: understand deeply, build thoughtfully, and iterate constantly. 
                  We're not just building websites and apps—we're building long-term partnerships based 
                  on trust, expertise, and proven results.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Leadership / Founder Section */}
          <ScrollReveal delay={0.2}>
            <div className="mb-24 py-16 bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-4">
                  <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
                    Leadership
                  </span>
                </div>
                <h2 className="text-2xl font-medium mb-12 text-center">Meet the Founder</h2>
                
                <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
                  {/* Founder Image */}
                  <div className="flex flex-col items-center">
                    <div className="w-64 h-64 md:w-full md:h-auto aspect-square overflow-hidden rounded-sm border border-border mb-4">
                      <img 
                        src={founderImage} 
                        alt="Terell Reed" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium">Terell Reed</h3>
                    <p className="text-sm text-muted-foreground">Founder & CEO</p>
                    <p className="text-xs text-muted-foreground font-mono mt-2 text-center">
                      B.S. Computer Science, Morgan State University (3.6 GPA)<br />
                      Kappa Alpha Psi Fraternity, Inc.
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Terell Reed is a 21-year-old entrepreneur and technologist with a proven track record 
                      serving government agencies, corporations, and non-profit organizations. As founder of 
                      Reed Digital Group, he combines technical expertise with business acumen to deliver 
                      comprehensive digital solutions.
                    </p>
                    <p>
                      His experience includes contract work as System Administrator/Network Engineer for 
                      Prince George's County Council and completing an Offensive Security Engineering 
                      internship at MITRE. This background in both government IT infrastructure and 
                      cybersecurity provides unique insights into the security and compliance requirements 
                      of public sector clients.
                    </p>
                    <p>
                      Terell's expertise spans full-stack web development, mobile application development 
                      (React Native, SwiftUI), WordPress CMS implementation, cybersecurity, and network 
                      infrastructure. He holds multiple industry certifications including CompTIA A+, 
                      Network+, Cisco CCNA, and Cisco CyberOps Associate.
                    </p>
                    <p>
                      Beyond technical work, Terell is actively involved with the Alpha Iota Chapter of 
                      Kappa Alpha Psi Fraternity at Morgan State University, where he has led website 
                      development projects that competed for national awards. His commitment to excellence 
                      and community service drives every project Reed Digital Group undertakes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Certifications */}
          <ScrollReveal delay={0.25}>
            <div className="mb-24">
              <h2 className="text-2xl font-medium mb-8 text-center">Professional Certifications & Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {certifications.map((cert) => (
                  <div 
                    key={cert.name} 
                    className="p-6 border border-border rounded-sm hover:border-foreground/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {cert.org === "CompTIA" ? (
                        <Shield className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Network className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {cert.org} · {cert.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Our Values */}
          <ScrollReveal delay={0.3}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-medium mb-2">Our Values</h2>
                <p className="text-muted-foreground">What drives us</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value) => (
                  <div key={value.number} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-border rounded-full mb-4">
                      <value.icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mb-2">{value.number}</div>
                    <h3 className="font-medium mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Bottom Badge */}
          <div className="mt-20 pt-8 border-t border-border text-center">
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
