import TypedHeader from "@/components/TypedHeader";
import rdgLogo from "@/assets/rdg-logo.png";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="text-center mb-12">
            <img 
              src={rdgLogo} 
              alt="Reed Digital Group" 
              className="h-32 md:h-40 mx-auto mb-8"
            />
            <span className="section-label font-mono">About</span>
            <TypedHeader text="Who We Are" className="mt-4" />
          </div>

          {/* Content */}
          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl leading-relaxed">
              Reed Digital Group (RDG) helps businesses and entrepreneurs turn ideas 
              into professional websites, apps, and digital brands.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We handle the technology so you can focus on growing your business.
            </p>
          </div>

          {/* Certifications */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <span className="text-xs text-muted-foreground tracking-widest font-mono">
              Small Business · SAM Registered · Federal Contractor Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
