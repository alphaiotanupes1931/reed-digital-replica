import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const testimonials = [
  {
    quote: "Reed Digital Group is a highly professional web design company that delivers outstanding customer service and clear, consistent communication.",
    author: "OQP Solutions",
  },
  {
    quote: "I came to this project with very disjointed, chaotic ideas, and Reed Digital Group somehow transformed them into an organized, cohesive, and genuinely pleasurable experience.",
    author: "Iyanna Wright",
  },
  {
    quote: "Very experienced and knowledgeable. Appreciate the time spent on my last project, worth every penny.",
    author: "Tyrel Fuentes",
  },
  {
    quote: "They really listened to what I needed and delivered a clean, professional website that exceeded my expectations.",
    author: "Chaz Crockett",
  },
  {
    quote: "Great experience working with them — fast, reliable, and very communicative.",
    author: "Adetokunbo Awosanya",
  },
];

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
                      <p className="text-sm text-muted-foreground">
                        — {testimonial.author}
                      </p>
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