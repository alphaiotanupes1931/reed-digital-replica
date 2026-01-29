import { MessageSquare, Palette, Code, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Discovery",
    description: "We start with understanding your goals, audience, and vision. This shapes everything that follows.",
  },
  {
    icon: Palette,
    title: "Design",
    description: "We create wireframes and visual designs, iterating with your feedback until it's perfect.",
  },
  {
    icon: Code,
    title: "Development",
    description: "Our team builds your product with clean, scalable code using modern technologies.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "We deploy, test, and launch your product, then provide ongoing support and maintenance.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 md:py-32">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label mb-4">Process</p>
          <h2 className="text-display-sm md:text-display font-bold mb-6">
            How we work
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple, transparent process that keeps you informed every step of the way.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-border" />
              )}
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-foreground" />
                </div>
                <span className="text-sm font-mono text-muted-foreground mb-2 block">0{index + 1}</span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
