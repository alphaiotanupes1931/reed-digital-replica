import { motion } from "framer-motion";
import { Award, Code, Shield, Users, Briefcase, GraduationCap, Linkedin, Trophy, Newspaper, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import LeaveReviewSection from "@/components/LeaveReviewSection";
import founderImage from "@/assets/founder.png";
import comptiaLogo from "@/assets/comptia-logo.png";
import ciscoLogo from "@/assets/cisco-logo.png";
import gener8torLogo from "@/assets/awards/gener8tor.png";
import mediumLogo from "@/assets/medium-logo.svg";

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
  { icon: Award, title: "Excellence", desc: "Award-winning work" },
];

const awards = [
  { 
    title: "Lincoln Financial Hackathon", 
    achievement: "2nd Place",
    project: "WealthGenius",
    logo: "https://epayments.web.lfg.com/assets/images/lfg-logo-new.svg"
  },
  { 
    title: "American Airlines Hackathon", 
    achievement: "Best Technical Solution",
    project: null,
    logo: "https://static.wikia.nocookie.net/aviation-airport/images/6/61/American-Airlines-Logo.png/revision/latest?cb=20240425172154"
  },
  { 
    title: "Gener8tor Hackathon", 
    achievement: "2nd Place",
    project: null,
    logo: gener8torLogo
  },
  { 
    title: "Morgan State University Hackathon", 
    achievement: "3rd Place",
    project: null,
    logo: "https://upload.wikimedia.org/wikipedia/en/6/63/Morgan_State_University_Logo.svg"
  },
];

const pressFeatures = [
  {
    name: "The Baltimore Times",
    logo: "https://macpa.net/wp-content/uploads/2013/07/The-Baltimore-Times-Cover-Page-scaled-2502x2502.jpg",
    url: "https://baltimoretimes-online.com/latest-news/2023/04/28/morgan-state-university-students-take-home-prize-money-land-internships-after-hackathon/",
    year: "2023"
  },
  {
    name: "Medium",
    logo: mediumLogo,
    url: "https://medium.com/@terellebony/how-i-got-into-cybersecurity-and-ai-with-no-roadmap-no-connections-and-no-blueprint-d89e731d2a8c",
    year: "2024"
  },
  {
    name: "MITRE Corporation",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Mitre_Corporation_logo.svg/320px-Mitre_Corporation_logo.svg.png",
    url: "https://www.mitre.org/news-insights/mitre-360/mitre-360-october",
    year: "2023"
  },
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
                  { value: "5+", label: "Awards Won" },
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
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-medium mb-1">Terell Reed</h3>
                          <p className="text-primary font-mono text-sm">Founder & CEO</p>
                        </div>
                        <a 
                          href="https://www.linkedin.com/in/terell-reed-140377263/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 border border-border rounded hover:border-primary hover:text-primary transition-colors"
                          aria-label="LinkedIn Profile"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        A Computer Science graduate from Morgan State University with deep expertise 
                        in both <strong>software development</strong> and <strong>cybersecurity</strong>. 
                        Before founding Reed Digital Group, Terell served as a System Administrator 
                        for Prince George's County Council managing critical government infrastructure, 
                        and as a Security Engineer at MITRE Corporation where he worked on 
                        security solutions for federal systems.
                      </p>

                      {/* Experience Pills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <GraduationCap className="w-4 h-4" />
                          Morgan State University
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <Shield className="w-4 h-4" />
                          MITRE Corporation
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <Briefcase className="w-4 h-4" />
                          PG County Government
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-sm rounded">
                          <Code className="w-4 h-4" />
                          Full-Stack Developer
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

            {/* Awards Section */}
            <ScrollReveal delay={0.22}>
              <div className="mb-24">
                <div className="flex items-center justify-center gap-2 mb-10">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center">
                    Awards & Recognition
                  </h2>
                </div>
                
                {/* Press Features */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {pressFeatures.map((press, index) => (
                    <motion.a
                      key={press.name}
                      href={press.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3 bg-muted/50 rounded-lg border border-border hover:border-primary transition-colors group"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <img 
                        src={press.logo} 
                        alt={press.name}
                        className="h-6 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="text-sm">
                        <span className="text-muted-foreground">Featured on </span>
                        <span className="font-medium">{press.name}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.a>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {awards.map((award, index) => (
                    <motion.div
                      key={award.title}
                      className="text-center p-6 border border-border hover:border-primary transition-colors group rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="h-12 flex items-center justify-center mb-4">
                        <img 
                          src={award.logo} 
                          alt={award.title}
                          className="max-h-full w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="text-lg font-medium text-primary mb-1">
                        {award.achievement}
                      </div>
                      <div className="text-sm font-medium mb-1">{award.title}</div>
                      {award.project && (
                        <div className="text-xs text-muted-foreground">
                          "{award.project}"
                        </div>
                      )}
                    </motion.div>
                  ))}
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
