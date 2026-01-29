import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const rotatingWords = ["Websites", "Apps", "Brands", "Experiences"];

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-light/90 via-purple-medium/80 to-purple-light/70 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80"
          alt="Coding workspace"
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-5rem)] py-20">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-left">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight mb-6">
              We Build
              <br />
              <span className="relative inline-block h-[1.2em] overflow-hidden">
                <span
                  className={`text-gradient-gold inline-block transition-all duration-300 ${
                    isAnimating ? "opacity-0 translate-y-full" : "opacity-100 translate-y-0"
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button className="btn-gold text-base">Start Your Project</Button>
              <Button variant="outline" className="btn-outline-dark text-base">
                View Our Work
              </Button>
            </div>
          </div>

          {/* Right Content - Monitor mockup would go here */}
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="bg-muted p-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                  alt="Website preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
