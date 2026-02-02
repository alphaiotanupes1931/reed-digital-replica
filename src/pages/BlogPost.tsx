import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const blogPosts: Record<string, {
  title: string;
  author: string;
  date: string;
  readTime: string;
  heroImage: string;
  content: React.ReactNode;
}> = {
  "why-every-small-business-needs-website-2024": {
    title: "Why Every Small Business Needs a Website in 2024",
    author: "Terell Reed",
    date: "January 15, 2024",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    content: (
      <>
        <p className="text-lg text-muted-foreground mb-6">
          In today's digital-first world, having a website isn't just an option—it's a necessity. 
          Yet, surprisingly, nearly 30% of small businesses still don't have a website. Here's why 
          that needs to change.
        </p>
        
        <h2 className="text-2xl font-medium mt-10 mb-4">Your Website is Your 24/7 Salesperson</h2>
        <p className="text-muted-foreground mb-6">
          Unlike a physical store that closes at night, your website works around the clock. 
          Potential customers can learn about your services, view your work, and even make purchases 
          while you sleep. This constant availability means you never miss an opportunity to connect 
          with someone interested in what you offer.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">Credibility and Trust</h2>
        <p className="text-muted-foreground mb-6">
          When someone hears about your business, the first thing they do is search for you online. 
          If they can't find a professional website, they may question whether your business is 
          legitimate. A well-designed website instantly establishes credibility and shows that you 
          take your business seriously.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">Compete with Larger Businesses</h2>
        <p className="text-muted-foreground mb-6">
          A great website levels the playing field. A small local bakery with an excellent website 
          can look just as professional as a national chain. Your website tells your story, showcases 
          your unique value, and helps you compete for attention in your market.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">Control Your Narrative</h2>
        <p className="text-muted-foreground mb-6">
          Social media profiles are great, but you don't own them. Algorithms change, platforms rise 
          and fall, and your reach can be limited at any time. Your website is your own digital real 
          estate where you control the message, the design, and the experience.
        </p>

        <div className="bg-muted p-6 rounded-lg my-10 border-l-4 border-primary">
          <p className="text-lg font-medium mb-2">Ready to Get Started?</p>
          <p className="text-muted-foreground">
            At Reed Digital Group, we specialize in creating beautiful, functional websites for small 
            businesses. Let's discuss how we can help your business establish its digital presence.
          </p>
        </div>

        <h2 className="text-2xl font-medium mt-10 mb-4">The Bottom Line</h2>
        <p className="text-muted-foreground mb-6">
          A website is no longer a luxury—it's the foundation of your business's digital presence. 
          Whether you're looking to attract new customers, build credibility, or simply have a place 
          to send people who want to learn more about you, a website is essential.
        </p>
      </>
    ),
  },
  "5-signs-website-needs-redesign": {
    title: "5 Signs Your Website Needs a Redesign",
    author: "Terell Reed",
    date: "February 8, 2024",
    readTime: "4 min read",
    heroImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=600&fit=crop",
    content: (
      <>
        <p className="text-lg text-muted-foreground mb-6">
          Your website is often the first impression potential customers have of your business. 
          If it's outdated, slow, or hard to navigate, you could be losing customers without even 
          knowing it. Here are five signs it's time for a refresh.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">1. It's Not Mobile-Friendly</h2>
        <p className="text-muted-foreground mb-6">
          Over 60% of web traffic now comes from mobile devices. If your website doesn't look good 
          and function well on a smartphone, you're alienating the majority of your potential audience. 
          Pinch-to-zoom and horizontal scrolling are deal-breakers for modern users.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">2. It Loads Slowly</h2>
        <p className="text-muted-foreground mb-6">
          Users expect websites to load in 2-3 seconds or less. Every second of delay increases bounce 
          rates dramatically. Slow loading times hurt your search rankings, frustrate users, and cost 
          you conversions.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">3. The Design Looks Dated</h2>
        <p className="text-muted-foreground mb-6">
          Web design trends evolve quickly. If your site features Flash animations, clip art, or a 
          design that screams "early 2010s," it's time for an update. Modern users have high 
          expectations for visual design and user experience.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">4. High Bounce Rate, Low Conversions</h2>
        <p className="text-muted-foreground mb-6">
          If your analytics show people leaving quickly without taking action, your website isn't 
          doing its job. A redesign focused on user experience and clear calls-to-action can 
          dramatically improve these metrics.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">5. It's Hard to Update</h2>
        <p className="text-muted-foreground mb-6">
          If you need a developer every time you want to change a phone number or add a new photo, 
          your website is holding you back. Modern websites should be easy for non-technical people 
          to update and maintain.
        </p>

        <div className="bg-muted p-6 rounded-lg my-10 border-l-4 border-primary">
          <p className="text-lg font-medium mb-2">Free Website Audit</p>
          <p className="text-muted-foreground">
            Not sure if your website needs work? We offer free website audits to help you understand 
            what's working and what could be improved. Contact us to schedule yours.
          </p>
        </div>
      </>
    ),
  },
  "choosing-right-tech-stack-business": {
    title: "Choosing the Right Tech Stack for Your Business",
    author: "Terell Reed",
    date: "March 22, 2024",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    content: (
      <>
        <p className="text-lg text-muted-foreground mb-6">
          When building a website or application, one of the most important decisions is choosing 
          the right technology stack. The wrong choice can lead to scalability issues, security 
          vulnerabilities, and costly rewrites down the road.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">What is a Tech Stack?</h2>
        <p className="text-muted-foreground mb-6">
          A tech stack is the combination of technologies used to build your website or application. 
          This includes the programming languages, frameworks, databases, and hosting services that 
          power your digital product.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">For Simple Business Websites</h2>
        <p className="text-muted-foreground mb-6">
          If you need a basic website to showcase your services and contact information, you don't 
          need complex technology. A modern website builder or a simple React site with a headless 
          CMS will serve you well and be easy to maintain.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">For E-Commerce</h2>
        <p className="text-muted-foreground mb-6">
          Selling products online requires robust e-commerce functionality. Platforms like Shopify 
          offer turnkey solutions, while custom builds with Stripe integration provide more 
          flexibility. The right choice depends on your volume, customization needs, and budget.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">For Custom Applications</h2>
        <p className="text-muted-foreground mb-6">
          If you need something unique—a booking system, customer portal, or internal tool—custom 
          development with React, Node.js, and a cloud database like Supabase offers the flexibility 
          and scalability you need.
        </p>

        <h2 className="text-2xl font-medium mt-10 mb-4">Our Recommendation</h2>
        <p className="text-muted-foreground mb-6">
          At Reed Digital Group, we primarily work with React, TypeScript, and Supabase. This 
          modern stack offers excellent performance, security, and developer experience while 
          remaining cost-effective and scalable.
        </p>

        <div className="bg-muted p-6 rounded-lg my-10 border-l-4 border-primary">
          <p className="text-lg font-medium mb-2">Need Guidance?</p>
          <p className="text-muted-foreground">
            Choosing technology can be overwhelming. Schedule a free consultation and we'll help 
            you understand what's right for your specific needs.
          </p>
        </div>
      </>
    ),
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-32 pb-24">
            <div className="container text-center">
              <h1 className="text-3xl font-medium mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The blog post you're looking for doesn't exist.
              </p>
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-24">
          {/* Hero Image */}
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <img 
              src={post.heroImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="container max-w-3xl -mt-32 relative z-10">
            <ScrollReveal>
              {/* Back Link */}
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-12 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
                <span>{post.date}</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              {/* Content */}
              <article className="prose prose-lg max-w-none">
                {post.content}
              </article>

              {/* CTA */}
              <div className="mt-16 pt-8 border-t border-border text-center">
                <p className="text-muted-foreground mb-4">
                  Ready to start your project?
                </p>
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BlogPost;
