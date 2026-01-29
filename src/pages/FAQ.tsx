import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";
import { useState } from "react";

const faqs = [
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary based on scope and complexity. A simple website typically takes 4-6 weeks, while custom web applications can take 3-6 months. We'll provide a detailed timeline during our initial consultation.",
  },
  {
    question: "How do you handle project pricing?",
    answer: "We offer both fixed-price and time-and-materials pricing models. For well-defined projects, we prefer fixed pricing for budget certainty. Complex projects with evolving requirements work better with time-and-materials. We always provide detailed estimates before starting.",
  },
  {
    question: "Do you work with government agencies?",
    answer: "Yes, we're a certified small business registered in SAM (System for Award Management). We have experience working with federal, state, and local government agencies and understand the unique requirements of government contracting.",
  },
  {
    question: "What technologies do you work with?",
    answer: "We specialize in modern web technologies including React, TypeScript, Node.js, and cloud platforms (AWS, Azure). We select technologies based on your specific requirements rather than forcing a one-size-fits-all solution.",
  },
  {
    question: "Do you provide ongoing maintenance and support?",
    answer: "Absolutely. We offer various support packages ranging from 30-day post-launch support to ongoing maintenance agreements. We believe in building lasting relationships with our clients.",
  },
  {
    question: "Can you work with our existing systems?",
    answer: "Yes, we regularly integrate with existing systems, databases, and third-party services. During discovery, we'll assess your current infrastructure and recommend the best approach for integration.",
  },
  {
    question: "What is your development process?",
    answer: "We follow an agile methodology with regular check-ins and deliverables. Our process includes Discovery, Design, Development, and Deployment phases, with client involvement throughout to ensure we're aligned with your vision.",
  },
  {
    question: "Do you sign NDAs?",
    answer: "Yes, we're happy to sign NDAs before discussing your project. Client confidentiality is important to us, and we treat all project information as proprietary.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">FAQ</span>
              <TypedHeader text="Common Questions" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                Answers to frequently asked questions about working with us.
              </p>
            </div>

            {/* FAQs */}
            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border">
                  <button
                    className="w-full py-6 text-left flex items-start justify-between gap-4"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <span className="text-muted-foreground font-mono flex-shrink-0">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === index && (
                    <p className="pb-6 text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-6">
                Have a question not listed here?
              </p>
              <a 
                href="/contact" 
                className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
