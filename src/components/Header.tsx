import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/rdg-header-logo.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Services",
    children: [
      { label: "Portfolio", href: "/portfolio", desc: "View our recent work" },
      { label: "Pricing", href: "/pricing", desc: "Transparent pricing plans" },
      { label: "Maintenance Plans", href: "/maintenance-plans", desc: "Monthly care for your site" },
      { label: "Case Studies", href: "/work", desc: "In-depth project breakdowns" },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "About", href: "/about", desc: "Our story & team" },
      { label: "Blog", href: "/blog", desc: "Insights & updates" },
      { label: "Testimonials", href: "/testimonials", desc: "What clients say" },
      { label: "FAQ", href: "/faq", desc: "Common questions" },
    ],
  },
  { label: "Government", href: "/government" },
  {
    label: "Tools",
    children: [
      { label: "Home Office", href: "/home-office/login", desc: "Internal workspace" },
      { label: "Client Portal", href: "/invoice", desc: "View & pay invoices" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const DropdownMenu = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`nav-link flex items-center gap-1 ${isActive ? "text-foreground" : ""}`}
      >
        {item.label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="bg-background border border-border rounded-sm shadow-lg min-w-[220px] py-2">
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  className="block px-4 py-2.5 hover:bg-secondary transition-colors group"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {child.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {child.desc}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExpandedGroup(null);
  }, [location]);

  const isChildActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((c) => location.pathname === c.href);
    }
    return location.pathname === item.href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Reed Digital Group"
              className="h-7 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu
                  key={item.label}
                  item={item}
                  isActive={isChildActive(item)}
                />
              ) : (
                <Link
                  key={item.label}
                  to={item.href!}
                  className={`nav-link ${
                    location.pathname === item.href ? "text-foreground" : ""
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 -mr-2"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <Link to="/" onClick={() => setMobileOpen(false)}>
                    <img
                      src={logo}
                      alt="Reed Digital Group"
                      className="h-7 w-auto"
                    />
                  </Link>
                </div>

                {/* Mobile nav */}
                <nav className="flex-1 overflow-y-auto py-4">
                  {navItems.map((item) =>
                    item.children ? (
                      <div key={item.label}>
                        <button
                          onClick={() =>
                            setExpandedGroup(
                              expandedGroup === item.label ? null : item.label
                            )
                          }
                          className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                        >
                          {item.label}
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              expandedGroup === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedGroup === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`block pl-8 pr-5 py-2.5 text-sm transition-colors ${
                                    location.pathname === child.href
                                      ? "text-primary bg-primary/5"
                                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.href!}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-5 py-3 text-sm font-medium transition-colors ${
                          location.pathname === item.href
                            ? "text-primary bg-primary/5"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </nav>

                {/* Mobile footer */}
                <div className="p-5 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    reeddigitalgroup@gmail.com
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
