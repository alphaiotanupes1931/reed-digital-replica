import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [magnetTarget, setMagnetTarget] = useState<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(!!isClickable);

      // Magnetic effect for buttons
      const magneticEl = target.closest('[data-magnetic]') || 
                         (isClickable ? target.closest('a, button') : null);
      
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMagnetTarget({ x: centerX, y: centerY });
      } else {
        setMagnetTarget(null);
      }
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

  // Smooth animation loop with magnetic pull
  useEffect(() => {
    const animate = () => {
      setPosition(prev => {
        let targetX = targetPosition.x;
        let targetY = targetPosition.y;

        // Apply magnetic pull
        if (magnetTarget) {
          const pullStrength = 0.3;
          targetX = targetPosition.x + (magnetTarget.x - targetPosition.x) * pullStrength;
          targetY = targetPosition.y + (magnetTarget.y - targetPosition.y) * pullStrength;
        }

        const ease = 0.15;
        return {
          x: prev.x + (targetX - prev.x) * ease,
          y: prev.y + (targetY - prev.y) * ease,
        };
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetPosition, magnetTarget]);

  if (isHidden) return null;

  return (
    <>
      {/* Main cursor */}
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
          className={`transition-transform duration-150 ${isPointer ? 'scale-90' : ''}`}
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

      {/* Trailing circle */}
      <div
        className={`fixed pointer-events-none z-[9998] rounded-full border-2 transition-all duration-300 ${
          isPointer ? 'w-12 h-12 border-primary/50' : 'w-8 h-8 border-primary/30'
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

export default CustomCursor;
