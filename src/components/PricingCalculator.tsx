import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import ScrollReveal from "./ScrollReveal";

const PricingCalculator = () => {
  const [pages, setPages] = useState([5]);
  const [features, setFeatures] = useState<string[]>([]);

  const featureOptions = [
    { id: "cms", label: "CMS / Blog", price: 500 },
    { id: "ecommerce", label: "E-Commerce", price: 2000 },
    { id: "booking", label: "Booking System", price: 1000 },
    { id: "auth", label: "User Authentication", price: 800 },
    { id: "analytics", label: "Analytics Dashboard", price: 600 },
    { id: "seo", label: "Advanced SEO", price: 400 },
  ];

  const toggleFeature = (id: string) => {
    setFeatures(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id]
    );
  };

  // Calculate estimate
  const basePrice = pages[0] <= 5 ? 1500 : pages[0] <= 10 ? 4000 : pages[0] <= 15 ? 8000 : 12000;
  const featuresPrice = features.reduce((sum, fId) => {
    const feature = featureOptions.find(f => f.id === fId);
    return sum + (feature?.price || 0);
  }, 0);
  const totalEstimate = basePrice + featuresPrice;

  return (
    <ScrollReveal>
      <div className="bg-muted/30 border border-border p-8 md:p-12 max-w-3xl mx-auto">
        <h3 className="text-xl font-medium text-center mb-2">Project Estimator</h3>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Get a rough estimate for your website project
        </p>

        {/* Pages Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium">Number of Pages</label>
            <span className="font-mono text-lg">{pages[0]}</span>
          </div>
          <Slider
            value={pages}
            onValueChange={setPages}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 page</span>
            <span>20 pages</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <label className="text-sm font-medium block mb-4">Additional Features</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {featureOptions.map((feature) => (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`p-3 border text-left transition-all ${
                  features.includes(feature.id)
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <span className="text-sm block">{feature.label}</span>
                <span className="text-xs text-muted-foreground font-mono">+${feature.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Estimate */}
        <motion.div 
          className="text-center pt-6 border-t border-border"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          key={totalEstimate}
        >
          <p className="text-sm text-muted-foreground mb-2">Estimated Investment</p>
          <p className="text-4xl font-mono font-medium">
            ${totalEstimate.toLocaleString()}
            <span className="text-lg text-muted-foreground">+</span>
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            *Final pricing may vary based on specific requirements
          </p>
        </motion.div>
      </div>
    </ScrollReveal>
  );
};

export default PricingCalculator;
