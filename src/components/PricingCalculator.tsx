import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

const features = [
  { id: "cms", label: "CMS / Blog", price: 500 },
  { id: "ecommerce", label: "E-Commerce", price: 2000 },
  { id: "booking", label: "Booking", price: 1000 },
  { id: "auth", label: "User Auth", price: 800 },
  { id: "api", label: "API Integrations", price: 1500 },
  { id: "advanced", label: "Advanced Features", price: 2500 },
  { id: "analytics", label: "Analytics", price: 750 },
];

const PricingCalculator = () => {
  const [pages, setPages] = useState([5]);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const base = pages[0] <= 5 ? 1500 : pages[0] <= 10 ? 4000 : pages[0] <= 15 ? 8000 : 12000;
  const extras = selected.reduce((sum, id) => sum + (features.find(f => f.id === id)?.price || 0), 0);
  const total = base + extras;

  return (
    <div className="border border-border p-8">
      <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
        Quick Estimate
      </h3>

      {/* Pages */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span>Pages</span>
          <span className="font-mono">{pages[0]}</span>
        </div>
        <Slider value={pages} onValueChange={setPages} min={1} max={20} step={1} />
      </div>

      {/* Features */}
      <div className="mb-8">
        <p className="text-sm mb-3">Add-ons</p>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                selected.includes(f.id) ? "border-foreground bg-foreground/5" : "border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <motion.div 
        className="text-center pt-6 border-t border-border"
        key={total}
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
      >
        <p className="text-xs text-muted-foreground mb-1">Estimated</p>
        <p className="text-3xl font-mono">${total.toLocaleString()}+</p>
      </motion.div>
    </div>
  );
};

export default PricingCalculator;