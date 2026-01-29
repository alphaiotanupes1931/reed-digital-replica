const clients = [
  { name: "Wright Shade Creations", logo: "https://images.squarespace-cdn.com/content/v1/5f8b7e7e7f8b7e7e7f8b7e7e/1602876234567/wright-shade-logo.png" },
  { name: "OQP Solutions", logo: "https://oqpsolutions.com/wp-content/uploads/2023/01/oqp-logo.png" },
  { name: "AIN UPES 1931", logo: "https://ainupes1931.com/wp-content/uploads/2023/logo.png" },
  { name: "The Intern by Shilom", logo: "https://www.theinternbyshilom.com/logo.png" },
  { name: "VisionHeartz", logo: "https://visionheartz.github.io/logo.png" },
  { name: "Call Us First", logo: "https://callusfirst.world/logo.png" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png" },
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { name: "Supabase", logo: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" },
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/200px-Shopify_logo_2018.svg.png" },
  { name: "Square", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Square%2C_Inc._-_Square_logo.svg/200px-Square%2C_Inc._-_Square_logo.svg.png" },
];

const ClientLogo = ({ name, logo }: { name: string; logo: string }) => (
  <div 
    className="flex items-center justify-center w-28 h-14 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110 cursor-pointer"
    title={name}
  >
    <img 
      src={logo} 
      alt={name}
      className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
      onError={(e) => {
        // Fallback to text if logo fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement!.innerHTML = `<span class="text-sm font-medium text-muted-foreground">${name}</span>`;
      }}
    />
  </div>
);

const ClientCarousel = () => {
  return (
    <section className="py-16 border-t border-border overflow-hidden">
      <div className="container mb-8">
        <p className="text-xs text-muted-foreground tracking-widest text-center font-mono uppercase">
          Tools & Partners We Work With
        </p>
      </div>
      
      {/* Infinite scroll container */}
      <div className="relative group">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-scroll-left items-center group-hover:[animation-play-state:paused]">
          {/* First set */}
          {clients.map((client, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <ClientLogo name={client.name} logo={client.logo} />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clients.map((client, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <ClientLogo name={client.name} logo={client.logo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;