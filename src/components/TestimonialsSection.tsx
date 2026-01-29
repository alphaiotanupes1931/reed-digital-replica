import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    initials: "SS",
    name: "Shelley Sanders",
    text: "Reed Digital Group has an outstanding partnership in helping me build my insurance agency website, understanding the complexity of offering multiple insurance products and creating a strong, professional digital presence that reflects the quality of my services.",
  },
  {
    initials: "CC",
    name: "Chaz Crockett",
    text: "Reed Digital Group was honestly great to work with. They really listened to what I needed and delivered a clean, professional website that exceeded my expectations. The fact that they offer monthly payment options made it even easier to get started without a huge upfront cost — I'd definitely recommend them.",
  },
  {
    initials: "AA",
    name: "Adetokunbo Awosanya",
    text: "Great experience working with them fast, reliable, and very communicative.",
  },
  {
    initials: "JC",
    name: "Joseph Coles",
    text: "Well effective moderator, elevating critical development for our team portfolio.",
  },
  {
    initials: "LO",
    name: "Lesley Ofosu",
    text: "Communication was on point, delivery was clean, and the results spoke for themselves. Definitely recommend if you want quality work done right.",
  },
  {
    initials: "KW",
    name: "Kastle Wo'Mak",
    text: "Best upcoming artist out right now. He takes the time to fully understand his clients' needs, which shows in the quality of his work. He stays up late, responds quickly, and pays attention to the smallest details—even fixing issues that are off by a single number.",
  },
  {
    initials: "AD",
    name: "Anthony Dow",
    text: "Excellent customer service and communication. I will definitely be using RDG again.",
  },
  {
    initials: "IP",
    name: "Iyana Ponce-Scott",
    text: "The quality of work is truly exceptional. Everything is extremely professional, well-designed, and delivered in a very timely manner. The attention to detail and level of care put into each project really stands out.",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = testimonials.length - itemsToShow;

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <p className="section-label">The Proof</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">What our clients say</h2>
            <p className="text-muted-foreground">
              Don't just take our word for it. Here's what real clients have to say.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <div className="flex items-center gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-semibold">5.0 on Google</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="bg-card rounded-2xl p-8 h-full shadow-sm border border-border">
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed line-clamp-5">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{testimonial.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">Verified Client</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
