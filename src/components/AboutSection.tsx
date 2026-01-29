import TypedHeader from "@/components/TypedHeader";
import rdgLogo from "@/assets/rdg-logo.png";
import founderImage from "@/assets/founder.png";

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
          <div className="space-y-6 text-center mb-16">
            <p className="text-lg md:text-xl leading-relaxed">
              Reed Digital Group (RDG) helps businesses and entrepreneurs turn ideas 
              into professional websites, apps, and digital brands.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We handle the technology so you can focus on growing your business.
            </p>
          </div>

          {/* Founder Section */}
          <div className="border-t border-border pt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  Founder
                </span>
                <h3 className="text-2xl font-medium mt-2 mb-4">
                  Meet the Founder
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  With a passion for technology and a commitment to excellence, 
                  our founder leads Reed Digital Group with a vision to make 
                  professional digital solutions accessible to businesses of all sizes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Award-winning developer with experience across fintech, enterprise, 
                  and startup environments.
                </p>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <img 
                  src={founderImage} 
                  alt="Founder of Reed Digital Group" 
                  className="w-64 h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
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
