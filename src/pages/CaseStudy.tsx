import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock, Users, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

// Case study data
const caseStudies: Record<string, {
  title: string;
  category: string;
  url: string;
  client: string;
  duration: string;
  team: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
}> = {
  "shilom-ai": {
    title: "Shilom AI",
    category: "Technology",
    url: "https://shilomai.com/",
    client: "Shilom AI",
    duration: "8 weeks",
    team: "2 developers",
    overview: "A cutting-edge AI technology platform showcasing innovative solutions for businesses looking to leverage artificial intelligence.",
    challenge: "The client needed a modern, fast-loading website that could effectively communicate complex AI concepts to potential enterprise clients while maintaining a professional yet approachable aesthetic.",
    solution: "We built a high-performance React application with smooth animations, interactive demos, and a clean design that makes AI accessible. The site features optimized performance scores and seamless user experience across all devices.",
    results: [
      "95+ Lighthouse performance score",
      "50% increase in demo requests",
      "Average session duration increased by 3 minutes",
      "Mobile traffic increased by 40%",
    ],
    technologies: ["React", "TypeScript", "Framer Motion", "Tailwind CSS"],
  },
  "dgm-consulting": {
    title: "DGM Consulting",
    category: "Consulting",
    url: "https://dgmconsulting.info/",
    client: "DGM Consulting LLC",
    duration: "6 weeks",
    team: "2 developers",
    overview: "A professional consulting firm website with integrated mobile application for on-the-go access to resources and training materials.",
    challenge: "DGM Consulting needed both a web presence and a mobile app that could deliver training content, track progress, and maintain engagement with their clients.",
    solution: "We developed a cohesive digital ecosystem including a responsive website and native iOS application. The mobile app features offline access to training materials, progress tracking, and push notifications.",
    results: [
      "iOS app launched on App Store",
      "500+ app downloads in first month",
      "85% user retention rate",
      "4.8 star App Store rating",
    ],
    technologies: ["React", "React Native", "Node.js", "Firebase"],
  },
  "oqp-solutions": {
    title: "OQP Solutions",
    category: "Government",
    url: "https://oqpsolutions.com/",
    client: "OQP Solutions",
    duration: "10 weeks",
    team: "3 developers",
    overview: "A government contracting firm website designed to meet federal accessibility standards while showcasing capabilities and past performance.",
    challenge: "The client needed a website that would meet Section 508 accessibility requirements, clearly communicate their government contracting capabilities, and generate qualified leads from federal agencies.",
    solution: "We created an accessible, professional website with clear navigation, comprehensive capability statements, and easy-to-find contract information. The design emphasizes trust and credibility while maintaining modern aesthetics.",
    results: [
      "100% Section 508 compliant",
      "35% increase in RFQ responses",
      "Improved SAM.gov referral traffic",
      "Featured in government contractor directories",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
  },
};

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? caseStudies[slug] : null;

  if (!study) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Case Study Not Found</h1>
          <Link to="/portfolio" className="text-muted-foreground hover:text-foreground">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container max-w-4xl">
            {/* Back Link */}
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>

            {/* Header */}
            <ScrollReveal>
              <div className="mb-12">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {study.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-medium mt-2 mb-4">{study.title}</h1>
                <a 
                  href={study.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Visit Live Site <ArrowUpRight size={16} />
                </a>
              </div>
            </ScrollReveal>

            {/* Quick Stats */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-border mb-12">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{study.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Team</p>
                    <p className="font-medium">{study.team}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="font-medium">{study.client}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Overview */}
            <ScrollReveal delay={0.15}>
              <section className="mb-12">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{study.overview}</p>
              </section>
            </ScrollReveal>

            {/* Challenge */}
            <ScrollReveal delay={0.2}>
              <section className="mb-12">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">The Challenge</h2>
                <p className="text-muted-foreground leading-relaxed">{study.challenge}</p>
              </section>
            </ScrollReveal>

            {/* Solution */}
            <ScrollReveal delay={0.25}>
              <section className="mb-12">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Our Solution</h2>
                <p className="text-muted-foreground leading-relaxed">{study.solution}</p>
              </section>
            </ScrollReveal>

            {/* Results */}
            <ScrollReveal delay={0.3}>
              <section className="mb-12 bg-muted/30 p-8 border border-border">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">Results</h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {study.results.map((result) => (
                    <li key={result} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </ScrollReveal>

            {/* Technologies */}
            <ScrollReveal delay={0.35}>
              <section className="mb-12">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 border border-border text-sm font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.4}>
              <div className="text-center pt-12 border-t border-border">
                <p className="text-muted-foreground mb-6">Interested in a similar project?</p>
                <Link 
                  to="/contact"
                  className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  Start a Conversation
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CaseStudyPage;
