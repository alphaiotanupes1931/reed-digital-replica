import { useEffect, useState, useCallback } from "react";

const words = ["websites", "applications", "brands", "experiences"];

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 120;
  const deleteSpeed = 60;
  const pauseTime = 2500;

  const animateText = useCallback(() => {
    const currentWord = words[currentWordIndex];
    
    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [displayText, isDeleting, currentWordIndex]);

  useEffect(() => {
    animateText();
  }, [animateText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-20">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-10 animate-fade-up">
            <div className="w-16 h-px bg-foreground/20" />
            <span className="section-label">Est. 2024</span>
            <div className="w-16 h-px bg-foreground/20" />
          </div>

          {/* Main Headline */}
          <h1 className="text-display-lg md:text-display-xl font-serif font-medium mb-8 animate-fade-up stagger-1">
            We design & build
            <br />
            digital {displayText}
            <span className="typing-cursor" />
          </h1>

          {/* Divider */}
          <div className="flex justify-center mb-8 animate-fade-up stagger-2">
            <div className="w-12 h-px bg-foreground/30" />
          </div>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up stagger-2 leading-relaxed">
            A design-focused development studio creating beautiful, 
            functional digital products for discerning businesses.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-3">
            <a href="#contact" className="btn-primary">
              Start a Project
            </a>
            <a href="#work" className="btn-secondary">
              View Our Work
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-24 animate-fade-up stagger-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Scroll
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-foreground/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
