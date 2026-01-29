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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/B8jgJo4yrCk?autoplay=1&mute=1&loop=1&playlist=B8jgJo4yrCk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&vq=hd1080"
          className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] md:w-[120vw] md:h-[120vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none object-cover"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video"
        />
        {/* Lighter tint overlay */}
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Glassmorphism backdrop */}
          <div className="backdrop-blur-md bg-background/30 border border-white/10 rounded-lg p-8 md:p-12">
            {/* Main Headline with Typing Animation */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-medium mb-8 animate-fade-up min-h-[1.5em]">
              {displayText}
              <span className="typing-cursor" />
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up stagger-1 font-mono">
              Making digital dreams come true.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
