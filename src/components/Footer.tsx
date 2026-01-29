import { Link } from "react-router-dom";
import logo from "@/assets/rdg-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Reed Digital Group" 
              className="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity"
            />
          </a>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Work
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
            <Link 
              to="/capability-statement" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Capability Statement
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Reed Digital Group
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
