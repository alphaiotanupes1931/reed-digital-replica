const clients = [
  "Acme Corp",
  "TechStart Inc",
  "Nexus Group",
  "Elevate Co",
  "Horizon Partners",
  "Summit Digital",
  "Atlas Solutions",
  "Quantum Labs",
];

const ClientCarousel = () => {
  return (
    <section className="py-16 border-t border-border overflow-hidden">
      <div className="container mb-8">
        <p className="text-xs text-muted-foreground tracking-widest text-center">
          Trusted by businesses nationwide
        </p>
      </div>
      
      {/* Infinite scroll container */}
      <div className="relative">
        <div className="flex animate-scroll-left">
          {/* First set */}
          {clients.map((client, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 px-12 md:px-16"
            >
              <span className="text-lg md:text-xl font-medium text-muted-foreground/50 whitespace-nowrap">
                {client}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clients.map((client, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-12 md:px-16"
            >
              <span className="text-lg md:text-xl font-medium text-muted-foreground/50 whitespace-nowrap">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
