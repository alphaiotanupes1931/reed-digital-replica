import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "founder", label: "Founder" },
  { id: "awards", label: "Awards" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "calendly", label: "Schedule" },
  { id: "contact", label: "Contact" },
];

const SectionNav = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsVisible(window.scrollY > 300);

      // Find active section
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group flex items-center justify-end gap-3"
          aria-label={`Navigate to ${section.label}`}
        >
          <span 
            className={`text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity ${
              activeSection === section.id ? "opacity-100" : ""
            }`}
          >
            {section.label}
          </span>
          <motion.div
            className={`w-2 h-2 rounded-full border transition-all ${
              activeSection === section.id 
                ? "bg-foreground border-foreground scale-125" 
                : "border-muted-foreground group-hover:border-foreground"
            }`}
            whileHover={{ scale: 1.5 }}
          />
        </button>
      ))}
    </motion.nav>
  );
};

export default SectionNav;
