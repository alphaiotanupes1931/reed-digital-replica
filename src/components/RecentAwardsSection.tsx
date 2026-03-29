import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import awardImage from "@/assets/website-of-year-award.jpg";

const RecentAwardsSection = () => {
  return (
    <section className="py-16 md:py-20 border-b border-border bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="section-label font-mono flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Recent Awards
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="border border-border bg-card overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img
                src={awardImage}
                alt="Website of the Year Award 2026 - Eastern Province Ronald R. Young Award"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest mb-4">
                2026 Winner
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Website of the Year Award
              </h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                Won the Website of the Year Award 2026 for the Eastern Province — Ronald R. Young Website of the Year Award.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentAwardsSection;
