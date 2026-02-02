import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Palette, Code, Rocket, Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  { 
    id: 1,
    icon: MessageSquare,
    label: "Discovery", 
    title: "We Listen & Learn",
    description: "Every great project starts with understanding. We schedule a call to learn about your business, goals, and vision. No jargon, just a real conversation about what you need.",
    details: [
      "30-minute discovery call",
      "Understand your target audience",
      "Define project scope and goals",
      "Provide a clear quote and timeline"
    ]
  },
  { 
    id: 2,
    icon: Palette,
    label: "Design", 
    title: "We Create & Refine",
    description: "We translate your vision into visual designs. You'll see mockups of your website before any code is written, with unlimited revisions until you're thrilled.",
    details: [
      "Custom design mockups",
      "Mobile and desktop layouts",
      "Unlimited revision rounds",
      "Your approval before we build"
    ]
  },
  { 
    id: 3,
    icon: Code,
    label: "Development", 
    title: "We Build & Test",
    description: "Our developers bring the designs to life using modern technology. We build fast, secure websites that work perfectly on every device.",
    details: [
      "Clean, modern code",
      "Mobile-responsive development",
      "Speed optimization",
      "Security best practices"
    ]
  },
  { 
    id: 4,
    icon: Rocket,
    label: "Launch", 
    title: "We Launch & Support",
    description: "When everything is perfect, we launch your site and make sure it performs flawlessly. We're here for you even after launch with ongoing support.",
    details: [
      "Smooth deployment",
      "Training on how to update",
      "30 days of free support",
      "Optional maintenance plans"
    ]
  },
];

const InteractiveProcessSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Section divider line */}
      <div className="section-line absolute top-0 left-0 right-0" />
      
      {/* Large background text */}
      <div className="bg-text right-0 top-1/2 -translate-y-1/2 text-right">
        PROCESS
      </div>
      
      <div className="container relative z-10">
        <ScrollReveal>
          <motion.p 
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            How We Work
          </motion.p>
          <motion.h2 
            className="text-2xl md:text-3xl font-medium text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Our Process
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center max-w-lg mx-auto mb-16"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            A clear, transparent process designed to deliver results. 
            Click each step to learn more.
          </motion.p>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto">
          {/* Step Selector - Horizontal */}
          <div className="flex justify-between items-center mb-12 relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-border -translate-y-1/2 hidden md:block" />
            
            {/* Progress line */}
            <motion.div 
              className="absolute left-0 top-1/2 h-px bg-primary -translate-y-1/2 hidden md:block"
              initial={{ width: "0%" }}
              animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            
            {steps.map((step) => (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative z-10 flex flex-col items-center gap-2 p-2 md:p-4 transition-all ${
                  activeStep === step.id ? "scale-110" : "opacity-60 hover:opacity-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                    activeStep === step.id 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : activeStep > step.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                  animate={activeStep === step.id ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {activeStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </motion.div>
                <span className={`text-xs font-mono ${
                  activeStep === step.id ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 bg-muted/30 rounded-lg p-8 md:p-12 border border-border"
            >
              {/* Left: Description */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-mono text-primary/30">
                    0{currentStep.id}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h3 className="text-2xl font-medium mb-4">{currentStep.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  What to expect
                </p>
                <ul className="space-y-3">
                  {currentStep.details.map((detail, index) => (
                    <motion.li
                      key={detail}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Hint */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === step.id ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveProcessSection;
