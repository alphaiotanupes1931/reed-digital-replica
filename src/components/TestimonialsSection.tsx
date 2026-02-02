import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  { quote: "Very experienced and knowledgeable. Worth every penny.", author: "Tyrel Fuentes" },
  { quote: "They really listened to what I needed and delivered a clean, professional website.", author: "Chaz Crockett" },
  { quote: "Fast, reliable, and very communicative.", author: "Adetokunbo Awosanya" },
  { quote: "Outstanding customer service and clear communication.", author: "OQP Solutions" },
  { quote: "Transformed chaotic ideas into an organized, cohesive experience.", author: "Iyanna Wright" },
];

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration * 60);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count}</span>;
};

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
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      {/* Large background text */}
      <div className="bg-text right-0 top-1/2 -translate-y-1/2 text-right">
        TRUST
      </div>
      
      <div className="container relative z-10">
        {/* Stats counter */}
        <div className="flex justify-center gap-16 mb-20">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-medium text-primary">
              <AnimatedCounter end={50} />+
            </div>
            <p className="text-sm text-muted-foreground mt-2">Projects Delivered</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-medium text-primary">
              <AnimatedCounter end={100} />%
            </div>
            <p className="text-sm text-muted-foreground mt-2">Client Satisfaction</p>
          </div>
        </div>

        <ScrollReveal>
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Client Testimonials
          </motion.p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto text-center">
          <div className="min-h-[160px] flex items-center justify-center">
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
                <p className="text-sm text-muted-foreground">
                  — {testimonials[currentIndex].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-8 h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary" : "bg-border hover:bg-muted-foreground"
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
