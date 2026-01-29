import { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

const words = ["websites", "apps", "brands", "experiences"];

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseTime = 2000;

  const animateText = useCallback(() => {
    const currentWord = words[currentWordIndex];
    
    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [displayText, isDeleting, currentWordIndex]);

  useEffect(() => {
    animateText();
  }, [animateText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-muted-foreground">Available for new projects</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-display-lg md:text-display-xl font-bold mb-6 animate-fade-up stagger-1">
            We design and build
            <br />
            <span className="text-muted-foreground">
              {displayText}
              <span className="typing-cursor"></span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up stagger-2 text-balance">
            A design-focused development studio helping startups and businesses 
            create beautiful, functional digital products that users love.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-3">
            <a href="#contact" className="btn-primary w-full sm:w-auto">
              Start a project <ArrowRight size={16} />
            </a>
            <a href="#work" className="btn-secondary w-full sm:w-auto">
              View our work
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-16 border-t border-border animate-fade-up stagger-4">
            <p className="text-sm text-muted-foreground mb-6">Trusted by businesses worldwide</p>
            <div className="flex items-center justify-center gap-8 md:gap-12 opacity-60">
              {["OpenAI", "Shopify", "Stripe", "Vercel", "Notion"].map((company) => (
                <span key={company} className="text-sm md:text-base font-medium text-muted-foreground">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
