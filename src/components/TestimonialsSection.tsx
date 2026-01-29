import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  { quote: "Very experienced and knowledgeable. Worth every penny.", author: "Tyrel Fuentes" },
  { quote: "They really listened to what I needed and delivered a clean, professional website.", author: "Chaz Crockett" },
  { quote: "Fast, reliable, and very communicative.", author: "Adetokunbo Awosanya" },
  { quote: "Outstanding customer service and clear communication.", author: "OQP Solutions" },
  { quote: "Transformed chaotic ideas into an organized, cohesive experience.", author: "Iyanna Wright" },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase text-center mb-12">
            Testimonials
          </p>
        </ScrollReveal>

        <div className="max-w-xl mx-auto text-center">
          <blockquote className="text-lg md:text-xl leading-relaxed mb-6 min-h-[4rem]">
            "{testimonials[currentIndex].quote}"
          </blockquote>
          <p className="text-sm text-muted-foreground font-mono mb-8">
            — {testimonials[currentIndex].author}
          </p>

          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-foreground" : "bg-border"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
