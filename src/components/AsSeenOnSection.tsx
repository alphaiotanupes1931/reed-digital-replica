import ScrollReveal from "@/components/ScrollReveal";
import baltimoreTimesLogo from "@/assets/baltimore-times-logo.png";

const ARTICLE_URL = "https://baltimoretimes-online.com/latest-news/2023/04/28/morgan-state-university-students-take-home-prize-money-land-internships-after-hackathon/";

const features = [
  {
    name: "The Baltimore Times",
    logo: baltimoreTimesLogo,
    isLocal: true,
    invert: true,
    url: ARTICLE_URL,
  },
  {
    name: "Medium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Medium_%28website%29_logo.svg",
    isLocal: false,
    invert: false,
    url: null,
  },
  {
    name: "MITRE",
    logo: "https://www.mitre.org/themes/mitre/img/MITRE-logo_Blue.png",
    isLocal: false,
    invert: false,
    url: null,
  },
];

const AsSeenOnSection = () => {
  return (
    <section className="py-12 relative bg-background">
      <div className="section-line absolute top-0 left-0 right-0" />
      <div className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              As Seen On
            </p>
            <div className="flex items-center gap-10 md:gap-16 flex-wrap justify-center">
              {features.map((item) => (
                <img
                  key={item.name}
                  src={item.logo}
                  alt={item.name}
                  className={`h-8 md:h-10 object-contain opacity-80 ${item.invert ? "invert" : ""}`}
                  loading="lazy"
                />
              ))}
            </div>
            <a
              href={ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Click here to view article →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AsSeenOnSection;
