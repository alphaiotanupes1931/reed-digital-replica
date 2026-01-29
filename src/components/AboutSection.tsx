const featuredIn = [
  { name: "Baltimore Times", logo: "https://baltimoretimes-online.com/wp-content/uploads/2023/05/logo.jpeg" },
  { name: "Medium", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Medium_logo_Monogram.svg/1200px-Medium_logo_Monogram.svg.png" },
  { name: "MITRE", logo: "https://uploads.concordia.net/2019/09/16093101/MITREW.png" },
];

const awards = [
  {
    logo: "https://s202.q4cdn.com/986123435/files/doc_downloads/logos/american-airlines/THUMB-aa_aa__ahz_4cp_grd_pos-(1).png",
    position: "Winner",
    title: "Best Technical Solution",
    organization: "American Airlines",
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU70JY5Z6phZap7X_vTIMp-Egad29FbZ2JWQ&s",
    position: "2nd Place",
    title: "Lincoln Financial Hackathon",
    organization: "FinTech Innovation",
  },
  {
    logo: "https://mma.prnewswire.com/media/1088413/MSULN2Cfuture_Logo.jpg?p=facebook",
    position: "3rd Place",
    title: "Morgan State Hackathon",
    organization: "University Competition",
  },
  {
    logo: "https://images.squarespace-cdn.com/content/v1/60e4724ea746166606f95abb/f28c5930-9148-4833-8e72-647be9edde1a/gener8tor-secondary-fullcolor%402x.png",
    position: "2nd Place",
    title: "Gener8tor Hackathon",
    organization: "Startup Competition",
  },
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-background" id="about">
      <div className="container mx-auto px-6">
        {/* Description */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Reed Digital Group (RDG) helps businesses and entrepreneurs turn ideas into professional websites, apps, and digital brands. We handle the technology so you can focus on growing your business.
          </p>
        </div>

        {/* Featured In */}
        <div className="mb-20">
          <p className="section-label text-center mb-8">Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {featuredIn.map((item) => (
              <div key={item.name} className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src={item.logo} alt={item.name} className="h-12 md:h-16 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div>
          <p className="section-label text-center mb-8">Awards & Recognition</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img src={award.logo} alt={award.organization} className="w-12 h-12 object-contain" />
                </div>
                <span className="text-primary font-semibold text-sm">{award.position}</span>
                <h4 className="font-display text-lg font-semibold mt-2 mb-1">{award.title}</h4>
                <p className="text-sm text-muted-foreground">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
