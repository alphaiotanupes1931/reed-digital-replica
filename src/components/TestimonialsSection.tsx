import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  { quote: "Very experienced and knowledgeable. Worth every penny.", author: "Tyrel Fuentes", role: "Business Owner" },
  { quote: "They really listened to what I needed and delivered a clean, professional website.", author: "Chaz Crockett", role: "Entrepreneur" },
  { quote: "Fast, reliable, and very communicative.", author: "Adetokunbo Awosanya", role: "Startup Founder" },
  { quote: "Outstanding customer service and clear communication.", author: "OQP Solutions", role: "Government Contractor" },
  { quote: "Transformed chaotic ideas into an organized, cohesive experience.", author: "Iyanna Wright", role: "Creative Director" },
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
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Decorative quote marks */}
      <div className="absolute top-20 left-1/4 text-[200px] font-serif text-primary/5 leading-none select-none">"</div>
      <div className="absolute bottom-10 right-1/4 text-[200px] font-serif text-accent/5 leading-none rotate-180 select-none">"</div>
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-sm font-mono tracking-widest uppercase text-center mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Client Love
          </motion.p>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Testimonials
          </motion.h2>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto text-center">
          <div className="min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Quote card */}
                <div className="relative p-8 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-xl">
                  {/* Gradient glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-xl opacity-50" />
                  
                  <div className="relative z-10">
                    <blockquote className="text-xl md:text-2xl leading-relaxed mb-6 font-medium">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                      {/* Avatar placeholder with gradient */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                        {testimonials[currentIndex].author[0]}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{testimonials[currentIndex].author}</p>
                        <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="relative w-3 h-3 rounded-full transition-all duration-300"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-gradient-to-r from-primary to-accent scale-100" 
                    : "bg-border scale-75 hover:scale-100"
                }`} />
                {index === currentIndex && (
                  <motion.span 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                    layoutId="activeDot"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
