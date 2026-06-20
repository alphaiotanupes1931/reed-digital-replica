import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import gener8torAsset from "@/assets/gener8tor.png.asset.json";

const clients = [
  {
    name: "USPS",
    display: "USPS",
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPxDMkxxxlnOX0IY7lMNZImKViQz2B34TO1Q&s",
  },
  {
    name: "American Airlines",
    display: "American Airlines",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/American_Airlines_wordmark_%282013%29.svg/500px-American_Airlines_wordmark_%282013%29.svg.png",
  },
  {
    name: "Lincoln Financial",
    display: "Lincoln Financial",
    logoUrl: "https://mms.businesswire.com/media/20240606449533/en/398522/22/LFG-B-HORZ_202_K.jpg",
  },
  {
    name: "Palantir",
    display: "Palantir",
    logoUrl: "https://www.hpcwire.com/bigdatawire/wp-content/uploads/sites/2/2021/05/Palantir.png",
  },
  {
    name: "MITRE",
    display: "MITRE",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mitre_Corporation_logo.svg/3840px-Mitre_Corporation_logo.svg.png",
  },
  {
    name: "University of Florida",
    display: "University of Florida",
    logoUrl: "https://static.studyusa.com/school/aws_D5Mhl-qAiYO-oOys2hJbtkfVGIITMoSV_lg_1x.png?format=webp",
  },
  {
    name: "Morgan State University",
    display: "Morgan State University",
    logoUrl: "https://www.thecollegetour.com/wp-content/uploads/2023/08/FINAL-MSU_Web-Digital.jpg",
  },
  {
    name: "Park at 14th",
    display: "Park at 14th",
    logoUrl: "https://park14.com/wp-content/uploads/2021/06/ParkLogo-White.png",
    invert: true,
  },
  {
    name: "gener8tor",
    display: "gener8tor",
    logoUrl: gener8torAsset.url,
  },
];

const LogoItem = ({ client }: { client: typeof clients[0] }) => (
  <div className="flex items-center justify-center px-8 md:px-14 h-14 md:h-16 group">
    {client.logoUrl ? (
      <img
        src={client.logoUrl}
        alt={client.name}
        className={`max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 ${
          client.invert
            ? "invert dark:invert-0"
            : "grayscale contrast-125 dark:invert"
        }`}
        loading="lazy"
      />
    ) : (
      <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug whitespace-nowrap">
        {client.display}
      </span>
    )}
  </div>
);

const TrustedBySection = () => {
  return (
    <section className="py-16 md:py-20 border-b border-border overflow-hidden">
      <div className="container">
        <ScrollReveal>
          <motion.p
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Companies We&apos;ve Done Work For
          </motion.p>
        </ScrollReveal>
      </div>

      <div className="relative mt-2">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-left items-center">
          {clients.map((client) => (
            <LogoItem key={`first-${client.name}`} client={client} />
          ))}
          {clients.map((client) => (
            <LogoItem key={`second-${client.name}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
