import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  scale?: boolean;
}

const ScrollReveal = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  scale = false
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directionVariants = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        scale: scale ? 0.9 : 1,
        ...directionVariants[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1,
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
