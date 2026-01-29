import { Globe, Smartphone, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    number: "01",
    icon: Globe,
    title: "Custom Websites",
    description: "Scalable, performant websites built with modern technologies.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Mobile Applications",
    description: "Native and cross-platform apps for iOS and Android.",
  },
  {
    number: "03",
    icon: Palette,
    title: "Branding & Design",
    description: "Visual identities that resonate with your audience.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="services">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt="Services background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="section-label">What We Do</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Digital solutions<br />that scale
            </h2>
          </div>
          <Button variant="outline" className="btn-outline-dark mt-6 md:mt-0">
            View All Services
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.number}
              className="card-service group cursor-pointer"
            >
              <span className="number-badge">{service.number}</span>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center my-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
