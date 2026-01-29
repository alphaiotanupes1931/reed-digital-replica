import { useEffect, useState, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";

const words = ["Websites", "Apps", "Platforms", "Experiences"];

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden glow-top"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Floating Elements */}
      <div
        className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float"
        style={{
          left: `${20 + mousePosition.x * 10}%`,
          top: `${20 + mousePosition.y * 10}%`,
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full bg-cyan/5 blur-3xl animate-float"
        style={{
          right: `${20 + mousePosition.x * 5}%`,
          bottom: `${30 + mousePosition.y * 5}%`,
          animationDelay: "-3s",
        }}
      />

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-sm text-muted-foreground">Available for new projects</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8">
            <span className="text-foreground">We Build</span>
            <br />
            <span className="text-gradient relative inline-block min-w-[300px]">
              {words[currentWord]}
            </span>
            <br />
            <span className="text-muted-foreground/60">That Scale</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Modern software development for businesses ready to grow. 
            We craft digital solutions that look stunning and perform flawlessly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a href="#contact" className="btn-primary flex items-center gap-2 text-base w-full sm:w-auto justify-center">
              Start Your Project <ArrowRight size={18} />
            </a>
            <a href="#work" className="btn-ghost flex items-center gap-2 text-base w-full sm:w-auto justify-center">
              <Play size={18} /> View Our Work
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "100%", label: "Client Satisfaction" },
              { value: "<2wk", label: "Avg. Turnaround" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
