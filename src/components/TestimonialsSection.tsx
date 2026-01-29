import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase text-center mb-16">
            Testimonials
          </p>
        </ScrollReveal>

        <div className="max-w-xl mx-auto text-center">
          <div className="min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <blockquote className="text-xl md:text-2xl leading-relaxed mb-6 font-light">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <p className="text-sm text-muted-foreground font-mono">
                  — {testimonials[currentIndex].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-foreground" : "bg-border"
                }`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
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
