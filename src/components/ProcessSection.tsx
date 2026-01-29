const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We begin with understanding your vision, goals, and requirements through in-depth consultation.",
  },
  {
    number: "02",
    title: "Strategy",
    description: "We develop a comprehensive plan that outlines the project scope, timeline, and technical approach.",
  },
  {
    number: "03",
    title: "Design",
    description: "Our designers create intuitive interfaces that reflect your brand and delight your users.",
  },
  {
    number: "04",
    title: "Development",
    description: "We build your solution using modern technologies and industry best practices.",
  },
  {
    number: "05",
    title: "Launch",
    description: "We deploy your project and provide ongoing support to ensure continued success.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="section-label">Process</span>
          <h2 className="text-display-sm md:text-display font-serif mt-4 mb-6">
            How We Work
          </h2>
          <div className="flex justify-center mb-6">
            <div className="divider" />
          </div>
          <p className="text-muted-foreground leading-relaxed">
            A structured approach that ensures clarity, efficiency, 
            and exceptional results.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="grid grid-cols-12 gap-6 md:gap-10 py-10 border-t border-border"
            >
              <div className="col-span-2 md:col-span-1">
                <span className="text-xs text-muted-foreground tracking-widest">
                  {step.number}
                </span>
              </div>
              <div className="col-span-10 md:col-span-3">
                <h3 className="text-lg font-medium">{step.title}</h3>
              </div>
              <div className="col-span-12 md:col-span-8 md:col-start-5">
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
