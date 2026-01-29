import { Button } from "@/components/ui/button";

const FounderSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-purple-medium/20 rounded-3xl blur-xl"></div>
              <img
                src="https://i.ibb.co/Qv96bJB3/IMG-9075.jpg"
                alt="Terell Reed - Founder & CEO"
                className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="section-label">Meet The Founder</p>
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-2">Terell Reed</h3>
            <p className="text-primary font-medium mb-6">Founder & CEO</p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With a passion for innovation and a commitment to excellence, Terell founded Reed Digital Group to help businesses and creators bring their digital visions to life. His hands-on approach and dedication to client success drive every project we undertake.
            </p>
            <Button variant="outline" className="btn-outline-dark">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
