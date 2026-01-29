import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import MagneticButton from "@/components/MagneticButton";

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
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="section-label font-mono">Services</span>
            <TypedHeader text="What We Do" className="mt-4 mb-6" />
          </div>
        </ScrollReveal>

        {/* Services - 2 column layout */}
        <div className="max-w-3xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <MagneticButton className="w-full" strength={0.15}>
                <div
                  className="group grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 py-6 border-b border-border cursor-default hover:bg-muted/20 transition-colors px-4 -mx-4"
                >
                  <h3 className="text-lg font-medium group-hover:text-muted-foreground transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </MagneticButton>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
