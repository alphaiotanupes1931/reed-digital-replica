import { useEffect, useState, useRef } from "react";

interface TypedHeaderProps {
  text: string;
  className?: string;
}

const TypedHeader = ({ text, className = "" }: TypedHeaderProps) => {
  const [displayText, setDisplayText] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTyped) {
          setHasTyped(true);
          let i = 0;
          const interval = setInterval(() => {
            if (i <= text.length) {
              setDisplayText(text.slice(0, i));
              i++;
            } else {
              clearInterval(interval);
            }
          }, 60);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text, hasTyped]);

  return (
    <h2 
      ref={ref} 
      className={`text-3xl md:text-4xl font-mono font-medium min-h-[1.2em] ${className}`}
    >
      {displayText}
      <span className="typing-cursor" />
    </h2>
  );
};

export default TypedHeader;
