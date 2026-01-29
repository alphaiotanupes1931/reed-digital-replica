import founderImage from "@/assets/founder.png";

const FounderSection = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                Leadership
              </span>
              <h2 className="text-3xl md:text-4xl font-medium mt-2 mb-6">
                Meet the Founder
              </h2>
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
                className="w-64 h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
