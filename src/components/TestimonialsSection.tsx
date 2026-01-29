import { useState, useEffect } from "react";
import TypedHeader from "@/components/TypedHeader";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const testimonials = [
  {
    quote: "Very experienced and knowledgeable. Appreciate the time spent on my last project, worth every penny. Would recommend this team to any and everyone.",
    author: "Tyrel Fuentes",
    reviews: "6 reviews",
    time: "2 weeks ago",
  },
  {
    quote: "Reed Digital Group was honestly great to work with. They really listened to what I needed and delivered a clean, professional website that exceeded my expectations. The fact that they offer monthly payment options made it even easier to get started without a huge upfront cost — I'd definitely recommend them.",
    author: "Chaz Crockett",
    reviews: "2 reviews",
    time: "2 weeks ago",
  },
  {
    quote: "Great experience working with them fast, reliable, and very communicative",
    author: "Adetokunbo Awosanya",
    reviews: "1 review",
    time: "2 weeks ago",
  },
  {
    quote: "Very helpful and efficient!",
    author: "j h",
    reviews: "2 reviews",
    time: "2 weeks ago",
  },
  {
    quote: "Reed Digital Group is a highly professional web design company that delivers outstanding customer service and clear, consistent communication.",
    author: "OQP Solutions",
    reviews: "2 reviews",
    time: "3 days ago",
  },
  {
    quote: "I came to this project with very disjointed, chaotic ideas, and Reed Digital Group somehow transformed them into an organized, cohesive, and genuinely pleasurable experience.",
    author: "Iyanna Wright",
    reviews: "1 review",
    time: "3 days ago",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
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
            <blockquote className="text-lg md:text-xl leading-relaxed mb-8 transition-opacity duration-500">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            <div className="mb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <GoogleIcon />
                <p className="font-medium">{testimonials[currentIndex].author}</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {testimonials[currentIndex].reviews} · {testimonials[currentIndex].time}
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
