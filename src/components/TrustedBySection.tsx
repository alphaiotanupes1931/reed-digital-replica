import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

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

const TrustedBySection = () => {
  return (
    <section className="py-16 md:py-20 border-b border-border">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px border border-border bg-border max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex items-center justify-center p-6 md:p-8 bg-background group"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              {client.logoUrl ? (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className={`max-w-full max-h-10 object-contain opacity-70 group-hover:opacity-100 transition-opacity ${
                    client.invert
                      ? "dark:invert-0 invert"
                      : "grayscale contrast-125 dark:invert"
                  }`}
                  loading="lazy"
                />
              ) : (
                <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                  {client.display}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
