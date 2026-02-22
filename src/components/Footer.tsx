import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
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
    { to: "/thank-you", label: "Thank You" },
  ];

  return (
    <footer className="border-t border-border py-16 relative">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Link to="/" className="mb-8 group">
            <motion.img 
              src={logo} 
              alt="Reed Digital Group" 
              className="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.02 }}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
            {links.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Social */}
          <motion.a 
            href="https://instagram.com/reeddigitalgroup" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center border border-border rounded-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all mb-10"
            aria-label="Follow us on Instagram"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-4 h-4" />
          </motion.a>

          {/* Divider */}
          <div className="w-16 h-px bg-border mb-8" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
            <p>© {currentYear} Reed Digital Group LLC</p>
            <span className="hidden sm:inline">·</span>
            <p>Remote Based Agency</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
