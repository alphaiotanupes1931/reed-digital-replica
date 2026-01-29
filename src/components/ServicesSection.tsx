import { Code, Palette, Globe, Smartphone, Cloud, Users } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Custom Development",
    description: "Bespoke web applications built with modern technologies and best practices.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Intuitive interfaces that balance aesthetics with exceptional user experience.",
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Scalable, performant solutions that grow with your business needs.",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform applications for iOS and Android devices.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "AWS and Azure infrastructure designed for reliability and scale.",
  },
  {
    icon: Users,
    title: "Digital Strategy",
    description: "Strategic consulting to align technology with your business objectives.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="section-label">Services</span>
          <h2 className="text-display-sm md:text-display font-serif mt-4 mb-6">
            What We Do
          </h2>
          <div className="flex justify-center mb-6">
            <div className="divider" />
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We offer comprehensive digital solutions, from initial concept 
            through to deployment and ongoing support.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-background p-10 md:p-12 group hover:bg-secondary/50 transition-colors duration-300"
            >
              <service.icon 
                className="w-6 h-6 text-foreground mb-6" 
                strokeWidth={1.5} 
              />
              <h3 className="text-lg font-medium mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
