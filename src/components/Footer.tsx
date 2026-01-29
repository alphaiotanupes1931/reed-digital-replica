import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logo from "@/assets/rdg-header-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Social */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="Reed Digital Group" 
                className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/reeddigitalgroup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-border rounded hover:bg-muted hover:border-foreground/20 transition-all"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium mb-4">Company</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                About
              </Link>
              <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                Portfolio
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                Blog
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-medium mb-4">Services</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                Pricing
              </Link>
              <Link to="/government" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                Government
              </Link>
              <Link to="/capability-statement" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                Capability Statement
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium mb-4">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
                FAQ
              </Link>
              <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline inline-block w-fit">
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
            Remote Based Agency
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
