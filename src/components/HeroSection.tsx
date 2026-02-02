import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[177.78vh] min-w-full min-h-full aspect-video"
          style={{ height: 'max(100%, 56.25vw)' }}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video"
        />
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Large background text */}
      <div className="bg-text left-0 top-1/2 -translate-y-1/2">
        BUILD
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Glassmorphism backdrop */}
          <div className="backdrop-blur-sm bg-background/70 border border-border rounded-sm p-8 md:p-12">
            {/* Main Headline with Typing Animation */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 min-h-[1.5em] tracking-tight">
              {displayText}
              <span className="typing-cursor" />
            </h1>

            {/* Tagline */}
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              Making digital dreams come true.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-px h-12 bg-foreground/20"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
