import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const services = [
  { title: "Websites", desc: "Fast sites that get you customers." },
  { title: "Online Stores", desc: "Sell online, easy." },
  { title: "Mobile Apps", desc: "iPhone and Android apps." },
  { title: "Booking", desc: "Customers book you 24/7." },
  { title: "Business Software", desc: "Custom tools for your team." },
  { title: "Cybersecurity", desc: "Keep your business safe.", maintenance: true },
  { title: "Restaurant Menus", desc: "Digital and printed menus for your restaurant.", maintenance: true },
  { title: "Updates & Fixes", desc: "We keep your site running. Big or small fixes handled.", maintenance: true },
];

const Services = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto max-w-4xl px-6">
            <ScrollReveal>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                What We Do
              </p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                Services
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-16">
                Everything we build and offer — from first launch to ongoing care.
              </p>
            </ScrollReveal>

            <div className="mb-16">
              {services.map((service, index) => (
                <div key={service.title} className="group">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline py-5 border-b border-border hover:border-primary transition-colors duration-300">
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="font-medium text-base md:text-lg group-hover:text-primary transition-colors">
                          {service.title}
                        </span>
                        {service.maintenance && (
                          <span className="ml-3 text-[10px] uppercase tracking-widest text-primary border border-primary/40 px-2 py-0.5">
                            Included in Maintenance
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-0 pl-8 md:pl-0 group-hover:text-foreground transition-colors">
                      {service.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <ScrollReveal>
              <div className="border border-border p-6 md:p-8 mb-12">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Maintenance Plan
                </p>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">
                  Cybersecurity, restaurant menus, and any big or small fixes are all included in the maintenance plan.
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-6">
                  One monthly rate covers ongoing updates, security, menu changes, and repairs — no surprise invoices.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block text-xs uppercase tracking-widest border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
                >
                  View Maintenance Plans
                </Link>
              </div>
            </ScrollReveal>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-block text-xs uppercase tracking-widest bg-foreground text-background px-5 py-3 hover:bg-foreground/85 transition-colors"
              >
                Start a Project
              </Link>
              <Link
                to="/portfolio"
                className="inline-block text-xs uppercase tracking-widest border border-foreground/30 px-5 py-3 hover:border-foreground transition-colors"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Services;