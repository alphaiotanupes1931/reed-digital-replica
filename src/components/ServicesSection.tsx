import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const services = [
  { title: "Websites", desc: "Beautiful, fast websites that help you get more customers" },
  { title: "Online Stores", desc: "Sell your products online with easy-to-use shopping sites" },
  { title: "Mobile Apps", desc: "Apps for iPhone and Android that your customers will love" },
  { title: "Booking Systems", desc: "Let customers schedule appointments online 24/7" },
  { title: "Business Software", desc: "Custom tools to help your team work smarter" },
  { title: "Website Updates", desc: "We keep your site running smooth and up-to-date" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden">
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      {/* Large background text */}
      <div className="bg-text right-0 top-1/2 -translate-y-1/2 text-right">
        SERVICES
      </div>
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            What We Do
          </motion.p>
          <motion.h2 
            className="text-2xl md:text-3xl font-medium text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Services
          </motion.h2>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex justify-between items-baseline py-5 border-b border-border hover:border-primary transition-colors duration-300">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium text-lg group-hover:text-primary transition-colors">
                    {service.title}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground hidden md:block group-hover:text-foreground transition-colors">
                  {service.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
