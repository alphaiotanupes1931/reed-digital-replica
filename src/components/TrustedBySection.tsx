import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const clients = [
  { name: "USPS", display: "USPS" },
  { name: "American Airlines", display: "American Airlines" },
  { name: "Lincoln Financial", display: "Lincoln Financial" },
  { name: "Palantir", display: "Palantir" },
  { name: "MITRE", display: "MITRE" },
  { name: "University of Florida", display: "University of Florida" },
  { name: "Morgan State University", display: "Morgan State University" },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px border border-border bg-border max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex items-center justify-center p-6 md:p-8 bg-background group"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ backgroundColor: "hsl(var(--muted))" }}
            >
              <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                {client.display}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
