import { ArrowUpRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies. Fast, responsive, and optimized for growth.",
    features: ["React & Next.js", "E-commerce", "CMS Integration", "API Development"],
  },
  {
    number: "02",
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications that deliver seamless experiences across all devices.",
    features: ["iOS & Android", "React Native", "App Store Launch", "Push Notifications"],
  },
  {
    number: "03",
    title: "UI/UX Design",
    description: "User-centered design that combines aesthetics with functionality. From concept to pixel-perfect delivery.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
  },
  {
    number: "04",
    title: "Branding",
    description: "Complete brand identity design that tells your story and connects with your audience.",
    features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Strategy"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <p className="section-label mb-4">Services</p>
          <h2 className="text-display-sm md:text-display font-bold mb-6">
            Everything you need to launch and grow
          </h2>
          <p className="text-lg text-muted-foreground">
            From initial concept to final deployment, we handle every aspect of your digital product.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.number}
              className="group card-hover p-8 md:p-10 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-sm font-mono text-muted-foreground">{service.number}</span>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
