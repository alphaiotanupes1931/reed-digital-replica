import { useState } from "react";
import { 
  Sparkles, 
  MousePointer2, 
  BarChart3, 
  Lock, 
  Smartphone, 
  Zap,
  Palette,
  Globe,
  Database,
  Bot,
  CreditCard,
  Mail
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Micro-Interactions",
    description: "Subtle animations that delight users and provide feedback.",
    demo: "hover",
  },
  {
    icon: MousePointer2,
    title: "Smooth Scrolling",
    description: "Buttery-smooth scroll experiences with parallax effects.",
    demo: "scroll",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time data visualization and business intelligence.",
    demo: "chart",
  },
  {
    icon: Lock,
    title: "Authentication",
    description: "Secure login with OAuth, MFA, and session management.",
    demo: "auth",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Pixel-perfect layouts that work on every device.",
    demo: "responsive",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Blazing fast load times with optimized assets.",
    demo: "speed",
  },
  {
    icon: Palette,
    title: "Dark Mode",
    description: "Beautiful themes with automatic system detection.",
    demo: "theme",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Search engine friendly with structured data.",
    demo: "seo",
  },
  {
    icon: Database,
    title: "Real-time Data",
    description: "Live updates with WebSocket connections.",
    demo: "realtime",
  },
  {
    icon: Bot,
    title: "AI Integration",
    description: "ChatGPT, Claude, and custom AI solutions.",
    demo: "ai",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Stripe, PayPal, and subscription billing.",
    demo: "payment",
  },
  {
    icon: Mail,
    title: "Notifications",
    description: "Email, SMS, and push notification systems.",
    demo: "notification",
  },
];

const FeaturesShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="section-label">Capabilities</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Features we can <span className="text-gradient">build</span> for you
          </h2>
          <p className="text-muted-foreground text-lg">
            From simple animations to complex integrations, we deliver modern features that users expect.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 group ${
                activeFeature === index
                  ? "bg-primary text-primary-foreground"
                  : "card-dark hover:border-primary/50"
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <feature.icon 
                className={`w-8 h-8 mb-4 transition-colors ${
                  activeFeature === index ? "text-primary-foreground" : "text-primary"
                }`} 
              />
              <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
              <p className={`text-sm transition-colors ${
                activeFeature === index ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live Demo Area */}
        <div className="mt-16 card-dark p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary">Live Preview</span>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 animate-float">
                {(() => {
                  const Icon = features[activeFeature].icon;
                  return <Icon className="w-10 h-10 text-primary" />;
                })()}
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{features[activeFeature].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
