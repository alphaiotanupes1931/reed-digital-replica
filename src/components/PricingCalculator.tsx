import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Monitor, Smartphone } from "lucide-react";

const websiteFeatures = [
  { id: "cms", label: "CMS / Blog", price: 500 },
  { id: "ecommerce", label: "E-Commerce", price: 2000 },
  { id: "booking", label: "Booking", price: 1000 },
  { id: "auth", label: "User Auth", price: 800 },
  { id: "api", label: "API Integrations", price: 1500 },
  { id: "analytics", label: "Analytics", price: 750 },
];

const appFeatures = [
  { id: "auth", label: "User Auth", price: 1500 },
  { id: "push", label: "Push Notifications", price: 1000 },
  { id: "payments", label: "Payments", price: 2500 },
  { id: "api", label: "API Integrations", price: 2000 },
  { id: "cms", label: "CMS", price: 2000 },
  { id: "crm", label: "CRM", price: 3500 },
  { id: "offline", label: "Offline Mode", price: 1500 },
  { id: "admin", label: "Admin Panel", price: 3000 },
];

const PricingCalculator = () => {
  const [projectType, setProjectType] = useState<"website" | "app">("website");
  const [pages, setPages] = useState([5]);
  const [screens, setScreens] = useState([8]);
  const [selectedWebsite, setSelectedWebsite] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<string[]>([]);

  const toggleWebsite = (id: string) => {
    setSelectedWebsite(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleApp = (id: string) => {
    setSelectedApp(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Website pricing
  const websiteBase = pages[0] <= 5 ? 1500 : pages[0] <= 10 ? 4000 : pages[0] <= 15 ? 8000 : 12000;
  const websiteExtras = selectedWebsite.reduce((sum, id) => sum + (websiteFeatures.find(f => f.id === id)?.price || 0), 0);
  const websiteTotal = websiteBase + websiteExtras;

  // App pricing
  const appBase = screens[0] <= 5 ? 5000 : screens[0] <= 10 ? 12500 : screens[0] <= 15 ? 20000 : 30000;
  const appExtras = selectedApp.reduce((sum, id) => sum + (appFeatures.find(f => f.id === id)?.price || 0), 0);
  const appTotal = appBase + appExtras;

  const features = projectType === "website" ? websiteFeatures : appFeatures;
  const selected = projectType === "website" ? selectedWebsite : selectedApp;
  const toggle = projectType === "website" ? toggleWebsite : toggleApp;
  const total = projectType === "website" ? websiteTotal : appTotal;

  return (
    <div className="border border-border p-8">
      <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6 text-center">
        Quick Estimate
      </h3>

      {/* Project Type Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setProjectType("website")}
          className={`flex items-center gap-2 px-4 py-2 text-sm border transition-all ${
            projectType === "website" 
              ? "border-primary bg-primary text-primary-foreground" 
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <Monitor className="w-4 h-4" />
          Website
        </button>
        <button
          onClick={() => setProjectType("app")}
          className={`flex items-center gap-2 px-4 py-2 text-sm border transition-all ${
            projectType === "app" 
              ? "border-primary bg-primary text-primary-foreground" 
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile App
        </button>
      </div>

      {/* Pages/Screens Slider */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span>{projectType === "website" ? "Pages" : "Screens"}</span>
          <span className="font-mono">{projectType === "website" ? pages[0] : screens[0]}</span>
        </div>
        {projectType === "website" ? (
          <Slider value={pages} onValueChange={setPages} min={1} max={20} step={1} />
        ) : (
          <Slider value={screens} onValueChange={setScreens} min={3} max={25} step={1} />
        )}
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
        key={`${projectType}-${total}`}
        initial={{ scale: 0.98, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs text-muted-foreground mb-1">
          Estimated {projectType === "website" ? "Website" : "App"} Cost
        </p>
        <p className="text-3xl font-mono">${total.toLocaleString()}+</p>
        <p className="text-xs text-muted-foreground mt-2">
          Final quote after consultation
        </p>
      </motion.div>
    </div>
  );
};

export default PricingCalculator;
