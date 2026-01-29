import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "Reed Digital delivered beyond our expectations. Their attention to detail and commitment to quality is unmatched.",
    author: "Sarah Chen",
    title: "CEO, TechStart Inc.",
  },
  {
    quote: "Working with Reed Digital was a seamless experience. They understood our vision and executed it flawlessly.",
    author: "Michael Torres",
    title: "Director of Operations, Nexus Group",
  },
  {
    quote: "Professional, responsive, and incredibly talented. They transformed our digital presence completely.",
    author: "Emily Richardson",
    title: "Marketing Director, Elevate Co.",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="section-label">Testimonials</span>
            <h2 className="text-display-sm md:text-display font-serif mt-4 mb-6">
              Client Voices
            </h2>
            <div className="flex justify-center">
              <div className="divider" />
            </div>
          </div>

          {/* Testimonial */}
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-10">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            <div className="mb-10">
              <p className="font-medium">{testimonials[currentIndex].author}</p>
              <p className="text-sm text-muted-foreground">
                {testimonials[currentIndex].title}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={prev}
                className="p-2 border border-border hover:border-foreground transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex 
                        ? "bg-foreground" 
                        : "bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2 border border-border hover:border-foreground transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
