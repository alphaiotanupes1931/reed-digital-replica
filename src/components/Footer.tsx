import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logo from "@/assets/rdg-header-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const links = [
    { to: "/about", label: "About" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/government", label: "Government" },
  ];

  return (
    <footer className="border-t border-border py-16">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Link to="/" className="mb-8">
            <img 
              src={logo} 
              alt="Reed Digital Group" 
              className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
            {links.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <a 
            href="https://instagram.com/reeddigitalgroup" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:bg-foreground hover:text-background hover:border-foreground transition-all mb-10"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Divider */}
          <div className="w-16 h-px bg-border mb-8" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
            <p>© {currentYear} Reed Digital Group LLC</p>
            <span className="hidden sm:inline">·</span>
            <p className="font-mono">Remote Based Agency</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;