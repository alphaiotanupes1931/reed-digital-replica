import { Globe, Smartphone, Palette, Cloud, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "High-performance websites and web applications built with React, Next.js, and modern frameworks.",
    features: ["Custom CMS", "E-commerce", "API Integration"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS and Android that users love.",
    features: ["React Native", "Flutter", "App Store Ready"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that converts. From wireframes to pixel-perfect interfaces.",
    features: ["Figma Design", "Prototyping", "Design Systems"],
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure on AWS, Azure, or GCP. Built for growth.",
    features: ["AWS", "Serverless", "DevOps"],
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "Enterprise-grade security practices and compliance-ready implementations.",
    features: ["HIPAA Ready", "SOC 2", "Penetration Testing"],
  },
  {
    icon: Zap,
    title: "AI Integration",
    description: "Integrate cutting-edge AI capabilities into your products and workflows.",
    features: ["OpenAI", "Custom ML", "Automation"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="section-label">What We Do</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            End-to-end digital <span className="text-gradient">solutions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From concept to deployment, we handle every aspect of your digital product with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-dark p-8 group cursor-pointer relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-3 flex items-center gap-2">
                  {service.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </h3>
                
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
