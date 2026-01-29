import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "Full-featured online store with payment processing and inventory management.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
  },
  {
    title: "Financial Dashboard",
    category: "Application",
    description: "Real-time analytics dashboard for tracking investments and market trends.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    title: "Healthcare Portal",
    category: "Web Application",
    description: "Patient management system with appointment scheduling and telehealth features.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
  },
  {
    title: "Restaurant Mobile App",
    category: "Mobile Development",
    description: "iOS and Android app for online ordering and table reservations.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    title: "Real Estate Platform",
    category: "Web Development",
    description: "Property listing and search platform with virtual tour integration.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  },
  {
    title: "Corporate Website",
    category: "Web Design",
    description: "Modern, responsive website redesign for a Fortune 500 company.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
];

const PortfolioPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-label font-mono">Portfolio</span>
            <TypedHeader text="Our Work" className="mt-4 mb-6" />
            <p className="text-muted-foreground">
              A showcase of projects we've brought to life.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden mb-4">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  {project.category}
                </span>
                <h3 className="text-lg font-medium mt-1 mb-2 group-hover:text-muted-foreground transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
