import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const faqs = [
  {
    question: "What is your typical project timeline?",
    answer: "Simple websites take 4-6 weeks. Custom applications can take 3-6 months depending on complexity.",
  },
  {
    question: "How do you handle pricing?",
    answer: "We offer fixed-price for defined projects and time-and-materials for evolving requirements. Always with upfront estimates.",
  },
  {
    question: "Do you work with government agencies?",
    answer: "Yes. We're SAM registered and experienced with federal, state, and local government contracts.",
  },
  {
    question: "What technologies do you use?",
    answer: "React, TypeScript, Node.js, and cloud platforms (AWS, Azure). We select based on your specific needs.",
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Yes. From 30-day post-launch support to ongoing maintenance agreements.",
  },
  {
    question: "Do you sign NDAs?",
    answer: "Absolutely. We treat all project information as proprietary.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                  <span className="section-label font-mono">FAQ</span>
                  <TypedHeader text="Questions" className="mt-4 mb-6" />
                </div>
              </ScrollReveal>

              {/* FAQs */}
              <div>
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border">
                    <button
                      className="w-full py-5 text-left flex items-center justify-between gap-4"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <span className="text-sm font-medium">{faq.question}</span>
                      <motion.span 
                        className="text-muted-foreground font-mono text-lg"
                        animate={{ rotate: openIndex === index ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-muted-foreground pb-5 overflow-hidden"
                        >
                          {faq.answer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <ScrollReveal delay={0.2}>
                <div className="text-center mt-16">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have another question?
                  </p>
                  <Link 
                    to="/contact" 
                    className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FAQPage;