import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/B8jgJo4yrCk?autoplay=1&mute=1&loop=1&playlist=B8jgJo4yrCk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&vq=hd1080"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[200%] h-[200%] min-w-full min-h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-primary/5" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center py-24">
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Digital Agency
          </motion.p>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 min-h-[1.5em] tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {displayText}
            <span className="typing-cursor" />
          </motion.h1>

          <motion.p 
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Making digital dreams come true. We craft exceptional websites and applications for businesses that demand quality.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start Your Project
            </Link>
            <Link 
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 text-sm font-medium hover:bg-secondary transition-colors"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-px h-12 bg-foreground/30"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
