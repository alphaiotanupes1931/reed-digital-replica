import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-20 hero-gradient">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          Ready to bring your <span className="text-gradient-gold">vision</span> to life?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Book a free consultation and let's discuss how we can help transform your ideas into reality.
        </p>
        <Button className="btn-gold text-lg">Get Started Today</Button>
      </div>
    </section>
  );
};

export default FinalCTA;
