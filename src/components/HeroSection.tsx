import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const phrases = [
  "We build websites.",
  "We build applications.",
  "We build solutions.",
  "We build experiences.",
];

const portfolioSites = [
  "https://wrightshadecreations.com/",
  "https://oqpsolutions.com/",
  "https://www.theinternbyshilom.com/",
];

const HeroSection = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax transforms for each device
  const laptopX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const laptopY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);
  
  const phoneX = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const phoneY = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);
  
  const tabletX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const tabletY = useTransform(smoothMouseY, [-0.5, 0.5], [-25, 25]);

  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseTime = 2000;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

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
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
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
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Large background text */}
      <div className="bg-text left-0 top-1/2 -translate-y-1/2">
        BUILD
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="backdrop-blur-sm bg-background/50 border border-border rounded-sm p-8 md:p-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 min-h-[1.5em] tracking-tight">
                {displayText}
                <span className="typing-cursor" />
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-md mb-8">
                Making digital dreams come true.
              </p>

              <a 
                href="/contact"
                data-magnetic
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start Your Project
              </a>
            </div>
          </motion.div>

          {/* Right side - Floating Devices */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Laptop */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ x: laptopX, y: laptopY }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative">
                {/* Laptop frame */}
                <div className="w-80 bg-foreground rounded-t-lg p-1">
                  {/* Screen bezel */}
                  <div className="bg-secondary rounded-t-md overflow-hidden">
                    {/* Browser chrome */}
                    <div className="h-5 bg-muted flex items-center px-2 gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400/60" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60" />
                    </div>
                    {/* Website preview */}
                    <div className="h-44 overflow-hidden">
                      <iframe
                        src={portfolioSites[0]}
                        className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none"
                        title="Portfolio preview"
                      />
                    </div>
                  </div>
                </div>
                {/* Laptop base */}
                <div className="w-96 h-3 bg-foreground rounded-b-lg mx-auto -mt-px" />
                <div className="w-24 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-0.5" />
              </div>
            </motion.div>

            {/* Phone - Right */}
            <motion.div
              className="absolute top-1/4 right-0 z-30"
              style={{ x: phoneX, y: phoneY }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="relative">
                {/* Phone frame */}
                <div className="w-24 bg-foreground rounded-2xl p-1">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-foreground rounded-full z-10" />
                  {/* Screen */}
                  <div className="bg-secondary rounded-xl overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <iframe
                        src={portfolioSites[1]}
                        className="w-[500%] h-[500%] origin-top-left scale-[0.20] pointer-events-none"
                        title="Portfolio preview mobile"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tablet - Left */}
            <motion.div
              className="absolute bottom-10 left-0 z-10"
              style={{ x: tabletX, y: tabletY }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="relative transform -rotate-6">
                {/* Tablet frame */}
                <div className="w-40 bg-foreground rounded-xl p-1">
                  {/* Screen */}
                  <div className="bg-secondary rounded-lg overflow-hidden">
                    <div className="h-28 overflow-hidden">
                      <iframe
                        src={portfolioSites[2]}
                        className="w-[500%] h-[500%] origin-top-left scale-[0.20] pointer-events-none"
                        title="Portfolio preview tablet"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div 
              className="absolute top-10 left-20 w-3 h-3 rounded-full bg-primary/40"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-primary/30"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/3 right-10 w-4 h-4 border border-primary/20 rotate-45"
              animate={{ rotate: [45, 90, 45] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
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
