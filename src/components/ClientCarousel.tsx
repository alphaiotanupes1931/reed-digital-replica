import { motion } from "framer-motion";

const techLogos = [
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "Next.js", logo: "https://cdn.worldvectorlogo.com/logos/next-js.svg" },
  { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
  { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { name: "Supabase", logo: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" },
  { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
];

const ClientLogo = ({ name, logo }: { name: string; logo: string }) => (
  <motion.div 
    className="flex items-center justify-center w-24 h-14 transition-all duration-300 group"
    title={name}
    whileHover={{ scale: 1.1, y: -4 }}
  >
    <img 
      src={logo} 
      alt={name}
      className="max-w-full max-h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
    />
  </motion.div>
);

const ClientCarousel = () => {
  return (
    <section className="py-12 overflow-hidden relative">
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-scroll-left items-center group-hover:[animation-play-state:paused]">
          {techLogos.map((item, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 px-8 md:px-12">
              <ClientLogo name={item.name} logo={item.logo} />
            </div>
          ))}
          {techLogos.map((item, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 px-8 md:px-12">
              <ClientLogo name={item.name} logo={item.logo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
