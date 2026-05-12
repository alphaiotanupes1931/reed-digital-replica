import TypedHeader from "@/components/TypedHeader";
import rdgLogo from "@/assets/rdg-logo.png";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="text-center mb-12">
            <img 
              src={rdgLogo} 
              alt="Reed Digital Group" 
              className="h-32 md:h-40 mx-auto mb-8"
            />
            <span className="section-label font-mono">About</span>
            <TypedHeader text="Who We Are" className="mt-4" />
          </div>

          {/* Content */}
          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl leading-relaxed">
              Reed Digital Group (RDG) helps businesses and entrepreneurs turn ideas 
              into professional websites, apps, and digital brands.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We handle the technology so you can focus on growing your business.
            </p>
          </div>

          {/* Founder live preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-xs text-muted-foreground tracking-widest font-mono uppercase">
                Meet the Founder
              </span>
            </div>
            <a
              href="https://terellreed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative w-full aspect-[16/10] bg-muted rounded-sm overflow-hidden border border-border transform group-hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 left-0 right-0 h-6 bg-secondary/80 backdrop-blur-sm flex items-center px-2 gap-1.5 z-10">
                  <div className="w-2 h-2 rounded-full bg-red-400/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                  <div className="w-2 h-2 rounded-full bg-green-400/60" />
                  <div className="flex-1 mx-2">
                    <div className="bg-background/50 rounded-sm px-2 py-0.5 text-[10px] text-muted-foreground truncate font-mono">
                      terellreed.com
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 left-0 right-0 bottom-0 overflow-hidden">
                  <iframe
                    src="https://terellreed.com"
                    title="Terell Reed"
                    className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm font-mono group-hover:text-primary transition-colors">
                  Learn more about Terell ↗
                </span>
              </div>
            </a>
          </div>

          {/* Certifications */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <span className="text-xs text-muted-foreground tracking-widest font-mono">
              Small Business · SAM Registered · Federal Contractor Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
