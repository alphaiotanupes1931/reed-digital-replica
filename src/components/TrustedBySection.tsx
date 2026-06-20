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
    logoUrl: "https://logos-world.net/wp-content/uploads/2020/11/American-Airlines-Logo.png",
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
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/UF_Monogram.svg",
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
  <div className="flex shrink-0 items-center justify-center w-40 md:w-48 h-20 md:h-24 group">
    {client.logoUrl ? (
      <div className="relative flex h-12 md:h-14 w-32 md:w-40 items-center justify-center">
        <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-semibold text-foreground tracking-[0.08em] text-center leading-snug uppercase">
          {client.display}
        </span>
        <img
          src={client.logoUrl}
          alt={client.name}
          className={`relative z-[1] max-h-full max-w-full object-contain transition-opacity duration-300 bg-background ${
            client.invert
              ? "invert dark:invert-0"
              : "dark:invert"
          }`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    ) : (
      <span className="text-[10px] md:text-xs font-semibold text-center text-foreground transition-colors leading-snug whitespace-nowrap uppercase tracking-[0.08em]">
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
