import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm border-b border-border" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto">
        {/* Top Bar with Logo */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Centered Logo */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="font-serif text-xl md:text-2xl font-medium tracking-wide text-foreground">
              REED DIGITAL
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
              Development Studio
            </span>
          </a>

          {/* Right side placeholder for balance */}
          <div className="w-8 md:hidden" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-3">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
          <span className="text-border">|</span>
          <Link to="/capability-statement" className="nav-link">
            Capability Statement
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
          <nav className="container py-6 flex flex-col items-center gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm uppercase tracking-[0.15em] text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="w-8 h-px bg-border my-2" />
            <Link 
              to="/capability-statement" 
              className="text-sm uppercase tracking-[0.15em] text-foreground py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Capability Statement
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
