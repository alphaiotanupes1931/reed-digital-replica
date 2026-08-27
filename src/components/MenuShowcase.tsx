import ScrollReveal from "@/components/ScrollReveal";
import menuInside from "@/assets/auntie-sams-menu-inside.png.asset.json";
import menuOutside from "@/assets/auntie-sams-menu-outside.png.asset.json";

const panels = [
  {
    src: menuOutside.url,
    alt: "Auntie Sam's Seafood trifold menu — outside panels with logo, hours, contact info and QR code",
    label: "Trifold · Outside",
  },
  {
    src: menuInside.url,
    alt: "Auntie Sam's Seafood trifold menu — inside panels with starters, sandwiches, entrees, sides and boil bags",
    label: "Trifold · Inside",
  },
];

const MenuShowcase = () => {
  return (
    <section id="menus" className="border-t border-border py-16 md:py-20">
      <ScrollReveal>
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Menu Design
        </p>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">
          Real menus we designed and printed
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10">
          Trifold takeout menu for Auntie Sam's Seafood in Clinton, MD — print-ready
          layout, food photography placement, and a scannable QR menu that links back
          to their site.
        </p>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-2">
        {panels.map((panel) => (
          <figure key={panel.label} className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <img
                src={panel.src}
                alt={panel.alt}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
            <figcaption className="text-xs uppercase tracking-widest text-muted-foreground">
              {panel.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default MenuShowcase;
