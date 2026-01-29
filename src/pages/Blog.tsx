import { ArrowUpRight, ExternalLink, Newspaper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import mediumLogo from "@/assets/medium-logo.svg";

const articles = [
  {
    title: "How I Got Into Cybersecurity and AI With No Roadmap, No Connections, and No Blueprint",
    excerpt: "A personal journey into the world of cybersecurity and artificial intelligence, sharing insights and lessons learned along the way without a traditional path.",
    url: "https://medium.com/@terellebony/how-i-got-into-cybersecurity-and-ai-with-no-roadmap-no-connections-and-no-blueprint-d89e731d2a8c",
    publication: "Medium",
    logo: mediumLogo,
    author: "Terell Reed",
    category: "Personal Journey",
  },
  {
    title: "Terell Reed: A Brother, Builder, and Rising Leader in Cybersecurity",
    excerpt: "A feature article highlighting Terell Reed's contributions to technology, fraternity, and his emerging leadership in the cybersecurity field.",
    url: "https://medium.com/@ainupes1931/terell-reed-a-brother-builder-and-rising-leader-in-cybersecurity-6ea88c4291cf",
    publication: "Medium",
    logo: mediumLogo,
    author: "AIN UPES 1931",
    category: "Feature",
  },
  {
    title: "Morgan State University Students Take Home Prize Money, Land Internships After Hackathon",
    excerpt: "Coverage of Morgan State students winning prizes and securing internships at a competitive hackathon event, showcasing student innovation and talent.",
    url: "https://baltimoretimes-online.com/latest-news/2023/04/28/morgan-state-university-students-take-home-prize-money-land-internships-after-hackathon/",
    publication: "The Baltimore Times",
    logo: null,
    author: "Baltimore Times Staff",
    category: "News",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="section-label font-mono">Blog & Press</span>
              <TypedHeader text="Featured Articles" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                Stories, insights, and press coverage from around the web.
              </p>
            </div>
          </ScrollReveal>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {articles.map((article, index) => (
              <ScrollReveal key={article.title} delay={index * 0.1}>
                <TiltCard>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full"
                  >
                    <article className="flex flex-col h-full p-6 border border-border rounded-sm hover:border-foreground/20 transition-colors">
                      {/* Publication Logo */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          {article.logo ? (
                            <img 
                              src={article.logo} 
                              alt={article.publication}
                              className="h-6 w-auto invert dark:invert-0"
                            />
                          ) : (
                            <Newspaper className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground font-mono">
                            {article.publication}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>

                      {/* Category */}
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
                        {article.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-lg font-medium mb-3 group-hover:text-muted-foreground transition-colors line-clamp-3">
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-4">
                        {article.excerpt}
                      </p>

                      {/* Author */}
                      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                        <span className="text-xs text-muted-foreground">
                          By {article.author}
                        </span>
                        <ArrowUpRight 
                          className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" 
                        />
                      </div>
                    </article>
                  </a>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Call to Action */}
          <ScrollReveal delay={0.3}>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground text-sm">
                Want to feature Reed Digital Group? 
                <a 
                  href="/contact" 
                  className="text-foreground hover-underline ml-1"
                >
                  Get in touch
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
