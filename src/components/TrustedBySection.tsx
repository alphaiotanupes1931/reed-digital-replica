import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import gener8torAsset from "@/assets/gener8tor.png.asset.json";

const clients = [
  {
    name: "USPS",
    display: "USPS",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/United_States_Postal_Service_Logo.svg/512px-United_States_Postal_Service_Logo.svg.png",
  },
  {
    name: "American Airlines",
    display: "American Airlines",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/American_Airlines_logo_2013.svg/512px-American_Airlines_logo_2013.svg.png",
  },
  {
    name: "Lincoln Financial",
    display: "Lincoln Financial",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lincoln_Financial_Group_logo.svg/512px-Lincoln_Financial_Group_logo.svg.png",
  },
  {
    name: "Palantir",
    display: "Palantir",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Palantir_Technologies_logo.svg/512px-Palantir_Technologies_logo.svg.png",
  },
  {
    name: "MITRE",
    display: "MITRE",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mitre_Corporation_logo.svg/512px-Mitre_Corporation_logo.svg.png",
  },
  {
    name: "University of Florida",
    display: "University of Florida",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/University_of_Florida_logo.svg/512px-University_of_Florida_logo.svg.png",
  },
  {
    name: "Morgan State University",
    display: "Morgan State University",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Morgan_State_University_seal.svg/512px-Morgan_State_University_seal.svg.png",
  },
  {
    name: "Park at 14th",
    display: "Park at 14th",
    logoUrl: "https://park14.com/wp-content/uploads/2021/06/ParkLogo-White.png",
    invert: true,
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
