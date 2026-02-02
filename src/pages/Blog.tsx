import { ArrowUpRight, Newspaper, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";
import mediumLogo from "@/assets/medium-logo.svg";

// Internal blog posts
const blogPosts = [
  {
    title: "Why Every Small Business Needs a Website in 2024",
    slug: "why-every-small-business-needs-website-2024",
    excerpt: "In today's digital-first world, having a website isn't just an option—it's a necessity. Here's why your business can't afford to go without one.",
    date: "January 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    title: "5 Signs Your Website Needs a Redesign",
    slug: "5-signs-website-needs-redesign",
    excerpt: "Your website is often the first impression potential customers have. Here are the warning signs that it's time for a refresh.",
    date: "February 8, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop",
  },
  {
    title: "Choosing the Right Tech Stack for Your Business",
    slug: "choosing-right-tech-stack-business",
    excerpt: "React, WordPress, Shopify—the options are endless. We break down how to choose the right technology for your specific needs.",
    date: "March 22, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
  },
];

// External articles
const externalArticles = [
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
    author: "AI Nupes",
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
            {/* Header */}
            <ScrollReveal>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="section-label font-mono">Blog</span>
                <TypedHeader text="Insights & Resources" className="mt-4 mb-6" />
                <p className="text-muted-foreground">
                  Tips, insights, and stories to help your business thrive online.
                </p>
              </div>
            </ScrollReveal>

            {/* Featured Blog Posts */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {blogPosts.map((post, index) => (
                <ScrollReveal key={post.slug} delay={index * 0.1}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <motion.div
                      className="border border-border rounded-lg overflow-hidden h-full"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Image */}
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h2 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                          Read more
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {/* Press & External Articles */}
            <div className="max-w-2xl mx-auto">
              <ScrollReveal>
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider text-center mb-8">
                  Press & Features
                </h2>
              </ScrollReveal>
              
              <div className="space-y-0">
                {externalArticles.map((article, index) => (
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