import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Reed Digital Group has an outstanding partnership in helping me build my insurance agency website, understanding the complexity of offering multiple insurance products and creating a strong, professional digital presence.",
    author: "Shelley Sanders",
    role: "Insurance Agency Owner",
    rating: 5,
  },
  {
    text: "They really listened to what I needed and delivered a clean, professional website that exceeded my expectations. The monthly payment options made it even easier to get started.",
    author: "Chaz Crockett",
    role: "Business Owner",
    rating: 5,
  },
  {
    text: "Best upcoming team out right now. He takes the time to fully understand his clients' needs, which shows in the quality of his work. That level of dedication is exactly why he's worth hiring.",
    author: "Kastle Wo'Mak",
    role: "Entrepreneur",
    rating: 5,
  },
  {
    text: "The quality of work is truly exceptional. Everything is extremely professional, well-designed, and delivered in a very timely manner. Highly impressive work overall!",
    author: "Iyana Ponce-Scott",
    role: "Verified Client",
    rating: 5,
  },
  {
    text: "Very experienced and knowledgeable. Appreciate the time spent on my last project, worth every penny. Would recommend this team to any and everyone.",
    author: "Tyrel Fuentes",
    role: "Project Manager",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 relative bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            What clients <span className="text-gradient">say</span>
          </h2>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="card-dark p-8 md:p-12 relative">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
            
            <div className="text-center relative z-10">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <blockquote className="font-display text-xl md:text-2xl lg:text-3xl font-medium mb-8 leading-relaxed">
                "{testimonials[current].text}"
              </blockquote>
              
              <div>
                <p className="font-display font-semibold text-lg">{testimonials[current].author}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
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
                    current === index ? "w-8 bg-primary" : "bg-muted-foreground/30"
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

        {/* Google Rating Badge */}
        <div className="flex justify-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary border border-border">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-semibold">5.0</span>
            <span className="text-muted-foreground">on Google</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
