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
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-0 min-h-screen items-center -mx-6 lg:-mx-0">
          
          {/* Left Side - Typography & CTA */}
          <motion.div 
            className="flex flex-col justify-center px-6 lg:px-12 py-24 lg:py-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p 
              className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Digital Agency
            </motion.p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 min-h-[1.5em] tracking-tight leading-tight">
              {displayText}
              <span className="typing-cursor" />
            </h1>

            <motion.p 
              className="text-lg text-muted-foreground max-w-md mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Making digital dreams come true. We craft exceptional websites and applications for businesses that demand quality.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a 
                href="/contact"
                data-magnetic
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start Your Project
              </a>
              <a 
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 text-sm font-medium hover:bg-secondary transition-colors"
              >
                View Our Work
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex gap-12 mt-16 pt-8 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>
                <div className="text-3xl font-medium text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-primary">5★</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Video/Mockup */}
          <motion.div 
            className="relative h-full min-h-[400px] lg:min-h-screen"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
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
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 bg-primary/10" />
            </div>

            {/* Floating Browser Mockup */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-lg"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-2xl border border-border overflow-hidden">
                {/* Browser Chrome */}
                <div className="h-10 bg-secondary flex items-center px-4 gap-2 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground">
                      yourwebsite.com
                    </div>
                  </div>
                </div>
                
                {/* Website Preview */}
                <div className="aspect-[4/3] overflow-hidden">
                  <iframe
                    src="https://wrightshadecreations.com/"
                    className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                    title="Portfolio preview"
                  />
                </div>
              </div>

              {/* Shadow/Glow Effect */}
              <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-3xl" />
            </motion.div>

            {/* Decorative Elements */}
            <motion.div 
              className="absolute top-20 right-10 w-20 h-20 border border-primary/20 rounded-lg"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-32 left-10 w-4 h-4 bg-primary/40 rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/3 left-20 w-2 h-2 bg-primary/30 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-8 lg:left-1/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-3">
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
