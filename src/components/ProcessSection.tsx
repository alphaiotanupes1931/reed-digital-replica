const steps = [
  { label: "Discover", description: "Understanding your vision and requirements" },
  { label: "Design", description: "Creating intuitive interfaces and experiences" },
  { label: "Develop", description: "Building with modern technologies" },
  { label: "Deploy", description: "Launching and ongoing support" },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label">Process</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-6">
            How We Work
          </h2>
        </div>

        {/* Horizontal Process Line */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-3 h-px bg-border" />
            
            {steps.map((step, index) => (
              <div key={step.label} className="relative flex flex-col items-center group">
                {/* Dot */}
                <div className="w-6 h-6 rounded-full bg-background border-2 border-foreground z-10 group-hover:bg-foreground transition-colors" />
                
                {/* Label */}
                <span className="mt-4 text-sm font-medium">
                  {step.label}
                </span>
                
                {/* Description on hover */}
                <span className="mt-2 text-xs text-muted-foreground text-center max-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.description}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile: Vertical layout */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium block">
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
