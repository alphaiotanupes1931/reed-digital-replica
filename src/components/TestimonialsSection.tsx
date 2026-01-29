import { useState, useEffect } from "react";
import TypedHeader from "@/components/TypedHeader";

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

  // Auto-advance every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="section-label font-mono">Testimonials</span>
            <TypedHeader text="Client Voices" className="mt-4" />
          </div>

          {/* Testimonial */}
          <div className="text-center">
            <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 transition-opacity duration-500">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            <div className="mb-8">
              <p className="font-medium">{testimonials[currentIndex].author}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {testimonials[currentIndex].title}
              </p>
            </div>

            {/* Dot indicators only */}
            <div className="flex justify-center gap-2">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
