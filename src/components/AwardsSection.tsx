import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";

const awards = [
  {
    place: "Winner",
    title: "Best Technical Solution",
    event: "American Airlines",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/American-Airliners-logo.jpg",
  },
  {
    place: "2nd Place",
    title: "FinTech Innovation",
    event: "Lincoln Financial Hackathon",
    logo: "https://mms.businesswire.com/media/20240916461328/en/2244030/5/Lincoln_Financial_brand_transition_video_Sept_2024.jpg",
  },
  {
    place: "3rd Place",
    title: "University Competition",
    event: "Morgan State Hackathon",
    logo: "https://www.gannett-cdn.com/content-pipeline-sports-images/sports2/cbk/logos/1513.png",
  },
  {
    place: "2nd Place",
    title: "Startup Competition",
    event: "Gener8tor Hackathon",
    logo: "https://images.squarespace-cdn.com/content/v1/60e4724ea746166606f95abb/f28c5930-9148-4833-8e72-647be9edde1a/gener8tor-secondary-fullcolor%402x.png",
  },
];

const AwardsSection = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-16">
          <span className="section-label font-mono">Recognition</span>
          <TypedHeader text="Awards & Achievements" className="mt-4" />
        </div>
      </ScrollReveal>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
        {awards.map((award, index) => (
          <ScrollReveal key={index} delay={index * 0.15}>
            <TiltCard>
              <div 
                className="text-center p-6 border border-border hover:border-foreground/20 transition-all hover:shadow-lg"
              >
                <div className="h-16 flex items-center justify-center mb-4 bg-white rounded p-2">
                  <img 
                    src={award.logo} 
                    alt={award.event}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  {award.place}
                </span>
                <h3 className="text-lg font-medium mt-3 mb-2">
                  {award.title}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {award.event}
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;