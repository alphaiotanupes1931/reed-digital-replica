import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import senaPreview from "@/assets/sena-preview.jpg";
import floraPreview from "@/assets/flora-preview.jpg";

const concepts = [
  {
    title: "Sena Studio",
    category: "Design Studio",
    url: "https://senawastudio.com/",
    image: senaPreview,
  },
  {
    title: "Jeff Milanes",
    category: "Personal Portfolio",
    url: "https://www.jeffmilanes.com/",
  },
  {
    title: "Flora Wellness Cafe",
    category: "Cafe & Wellness",
    url: "https://www.florawellnesscafe.com/",
    image: floraPreview,
  },
  {
    title: "Crav Burgers",
    category: "Restaurant",
    url: "https://www.cravburgers.shop/",
  },
];

const ConceptPreview = ({ url, title, image }: { url: string; title: string; image?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">Loading preview...</span>
          </div>
        </div>
      )}
      {image ? (
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <iframe
          src={url}
          title={title}
          className={`pointer-events-none origin-top-left transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: "200%", height: "200%", transform: "scale(0.5)" }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIsLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors" />
    </div>
  );
};

const ConceptsSection = () => {
  return (
    <section id="concepts" className="py-24 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="section-label">Concepts</span>
            <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-4 tracking-tight">
              Design concepts we're exploring
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fresh ideas and layouts we're building — see what your site could look like.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {concepts.map((concept, index) => (
            <ScrollReveal key={concept.title} delay={index * 0.05}>
              <a
                href={concept.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="transition-transform duration-300 group-hover:scale-[1.01]">
                  <ConceptPreview url={concept.url} title={concept.title} image={(concept as any).image} />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">
                      {concept.category}
                    </span>
                    <h3 className="text-lg font-medium group-hover:text-muted-foreground transition-colors">
                      {concept.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptsSection;
