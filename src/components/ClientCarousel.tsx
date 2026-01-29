const clients = [
  { name: "Acme Corp", initials: "AC" },
  { name: "TechStart Inc", initials: "TS" },
  { name: "Nexus Group", initials: "NG" },
  { name: "Elevate Co", initials: "EC" },
  { name: "Horizon Partners", initials: "HP" },
  { name: "Summit Digital", initials: "SD" },
  { name: "Atlas Solutions", initials: "AS" },
  { name: "Quantum Labs", initials: "QL" },
];

const LogoPlaceholder = ({ initials, name }: { initials: string; name: string }) => (
  <div 
    className="flex items-center justify-center w-24 h-12 border border-border bg-background"
    title={name}
  >
    <span className="text-sm font-mono font-medium text-muted-foreground">
      {initials}
    </span>
  </div>
);

const ClientCarousel = () => {
  return (
    <section className="py-16 border-t border-border overflow-hidden">
      <div className="container mb-8">
        <p className="text-xs text-muted-foreground tracking-widest text-center font-mono">
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
              className="flex-shrink-0 px-8 md:px-12"
            >
              <LogoPlaceholder initials={client.initials} name={client.name} />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clients.map((client, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <LogoPlaceholder initials={client.initials} name={client.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
