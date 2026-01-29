import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <span className="font-serif text-lg tracking-wide">
              REED DIGITAL
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Development Studio
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <a href="#services" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#work" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Work
            </a>
            <a href="#about" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
            <Link 
              to="/capability-statement" 
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Capability Statement
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} Reed Digital Group LLC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
