const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="section-label">About</span>
            <h2 className="text-display-sm md:text-display font-serif mt-4 mb-6">
              Who We Are
            </h2>
            <div className="flex justify-center">
              <div className="divider" />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="text-xl md:text-2xl font-serif leading-relaxed mb-6">
                Reed Digital Group is a boutique development studio 
                dedicated to crafting exceptional digital experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded with a commitment to quality over quantity, we partner 
                with select clients who value thoughtful design and meticulous 
                execution. Our team brings together expertise in development, 
                design, and strategy to deliver solutions that stand apart.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Based in Baltimore, Maryland, we serve clients nationwide 
                and are proud to support government and enterprise initiatives 
                as a certified small business.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-background p-8 text-center">
                  <div className="text-3xl md:text-4xl font-serif mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="border-t border-border pt-12 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Small Business · SAM Registered · Federal Contractor Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
