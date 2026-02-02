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
      className="py-4 bg-primary text-primary-foreground overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      <div className="container">
        <div className="flex items-center justify-center text-center min-h-[24px]">
          <p className="text-sm md:text-base font-mono">
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
