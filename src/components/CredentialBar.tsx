import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CredentialBar = () => {
  const fullText = "Choose a team that's won 4+ hackathons. Not rookies.";
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsTyping(true);
    }, 1500);

    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [isTyping]);

  return (
    <motion.div 
      className="relative py-20 md:py-28 border-y border-border overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      {/* Background images */}
      <div className="absolute inset-0 grid grid-cols-2">
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.sanity.io/images/5a711ubd/production/ff089a922705d67d382ee65cb68b5f2312edad00-3200x1800.jpg?w=1920')",
          }}
        />
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://framerusercontent.com/images/Ye1B4wvb8jENZTb6yccpjYGSbDk.png?width=1364&height=820')",
          }}
        />
      </div>

      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-background/85" />

      {/* Content */}
      <div className="relative z-10 container">
        <div className="flex items-center justify-center text-center">
          <p className="text-lg md:text-2xl font-mono font-bold text-foreground tracking-tight">
            {displayText}
            {isTyping && displayText.length < fullText.length && (
              <span className="animate-pulse">|</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CredentialBar;
