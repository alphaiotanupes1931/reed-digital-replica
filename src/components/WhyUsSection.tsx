import { Zap, DollarSign, MessageCircle, Shield, Wrench, Eye } from "lucide-react";

const benefits = [
  {
    number: "01",
    icon: Zap,
    title: "Lightning Fast Delivery",
    description: "We work efficiently without sacrificing quality. Your project gets done faster than the competition.",
  },
  {
    number: "02",
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Premium quality at competitive rates. Get more value for your investment compared to big agencies.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Constant Communication",
    description: "Stay in the loop at every step. We provide regular updates and are always available to answer questions.",
  },
  {
    number: "04",
    icon: Shield,
    title: "Satisfaction Guaranteed",
    description: "Not happy with the result? We offer refunds if you're not completely satisfied with our work.",
  },
  {
    number: "05",
    icon: Wrench,
    title: "Free Month of Maintenance",
    description: "Every project includes one month of free maintenance to ensure everything runs smoothly after launch.",
  },
  {
    number: "06",
    icon: Eye,
    title: "Full Transparency",
    description: "No hidden fees, no surprises. We keep you informed about costs, timelines, and progress throughout.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="section-label">Why Choose Us</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Why RDG?</h2>
          <p className="text-muted-foreground text-lg">
            We deliver exceptional value without the agency price tag. Here's what sets us apart from the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border group"
            >
              <span className="number-badge">{benefit.number}</span>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center my-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
