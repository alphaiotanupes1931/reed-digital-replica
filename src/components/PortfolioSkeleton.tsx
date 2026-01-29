import { useState } from "react";

interface PortfolioSkeletonProps {
  src: string;
  title: string;
  children?: React.ReactNode;
}

const PortfolioSkeleton = ({ src, title, children }: PortfolioSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-video mb-4 border border-border overflow-hidden bg-muted rounded-sm">
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground font-mono">Loading preview...</span>
          </div>
        </div>
      )}
      
      {/* Iframe */}
      <iframe
        src={src}
        title={title}
        className={`w-full h-full pointer-events-none scale-[0.5] origin-top-left transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: '200%', height: '200%' }}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Hover overlay */}
      {children}
    </div>
  );
};

export default PortfolioSkeleton;
