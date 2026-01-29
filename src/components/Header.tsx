import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/rdg-header-logo.png";

const navItems = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Government", href: "/government" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm shadow-sm" 
          : "bg-background"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Reed Digital Group" 
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.href} 
                className={`nav-link ${location.pathname === item.href ? 'text-foreground' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
          <nav className="container py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm py-2 transition-colors ${
                  location.pathname === item.href 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
