import { Target, Lightbulb, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Target,
    title: "Define Your Goals",
    description: "We'll discuss your vision and objectives",
  },
  {
    icon: Lightbulb,
    title: "Explore Solutions",
    description: "Get tailored recommendations for your project",
  },
  {
    icon: Calendar,
    title: "Plan Your Workflow",
    description: "Understand timelines and pricing upfront",
  },
];

const ConsultationCTA = () => {
  return (
    <section className="py-20 bg-background" id="contact">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="section-label">Let's Talk</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Free 30-60 Minute Consultation
          </h2>
          <p className="text-muted-foreground text-lg">
            Book a free consultation to discuss your goals, explore pricing options, and map out your project workflow—no commitment required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display text-xl font-semibold mb-2">{step.title}</h4>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="btn-gold text-base">Schedule Your Free Consultation</Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
