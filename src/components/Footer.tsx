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
  ];

  return (
    <footer className="relative border-t border-border py-16 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Link to="/" className="mb-8 group">
            <motion.img 
              src={logo} 
              alt="Reed Digital Group" 
              className="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
            {links.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={link.to} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Social */}
          <motion.a 
            href="https://instagram.com/reeddigitalgroup" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative w-12 h-12 flex items-center justify-center rounded-full overflow-hidden mb-10 group"
            aria-label="Follow us on Instagram"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 border border-border group-hover:border-transparent rounded-full transition-colors" />
            <Instagram className="relative z-10 w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
          </motion.a>

          {/* Divider with gradient */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
            <p>© {currentYear} Reed Digital Group LLC</p>
            <span className="hidden sm:inline text-primary">·</span>
            <p className="font-mono">Remote Based Agency</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
