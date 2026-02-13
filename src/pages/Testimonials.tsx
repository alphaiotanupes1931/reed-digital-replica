import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const testimonials = [
  {
    quote: "I came to this project with very disjointed, chaotic ideas, and Reed Digital Group somehow transformed them into an organized, cohesive, and genuinely pleasurable experience. His team took my abstract thoughts and turned them into something tangible, professional, and perfectly suited to my art business. He was also amazing at explaining every step of the process in a clear, patient way, especially for someone like me who isn't familiar with coding or computers. I felt supported, understood, and confident the entire time. I couldn't be happier with the final result.",
    author: "Iyanna Wright",
  },
  {
    quote: "Best upcoming artist out right now. He takes the time to fully understand his clients' needs, which shows in the quality of his work. He stays up late, responds quickly, and pays attention to the smallest details—even fixing issues that are off by a single number. That level of dedication and precision is exactly why he's worth hiring.",
    author: "Kastle Wo'Mak",
  },
  {
    quote: "Reed Digital Group is a highly professional web design company that delivers outstanding customer service and clear, consistent communication. After speaking with several other firms that quoted excessive pricing, our consultation with Reed Digital immediately felt like the right fit. Their onboarding process was smooth, their pricing was transparent with no hidden fees, and the projected timeline aligned perfectly with our expectations—if anything, they delivered ahead of schedule. What truly set them apart was their continued follow-up weeks and even months after the website launch to ensure we remained satisfied. I've already started recommending Reed Digital Group to several business partners and colleagues.",
    author: "OQP Solutions",
  },
  {
    quote: "Great experience working with them — fast, reliable, and very communicative.",
    author: "Adetokunbo Awosanya",
  },
  {
    quote: "Reed Digital Group has an outstanding partnership in helping me build my insurance agency website, understanding the complexity of offering multiple insurance products and creating a strong, professional digital presence that reflects the full scope of what we do. Their guidance, communication, and expertise may help the entire process move forward. I've been real. I've seen real improvement in visibility and engagement, and I highly recommend Reed Digital Group to any agency looking to elevate their brand and scale with confidence.",
    author: "Shelley Sanders",
  },
];

const GOOGLE_REVIEW_URL = "https://share.google/X1nNcq7JiSRV1Bobv";

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const TestimonialsPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="section-label font-mono">Testimonials</span>
                  <TypedHeader text="Client Reviews" className="mt-4 mb-6" />
                </div>
              </ScrollReveal>

              {/* Testimonials */}
              <div className="space-y-12">
                {testimonials.map((testimonial, index) => (
                  <ScrollReveal key={index} delay={index * 0.05}>
                    <div className="border-b border-border pb-12">
                      <blockquote className="text-lg leading-relaxed mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <a 
                          href={GOOGLE_REVIEW_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          title="View on Google Reviews"
                        >
                          <GoogleLogo />
                        </a>
                        <p className="text-sm text-muted-foreground">
                          — {testimonial.author}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* CTA */}
              <ScrollReveal delay={0.3}>
                <div className="text-center mt-16">
                  <Link 
                    to="/contact"
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    Start Your Project
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default TestimonialsPage;
