import { Check, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import PricingCalculator from "@/components/PricingCalculator";

const websitePackages = [
  {
    name: "Starter",
    price: "$1,500 - $3,000",
    features: [
      "1-5 page custom site",
      "Mobile responsive",
      "Basic SEO",
      "Contact form",
      "Unlimited revisions",
    ],
  },
  {
    name: "Business",
    price: "$3,500 - $7,500",
    popular: true,
    features: [
      "5-10 pages",
      "Custom CMS (WordPress)",
      "Blog functionality",
      "Advanced SEO",
      "Analytics integration",
      "Unlimited revisions",
      "Animations",
      "Maintenance recommended",
    ],
  },
  {
    name: "Professional",
    price: "$8,000 - $15,000",
    features: [
      "10-20 pages",
      "Advanced functionality",
      "Booking, membership portals",
      "E-commerce ready",
      "Training included",
      "Maintenance recommended",
    ],
  },
  {
    name: "Enterprise",
    price: "$15,000 - $35,000+",
    features: [
      "Complex integrations",
      "API development",
      "Multi-user systems",
      "Priority support",
      "Dedicated project management",
      "Maintenance recommended",
    ],
  },
  {
    name: "Government / Tourism",
    price: "Custom Quote",
    features: [
      "Large-scale destination marketing sites",
      "CMS training (4 hours included)",
      "Compliance & security standards",
      "Events calendar & maps integration",
      "Hosting & migration assistance",
      "Dedicated project management",
      "Competitive pricing for government agencies",
    ],
  },
];

const mobilePackages = [
  {
    name: "MVP/Basic App",
    price: "$5,000 - $12,500",
    features: [
      "Single platform (iOS or Android)",
      "Core features only",
      "Basic UI/UX",
      "App Store submission",
    ],
  },
  {
    name: "Standard App",
    price: "$12,500 - $25,000",
    features: [
      "One platform",
      "User authentication",
      "Backend integration",
      "Push notifications",
      "Maintenance recommended",
    ],
  },
  {
    name: "Full-Featured App",
    price: "$25,000 - $50,000",
    features: [
      "Both platforms (iOS & Android)",
      "Complex features (NFC, payments, real-time)",
      "Admin dashboard",
      "Analytics integration",
      "Maintenance recommended",
    ],
  },
  {
    name: "Corporate / Enterprise App",
    price: "Custom Quote",
    features: [
      "Multi-platform enterprise solutions",
      "Advanced security",
      "Custom integrations",
      "Dedicated support",
      "Contact us to discuss your project",
    ],
  },
];

const aLaCarteServices = [
  { service: "Landing Page", price: "$300 - $600" },
  { service: "Website Redesign", price: "50% of new build cost" },
  { service: "Cybersecurity Audit", price: "Starting at $1,500" },
  { service: "IT Infrastructure Consulting", price: "$150/hour" },
];

const maintenancePackages = [
  {
    name: "Basic",
    price: "$100 - $200/month",
    features: [
      "Hosting included",
      "Security updates",
      "Minor edits (2 hrs)",
      "Email support",
      "Monthly backups",
    ],
  },
  {
    name: "Standard",
    price: "$300 - $500/month",
    features: [
      "Everything in Basic",
      "Monthly backups",
      "Analytics reports",
      "Content updates (5 hrs)",
      "Priority support",
    ],
  },
  {
    name: "Premium",
    price: "$750 - $1,500/month",
    features: [
      "Everything in Standard",
      "Performance optimization",
      "Unlimited minor edits",
      "Dedicated account manager",
    ],
  },
  {
    name: "Government & Enterprise",
    price: "Custom Quote",
    features: [
      "Tailored SLA agreements",
      "24/7 priority support",
      "Dedicated account manager",
      "Compliance & security audits",
      "Custom reporting & analytics",
    ],
  },
];

const paymentOptions = [
  {
    title: "Deposit + Milestones",
    description: "Pay a deposit upfront, then pay at each project milestone",
  },
  {
    title: "Pay in Full",
    description: "Complete payment upfront with a small discount",
  },
  {
    title: "Custom Arrangement",
    description: "Need something different? Let us know and we'll work with you",
  },
];

const PricingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            {/* Header */}
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <span className="section-label font-mono">Pricing</span>
                <TypedHeader text="Transparent Pricing That Works With Your Budget" className="mt-4 mb-6" />
                <p className="text-muted-foreground">
                  Quality digital solutions at competitive rates. No hidden fees, just honest pricing.
                </p>
              </div>
            </ScrollReveal>

            {/* Pricing Calculator */}
            <div className="mb-20">
              <PricingCalculator />
            </div>

            {/* Value Props */}
            <ScrollReveal delay={0.1}>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">100% Satisfaction Guaranteed</h3>
                    <p className="text-sm text-muted-foreground">
                      We stand behind our work. If you're not completely satisfied with your project, 
                      we'll make it right or provide a full refund.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">We Work With Your Budget</h3>
                    <p className="text-sm text-muted-foreground">
                      Every organization has different needs. We offer flexible pricing to make 
                      professional digital solutions accessible.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Why Choose RDG */}
            <ScrollReveal delay={0.15}>
              <div className="bg-muted/30 -mx-4 px-4 py-12 md:-mx-8 md:px-8 mb-20">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-xl font-medium mb-4">Why Choose RDG?</h2>
                  <p className="text-muted-foreground mb-8">
                    Custom-built solutions at competitive rates. No templates, no shortcuts—just clean code tailored to your needs.
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
                    {[
                      "Free consultations",
                      "Free mockups",
                      "Free SEO optimization",
                      "1 month free maintenance",
                      "30% off next service",
                      "Budget-friendly options",
                    ].map((item) => (
                      <span key={item} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Websites Section */}
            <ScrollReveal delay={0.2}>
              <div className="mb-20">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-2">
                  Websites
                </h2>
                <h3 className="text-2xl font-medium text-center mb-2">Custom Website Packages</h3>
                <p className="text-sm text-muted-foreground text-center mb-8">
                  All packages include training, documentation, and post-launch support.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {websitePackages.map((pkg) => (
                    <div 
                      key={pkg.name} 
                      className={`p-6 border ${pkg.popular ? 'border-foreground' : 'border-border'} relative`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-4 bg-background px-2 text-xs font-mono">
                          Most Popular
                        </span>
                      )}
                      <h4 className="font-medium mb-2">{pkg.name}</h4>
                      <div className="text-lg font-mono mb-4">{pkg.price}</div>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {pkg.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Mobile Apps Section */}
            <ScrollReveal delay={0.25}>
              <div className="mb-20">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-2">
                  Mobile Apps
                </h2>
                <h3 className="text-2xl font-medium text-center mb-8">Mobile App Development</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mobilePackages.map((pkg) => (
                    <div key={pkg.name} className="p-6 border border-border">
                      <h4 className="font-medium mb-2">{pkg.name}</h4>
                      <div className="text-lg font-mono mb-4">{pkg.price}</div>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {pkg.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* À La Carte Section */}
            <ScrollReveal delay={0.3}>
              <div className="mb-20">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-2">
                  À La Carte
                </h2>
                <h3 className="text-2xl font-medium text-center mb-8">Specialized Services</h3>
                
                <div className="max-w-2xl mx-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium">Service</th>
                        <th className="text-right py-3 font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aLaCarteServices.map((item) => (
                        <tr key={item.service} className="border-b border-border">
                          <td className="py-3 text-muted-foreground">{item.service}</td>
                          <td className="py-3 text-right font-mono">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>

            {/* Maintenance Section */}
            <ScrollReveal delay={0.35}>
              <div className="mb-20">
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-2">
                  Ongoing Support
                </h2>
                <h3 className="text-2xl font-medium text-center mb-8">Maintenance & Support</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {maintenancePackages.map((pkg) => (
                    <div key={pkg.name} className="p-6 border border-border">
                      <h4 className="font-medium mb-2">{pkg.name}</h4>
                      <div className="text-lg font-mono mb-4">{pkg.price}</div>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {pkg.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Payment Options */}
            <ScrollReveal delay={0.4}>
              <div className="bg-muted/30 -mx-4 px-4 py-12 md:-mx-8 md:px-8 mb-16">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-2">
                    Flexible Terms
                  </h2>
                  <h3 className="text-2xl font-medium text-center mb-8">Payment Options</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {paymentOptions.map((option) => (
                      <div key={option.title} className="text-center">
                        <h4 className="font-medium mb-2">{option.title}</h4>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* CTA */}
            <div className="text-center">
              <Link 
                to="/contact" 
                className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
