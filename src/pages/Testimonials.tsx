import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";

const testimonials = [
  {
    quote: "Reed Digital delivered beyond our expectations. Their attention to detail and commitment to quality is unmatched. They took the time to truly understand our business needs.",
    author: "Sarah Chen",
    title: "CEO",
    company: "TechStart Inc.",
  },
  {
    quote: "Working with Reed Digital was a seamless experience. They understood our vision and executed it flawlessly. The project was delivered on time and within budget.",
    author: "Michael Torres",
    title: "Director of Operations",
    company: "Nexus Group",
  },
  {
    quote: "Professional, responsive, and incredibly talented. They transformed our digital presence completely. Our conversion rates have increased by 150% since launch.",
    author: "Emily Richardson",
    title: "Marketing Director",
    company: "Elevate Co.",
  },
  {
    quote: "The team at Reed Digital brought a level of expertise we hadn't experienced before. Their technical knowledge combined with design sensibility is rare.",
    author: "David Park",
    title: "CTO",
    company: "Horizon Partners",
  },
  {
    quote: "From initial consultation to final delivery, the process was smooth and transparent. They kept us informed at every step and were always available for questions.",
    author: "Amanda Foster",
    title: "Founder",
    company: "Summit Digital",
  },
];

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">Testimonials</span>
              <TypedHeader text="Client Voices" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                What our clients say about working with us.
              </p>
            </div>

            {/* Testimonials */}
            <div className="space-y-12">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="border-b border-border pb-12">
                  <blockquote className="text-lg md:text-xl leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
