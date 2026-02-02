import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import oqpLogo from "@/assets/clients/oqp-solutions.png";
import elegantEpoxyLogo from "@/assets/clients/elegant-epoxy.png";

const clients = [
  { 
    name: "Prince George's County", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Seal_of_Prince_George%27s_County%2C_Maryland.svg/200px-Seal_of_Prince_George%27s_County%2C_Maryland.svg.png"
  },
  { 
    name: "BGE", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Baltimore_Gas_and_Electric_Company_logo.svg/320px-Baltimore_Gas_and_Electric_Company_logo.svg.png"
  },
  { 
    name: "Hilton", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hilton_Hotels_%26_Resorts_logo.svg/320px-Hilton_Hotels_%26_Resorts_logo.svg.png"
  },
  { 
    name: "State Farm", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/State_Farm_logo.svg/320px-State_Farm_logo.svg.png"
  },
  { 
    name: "Kaiser Permanente", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Kaiser_Permanente_logo.svg/320px-Kaiser_Permanente_logo.svg.png"
  },
  { 
    name: "Morgan State University", 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Morgan_State_University_seal.svg/200px-Morgan_State_University_seal.svg.png"
  },
  { 
    name: "OQP Solutions", 
    logo: oqpLogo
  },
  { 
    name: "Elegant Epoxy", 
    logo: elegantEpoxyLogo
  },
];

const ClientLogosSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      {/* Large background text */}
      <div className="bg-text left-0 top-1/2 -translate-y-1/2">
        CLIENTS
      </div>
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Trusted By
          </motion.p>
          <motion.h2 
            className="text-2xl md:text-3xl font-medium text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Our Clients
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center max-w-lg mx-auto mb-14"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            We've had the privilege of working with organizations of all sizes, 
            from startups to government agencies.
          </motion.p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex items-center justify-center p-6 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <img 
                src={client.logo} 
                alt={client.name}
                className="max-h-16 md:max-h-20 w-auto object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 grayscale group-hover:grayscale-0"
                title={client.name}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
