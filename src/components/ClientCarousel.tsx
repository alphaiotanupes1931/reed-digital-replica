import { motion } from "framer-motion";

const techLogos = [
  // Tech & Tools
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "Next.js", logo: "https://cdn.worldvectorlogo.com/logos/next-js.svg" },
  { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
  { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  // Platforms & Partners
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { name: "Supabase", logo: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" },
  { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
];

const ClientLogo = ({ name, logo, index }: { name: string; logo: string; index: number }) => (
  <motion.div 
    className="flex items-center justify-center w-24 h-16 transition-all duration-500 group cursor-pointer relative"
    title={name}
    whileHover={{ scale: 1.15, y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {/* Glow effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-accent/0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
    <img 
      src={logo} 
      alt={name}
      className="max-w-full max-h-full object-contain transition-all duration-500 relative z-10 drop-shadow-lg group-hover:drop-shadow-2xl"
    />
  </motion.div>
);

const ClientCarousel = () => {
  return (
    <section className="py-16 overflow-hidden relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
      
      {/* Infinite scroll container */}
      <div className="relative group">
        {/* Fade edges with gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-scroll-left items-center group-hover:[animation-play-state:paused]">
          {/* First set */}
          {techLogos.map((item, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <ClientLogo name={item.name} logo={item.logo} index={index} />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {techLogos.map((item, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <ClientLogo name={item.name} logo={item.logo} index={index + techLogos.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
