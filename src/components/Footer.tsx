const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                <div className="flex gap-0.5">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                </div>
                <div className="w-1.5 h-5 bg-primary rounded-full ml-0.5"></div>
              </div>
              <span className="font-display font-bold text-lg">Reed Digital Group</span>
            </div>
            <p className="text-background/60 max-w-sm">
              Helping businesses and entrepreneurs turn ideas into professional websites, apps, and digital brands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Services", "Work", "Pricing", "About", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-background/60 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-background/60">
              <li>hello@reeddigitalgroup.com</li>
              <li>Baltimore, MD</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © {new Date().getFullYear()} Reed Digital Group. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-background/40 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-background/40 hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
