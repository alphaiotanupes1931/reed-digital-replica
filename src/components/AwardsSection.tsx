import TypedHeader from "@/components/TypedHeader";

const awards = [
  {
    place: "Winner",
    title: "Best Technical Solution",
    event: "American Airlines",
  },
  {
    place: "2nd Place",
    title: "FinTech Innovation",
    event: "Lincoln Financial Hackathon",
  },
  {
    place: "3rd Place",
    title: "University Competition",
    event: "Morgan State Hackathon",
  },
  {
    place: "2nd Place",
    title: "Startup Competition",
    event: "Gener8tor Hackathon",
  },
];

const AwardsSection = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="section-label font-mono">Recognition</span>
            <TypedHeader text="Awards & Achievements" className="mt-4" />
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <div 
                key={index} 
                className="text-center p-6 border border-border hover:border-foreground/20 transition-colors"
              >
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
