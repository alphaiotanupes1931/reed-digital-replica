import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      // Direct position update - no lag
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(!!isClickable);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (isHidden) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-2px, -2px)',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-transform duration-100 ${isPointer ? 'scale-90' : ''}`}
      >
        {isPointer ? (
          <g>
            <path
              d="M10 2L10 12L13 9L15 15L17 14L15 8L19 8L10 2Z"
              fill="hsl(220, 70%, 45%)"
              stroke="white"
              strokeWidth="1.5"
            />
          </g>
        ) : (
          <g>
            <path
              d="M2 2L2 18L6 14L9 20L11 19L8 13L13 13L2 2Z"
              fill="hsl(220, 70%, 45%)"
              stroke="white"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CustomCursor;
