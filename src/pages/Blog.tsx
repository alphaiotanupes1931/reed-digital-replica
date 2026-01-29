import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import { ArrowUpRight } from "lucide-react";

const posts = [
  {
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring emerging technologies and trends shaping the web development landscape.",
    date: "January 15, 2024",
    category: "Technology",
  },
  {
    title: "Why Accessibility Matters for Your Business",
    excerpt: "Understanding the business case for accessible web design and development.",
    date: "January 8, 2024",
    category: "Accessibility",
  },
  {
    title: "Choosing the Right Tech Stack for Your Project",
    excerpt: "A practical guide to selecting technologies that align with your business goals.",
    date: "December 20, 2023",
    category: "Development",
  },
  {
    title: "Government Contracting: A Guide for Small Businesses",
    excerpt: "How to navigate the federal contracting process and win your first contract.",
    date: "December 12, 2023",
    category: "Business",
  },
  {
    title: "The Importance of Mobile-First Design",
    excerpt: "Why starting with mobile leads to better user experiences across all devices.",
    date: "November 28, 2023",
    category: "Design",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">Blog</span>
              <TypedHeader text="Insights" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                Thoughts on design, development, and digital strategy.
              </p>
            </div>

            {/* Posts */}
            <div>
              {posts.map((post) => (
                <article
                  key={post.title}
                  className="group py-8 border-b border-border cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {post.date}
                        </span>
                      </div>
                      <h2 className="text-xl font-medium mb-2 group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>
                    <ArrowUpRight 
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-2" 
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
