import { motion } from "framer-motion";
import { Award, Code, Shield, Users, Briefcase, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import LeaveReviewSection from "@/components/LeaveReviewSection";
import founderImage from "@/assets/founder.png";
import comptiaLogo from "@/assets/comptia-logo.png";
import ciscoLogo from "@/assets/cisco-logo.png";

const timeline = [
  { year: "2020", title: "Founded", desc: "Started as a freelance web developer" },
  { year: "2021", title: "First Major Client", desc: "Landed government contractor project" },
  { year: "2022", title: "Team Expansion", desc: "Built network of trusted collaborators" },
  { year: "2023", title: "50+ Projects", desc: "Milestone of successful deliveries" },
  { year: "2024", title: "Federal Ready", desc: "SAM registered, pursuing GSA Schedule" },
];

const values = [
  { icon: Code, title: "Quality First", desc: "Every line of code matters" },
  { icon: Users, title: "Client Focus", desc: "Your success is our success" },
  { icon: Shield, title: "Reliability", desc: "On time, every time" },
  { icon: Award, title: "Excellence", desc: "Award-nominated work" },
];

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-0">
          <div className="container">
            {/* Hero with Background Text */}
            <div className="relative mb-20">
              <div className="bg-text left-0 top-1/2 -translate-y-1/2 opacity-[0.03]">
                ABOUT
              </div>
              <ScrollReveal>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                  <span className="section-label font-mono">About Us</span>
                  <TypedHeader text="Building digital experiences since 2020" className="mt-4 mb-6" />
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    We're a remote-first digital agency passionate about helping businesses 
                    stand out online with beautiful, functional websites and applications.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Animated Stats */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                {[
                  { value: "2020", label: "Founded" },
                  { value: "50+", label: "Projects Delivered" },
                  { value: "100%", label: "Satisfaction Rate" },
                  { value: "4+", label: "Award Nominations" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-6 border border-border hover:border-primary transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="text-3xl font-mono text-primary mb-2 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Our Values */}
            <ScrollReveal delay={0.15}>
              <div className="mb-24">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-10">
                  Our Values
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {values.map((value, index) => (
                    <motion.div
                      key={value.title}
                      className="text-center p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div 
                        className="w-12 h-12 mx-auto mb-4 border border-primary/20 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1, borderColor: "hsl(var(--primary))" }}
                      >
                        <value.icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <h3 className="font-medium mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Founder Section */}
            <ScrollReveal delay={0.2}>
              <div className="relative mb-24">
                <div className="bg-text right-0 top-1/2 -translate-y-1/2 text-right opacity-[0.03]">
                  FOUNDER
                </div>
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-10">
                    Meet the Founder
                  </h2>
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Photo Side */}
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="aspect-square overflow-hidden rounded-lg border border-border">
                        <img 
                          src={founderImage} 
                          alt="Terell Reed" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Decorative elements */}
                      <motion.div 
                        className="absolute -top-4 -left-4 w-20 h-20 border border-primary/20"
                        animate={{ rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      />
                      <motion.div 
                        className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary/10"
                        animate={{ rotate: [0, -5, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Info Side */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-medium mb-1">Terell Reed</h3>
                        <p className="text-primary font-mono text-sm">Founder & CEO</p>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        A Computer Science graduate from Morgan State University with a passion 
                        for creating digital solutions that make a difference. Before founding 
                        Reed Digital Group, I honed my skills as a System Administrator for 
                        Prince George's County Council and as a Security Engineering intern at MITRE.
                      </p>

                      {/* Experience Pills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <GraduationCap className="w-4 h-4" />
                          Morgan State University
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <Briefcase className="w-4 h-4" />
                          Former MITRE Intern
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <Shield className="w-4 h-4" />
                          Security Background
                        </span>
                      </div>

                      {/* Certifications */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 font-mono">CERTIFICATIONS</p>
                        <div className="flex gap-6 items-center">
                          <img src={comptiaLogo} alt="CompTIA" className="h-10 opacity-70 hover:opacity-100 transition-opacity" />
                          <img src={ciscoLogo} alt="Cisco" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Timeline */}
            <ScrollReveal delay={0.25}>
              <div className="mb-24">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-10">
                  Our Journey
                </h2>
                <div className="max-w-2xl mx-auto">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.year}
                      className="flex gap-6 pb-8 relative"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Timeline line */}
                      {index !== timeline.length - 1 && (
                        <div className="absolute left-[39px] top-10 bottom-0 w-px bg-border" />
                      )}
                      
                      {/* Year bubble */}
                      <div className="flex-shrink-0 w-20 h-10 border border-primary bg-primary/5 flex items-center justify-center font-mono text-sm text-primary">
                        {item.year}
                      </div>
                      
                      {/* Content */}
                      <div className="pt-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Bottom Badge */}
            <ScrollReveal delay={0.3}>
              <div className="text-center pb-20">
                <motion.div 
                  className="inline-flex items-center gap-3 px-6 py-3 border border-border"
                  whileHover={{ borderColor: "hsl(var(--primary))" }}
                >
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-mono">
                    Small Business · SAM Registered · Federal Contractor Ready
                  </span>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Leave a Review Section */}
          <LeaveReviewSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AboutPage;
