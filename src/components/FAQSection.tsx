import TypedHeader from "@/components/TypedHeader";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. A simple website typically takes 2-4 weeks, while custom web applications can take 2-3 months. We'll provide a detailed timeline during our initial consultation."
  },
  {
    question: "What is your pricing structure?",
    answer: "We offer flexible pricing options including fixed-price projects and retainer agreements. Pricing depends on project scope, complexity, and timeline. Contact us for a custom quote tailored to your needs."
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes! We offer maintenance packages that include updates, security patches, performance monitoring, and technical support. We're committed to your long-term success."
  },
  {
    question: "What technologies do you work with?",
    answer: "We specialize in modern web technologies including React, Next.js, Node.js, TypeScript, and Tailwind CSS. For backends, we work with Supabase, PostgreSQL, and various cloud platforms."
  },
  {
    question: "Can you help with an existing project?",
    answer: "Absolutely! We can take over existing projects, perform code audits, implement new features, or help optimize performance. We'll assess your codebase and provide recommendations."
  },
  {
    question: "Do you work with government agencies?",
    answer: "Yes, we're experienced in government contracting and have our CAGE code and relevant NAICS codes. Visit our Government page for more details on our federal contracting capabilities."
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 md:py-32 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="section-label font-mono">FAQ</span>
            <TypedHeader text="Common Questions" className="mt-4 mb-6" />
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <AccordionItem value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left hover:no-underline hover:text-muted-foreground py-6">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </ScrollReveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;