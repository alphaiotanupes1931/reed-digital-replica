import { Check, Zap, Shield, Clock, Users, Award } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Most projects launch in 2-4 weeks, not months.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Not satisfied? Get a full refund. Simple.",
  },
  {
    icon: Clock,
    title: "Free Maintenance",
    description: "30 days of free support after launch.",
  },
  {
    icon: Users,
    title: "Direct Communication",
    description: "Talk to developers, not account managers.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized at American Airlines & more.",
  },
];

const processSteps = [
  { step: "01", title: "Discovery", description: "We understand your vision, goals, and requirements." },
  { step: "02", title: "Design", description: "We create wireframes and visual designs for approval." },
  { step: "03", title: "Develop", description: "We build your product with clean, scalable code." },
  { step: "04", title: "Deploy", description: "We launch and provide ongoing support." },
];

const WhyUsSection = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Why Choose Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <div>
            <p className="section-label">Why Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Results without the <span className="text-gradient">agency overhead</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're a lean team that moves fast. No bureaucracy, no inflated timelines, 
              no surprise costs. Just quality work delivered on time.
            </p>
            
            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold mb-1">{reason.title}</h4>
                    <p className="text-sm text-muted-foreground">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative">
            <div className="card-dark p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 rounded-xl bg-secondary/50">
                  <p className="font-display text-4xl font-bold text-gradient">50+</p>
                  <p className="text-sm text-muted-foreground mt-1">Projects Completed</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-secondary/50">
                  <p className="font-display text-4xl font-bold text-gradient">100%</p>
                  <p className="text-sm text-muted-foreground mt-1">Client Satisfaction</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-secondary/50">
                  <p className="font-display text-4xl font-bold text-gradient">5.0</p>
                  <p className="text-sm text-muted-foreground mt-1">Google Rating</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-secondary/50">
                  <p className="font-display text-4xl font-bold text-gradient">4</p>
                  <p className="text-sm text-muted-foreground mt-1">Hackathon Wins</p>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>

        {/* Process */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="section-label">Our Process</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Simple. <span className="text-gradient">Transparent.</span> Effective.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card-dark p-8 h-full">
                  <span className="font-display text-5xl font-bold text-muted/30">{step.step}</span>
                  <h3 className="font-display text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
