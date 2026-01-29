import { Check } from "lucide-react";

const benefits = [
  "Direct communication with developers",
  "Transparent pricing, no hidden fees",
  "Fast turnaround (2-4 weeks average)",
  "30 days free maintenance after launch",
  "Satisfaction guarantee or full refund",
  "Modern tech stack, future-proof code",
];

const stats = [
  { value: "50+", label: "Projects delivered" },
  { value: "100%", label: "Client satisfaction" },
  { value: "5.0", label: "Google rating" },
  { value: "<2wk", label: "Avg. turnaround" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="section-label mb-4">Why us</p>
            <h2 className="text-display-sm md:text-display font-bold mb-6">
              Quality work without the agency overhead
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We're a lean team that moves fast. No account managers, no bureaucracy—just 
              direct access to the people building your product. You get agency-quality 
              work at a fraction of the cost.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-background" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <a href="#contact" className="btn-primary inline-flex">
              Work with us
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-8 border border-border text-center"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
