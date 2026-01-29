import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";

const plans = [
  {
    name: "Starter",
    price: "$5,000",
    description: "Perfect for small businesses getting started online.",
    features: [
      "5-page responsive website",
      "Mobile-first design",
      "Basic SEO setup",
      "Contact form integration",
      "2 rounds of revisions",
      "30-day support",
    ],
  },
  {
    name: "Professional",
    price: "$15,000",
    description: "For growing businesses needing custom solutions.",
    features: [
      "Custom web application",
      "User authentication",
      "Database integration",
      "Admin dashboard",
      "API development",
      "90-day support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-scale solutions for complex requirements.",
    features: [
      "Unlimited pages/features",
      "Custom integrations",
      "Cloud infrastructure",
      "Performance optimization",
      "Security hardening",
      "Ongoing maintenance",
    ],
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">Pricing</span>
              <TypedHeader text="Investment" className="mt-4 mb-6" />
              <p className="text-muted-foreground max-w-xl mx-auto">
                Transparent pricing for quality work. Every project is unique—these are starting points.
              </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {plans.map((plan) => (
                <div key={plan.name} className="bg-background p-8">
                  <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                  <div className="text-3xl font-mono font-medium mb-4">{plan.price}</div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-6">
                Need something different? Let's discuss your project.
              </p>
              <a 
                href="/contact" 
                className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
