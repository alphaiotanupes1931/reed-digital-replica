import TypedHeader from "@/components/TypedHeader";

const awards = [
  {
    place: "Winner",
    title: "Best Technical Solution",
    event: "American Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/American_Airlines_logo_2013.svg/200px-American_Airlines_logo_2013.svg.png",
  },
  {
    place: "2nd Place",
    title: "FinTech Innovation",
    event: "Lincoln Financial Hackathon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lincoln_National_Corporation_logo.svg/200px-Lincoln_National_Corporation_logo.svg.png",
  },
  {
    place: "3rd Place",
    title: "University Competition",
    event: "Morgan State Hackathon",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Morgan_State_University_seal.svg/150px-Morgan_State_University_seal.svg.png",
  },
  {
    place: "2nd Place",
    title: "Startup Competition",
    event: "Gener8tor Hackathon",
    logo: "https://images.squarespace-cdn.com/content/v1/5c0b6c409772ae65c636de41/1544196451714-1BXTJWBJ2LXFPZ9W2FT1/gener8tor-logo.png",
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
                <div className="h-12 flex items-center justify-center mb-4">
                  <img 
                    src={award.logo} 
                    alt={award.event}
                    className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
