import ScrollReveal from "@/components/ScrollReveal";
import baltimoreTimesLogo from "@/assets/baltimore-times-logo.png";

const ARTICLE_URL = "https://baltimoretimes-online.com/latest-news/2023/04/28/morgan-state-university-students-take-home-prize-money-land-internships-after-hackathon/";

const AsSeenOnSection = () => {
  return (
    <section className="py-12 relative">
      <div className="section-line absolute top-0 left-0 right-0" />
      <div className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              As Seen On
            </p>
            <img
              src={baltimoreTimesLogo}
              alt="The Baltimore Times"
              className="h-10 md:h-12 object-contain opacity-80"
            />
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
