const services = [
  {
    title: "Custom Development",
    description: "Bespoke web applications built with modern technologies and best practices.",
  },
  {
    title: "UI/UX Design",
    description: "Intuitive interfaces that balance aesthetics with exceptional user experience.",
  },
  {
    title: "Web Applications",
    description: "Scalable, performant solutions that grow with your business needs.",
  },
  {
    title: "Mobile Development",
    description: "Native and cross-platform applications for iOS and Android devices.",
  },
  {
    title: "Cloud Solutions",
    description: "AWS and Azure infrastructure designed for reliability and scale.",
  },
  {
    title: "Digital Strategy",
    description: "Strategic consulting to align technology with your business objectives.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label">Services</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-6">
            What We Do
          </h2>
        </div>

        {/* Services - 2 column layout */}
        <div className="max-w-3xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="group grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 py-6 border-b border-border cursor-default"
            >
              <h3 className="text-lg font-medium group-hover:text-muted-foreground transition-colors">
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
