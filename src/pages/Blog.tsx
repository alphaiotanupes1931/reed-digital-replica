import { ArrowUpRight, Newspaper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import mediumLogo from "@/assets/medium-logo.svg";

const articles = [
  {
    title: "How I Got Into Cybersecurity and AI With No Roadmap",
    url: "https://medium.com/@terellebony/how-i-got-into-cybersecurity-and-ai-with-no-roadmap-no-connections-and-no-blueprint-d89e731d2a8c",
    publication: "Medium",
    logo: mediumLogo,
    author: "Terell Reed",
  },
  {
    title: "Terell Reed: A Brother, Builder, and Rising Leader",
    url: "https://medium.com/@ainupes1931/terell-reed-a-brother-builder-and-rising-leader-in-cybersecurity-6ea88c4291cf",
    publication: "Medium",
    logo: mediumLogo,
    author: "AIN UPES 1931",
  },
  {
    title: "Morgan State Students Take Home Prize Money After Hackathon",
    url: "https://baltimoretimes-online.com/latest-news/2023/04/28/morgan-state-university-students-take-home-prize-money-land-internships-after-hackathon/",
    publication: "Baltimore Times",
    logo: null,
    author: "Baltimore Times",
  },
];

const BlogPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="section-label font-mono">Blog</span>
                  <TypedHeader text="Articles & Press" className="mt-4 mb-6" />
                </div>
              </ScrollReveal>

              {/* Articles */}
              <div className="space-y-0">
                {articles.map((article, index) => (
                  <ScrollReveal key={article.title} delay={index * 0.05}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-6 border-b border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {article.logo ? (
                            <img 
                              src={article.logo} 
                              alt={article.publication}
                              className="h-4 w-auto opacity-60"
                            />
                          ) : (
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {article.publication}
                          </span>
                        </div>
                        <h2 className="font-medium group-hover:text-muted-foreground transition-colors">
                          {article.title}
                        </h2>
                      </div>
                      <ArrowUpRight 
                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-4" 
                      />
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BlogPage;