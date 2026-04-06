import { Link } from "react-router-dom";

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
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
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
