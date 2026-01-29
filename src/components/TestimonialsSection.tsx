import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    text: "Reed Digital Group delivered a website that exceeded our expectations. Professional, responsive, and truly understood our vision.",
    author: "Shelley Sanders",
    role: "Insurance Agency Owner",
  },
  {
    text: "They really listened to what I needed and delivered a clean, professional website. The monthly payment options made it easy to get started.",
    author: "Chaz Crockett",
    role: "Business Owner",
  },
  {
    text: "The quality of work is truly exceptional. Everything is extremely professional, well-designed, and delivered on time.",
    author: "Iyana Ponce-Scott",
    role: "Entrepreneur",
  },
  {
    text: "Very experienced and knowledgeable. Worth every penny. Would recommend this team to anyone.",
    author: "Tyrel Fuentes",
    role: "Project Manager",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section Header */}
          <p className="section-label mb-4">Testimonials</p>
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-foreground text-foreground" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">5.0 on Google</span>
          </div>

          {/* Testimonial */}
          <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed min-h-[120px]">
            "{testimonials[current].text}"
          </blockquote>

          <div className="mb-8">
            <p className="font-semibold">{testimonials[current].author}</p>
            <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    current === index ? "w-6 bg-foreground" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
