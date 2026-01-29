import ScrollReveal from "@/components/ScrollReveal";

const services = [
  { title: "Custom Development", desc: "Bespoke web applications" },
  { title: "UI/UX Design", desc: "Intuitive interfaces" },
  { title: "Web Applications", desc: "Scalable solutions" },
  { title: "Mobile Development", desc: "iOS & Android" },
  { title: "Cloud Solutions", desc: "AWS & Azure" },
  { title: "Digital Strategy", desc: "Strategic consulting" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-28 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase text-center mb-12">
            Services
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.05}>
              <div className="flex justify-between items-baseline py-4 border-b border-border">
                <span className="font-medium">{service.title}</span>
                <span className="text-sm text-muted-foreground">{service.desc}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
