import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "./ParticleField";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 50,
          y: (e.clientY - rect.top - rect.height / 2) / 50,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Particle Background */}
      <ParticleField />
      
      {/* Gradient Orbs */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-[120px]"
        animate={{
          x: mousePosition.x * 10,
          y: mousePosition.y * 10,
        }}
        style={{ left: "10%", top: "20%" }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 blur-[100px]"
        animate={{
          x: mousePosition.x * -15,
          y: mousePosition.y * -15,
        }}
        style={{ right: "15%", bottom: "30%" }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
      />

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Glassmorphism Card */}
          <motion.div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 md:p-14 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * -0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
            }}
          >
            {/* Text Reveal Animation */}
            <div className="overflow-hidden mb-8">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-mono font-medium text-white min-h-[1.5em]"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {displayText.split("").map((char, index) => (
                    <motion.span
                      key={`${currentPhraseIndex}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.1 }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </AnimatePresence>
                <motion.span 
                  className="inline-block w-[3px] h-[0.9em] bg-white ml-1 align-baseline"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p 
              className="text-lg md:text-xl text-white/60 max-w-xl font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Making digital dreams come true.
            </motion.p>

            {/* Interactive CTA */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 text-sm font-mono rounded-lg hover:bg-white/10 hover:border-white/40 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-white/40 font-mono">Scroll</span>
        <motion.div
          className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-white/40 rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
