import { useEffect, useState, useCallback } from "react";

const phrases = [
  "We build websites.",
  "We build applications.",
  "We build solutions.",
  "We build experiences.",
];

const HeroSection = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseTime = 2000;

  const animateText = useCallback(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
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
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [displayText, isDeleting, currentPhraseIndex]);

  useEffect(() => {
    animateText();
  }, [animateText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline with Typing Animation */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-medium mb-8 animate-fade-up min-h-[1.5em]">
            {displayText}
            <span className="typing-cursor" />
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-16 animate-fade-up stagger-1">
            Digital solutions for businesses that demand quality.
          </p>

          {/* Scroll indicator */}
          <div className="animate-fade-up stagger-2">
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-muted-foreground tracking-widest">
                Scroll
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-border to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
