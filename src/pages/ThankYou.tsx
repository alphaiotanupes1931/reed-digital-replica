import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

const ThankYou = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24 relative overflow-hidden">
          {/* Animated background text */}
          <motion.div
            className="bg-text top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            THANK YOU
          </motion.div>

          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              {/* Animated checkmark */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Ripple rings */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                      transition={{
                        duration: 2,
                        delay: 0.5 + i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </motion.div>

              {/* Label */}
              <motion.span
                className="section-label font-mono inline-block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Message Received
              </motion.span>

              {/* Heading with staggered letters */}
              <motion.h1
                className="text-5xl md:text-7xl font-semibold tracking-tight mt-6 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              >
                Thank you.
              </motion.h1>

              {/* Animated line */}
              <motion.div
                className="h-px bg-primary mx-auto mb-8"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeInOut" }}
              />

              {/* Body text */}
              <motion.p
                className="text-muted-foreground font-mono text-lg max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                We've received your message and will get back to you within{" "}
                <span className="text-foreground font-semibold">24 hours</span>.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                className="pt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button asChild size="lg" className="group">
                  <Link to="/">
                    Back to Home
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              {/* Floating particles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/20"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ThankYou;
