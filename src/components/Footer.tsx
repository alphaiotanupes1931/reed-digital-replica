import { Link } from "react-router-dom";
import logo from "@/assets/rdg-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-block">
              <img 
                src={logo} 
                alt="Reed Digital Group" 
                className="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium mb-4">Company</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Work
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-medium mb-4">Services</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/government" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Government
              </Link>
              <Link to="/capability-statement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Capability Statement
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium mb-4">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Reed Digital Group LLC
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Baltimore, Maryland
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
