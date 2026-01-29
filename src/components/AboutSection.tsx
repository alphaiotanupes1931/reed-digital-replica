const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="section-label">About</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4">
              Who We Are
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl leading-relaxed">
              Reed Digital Group is a boutique development studio 
              dedicated to crafting exceptional digital experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded with a commitment to quality over quantity, we partner 
              with select clients who value thoughtful design and meticulous 
              execution. Our team brings together expertise in development, 
              design, and strategy to deliver solutions that stand apart.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Based in Baltimore, Maryland, we serve small businesses, 
              mid-size companies, and government agencies nationwide.
            </p>
          </div>

          {/* Certifications */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <span className="text-xs text-muted-foreground tracking-widest">
              Small Business · SAM Registered · Federal Contractor Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
