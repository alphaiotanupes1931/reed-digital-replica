import { motion } from "framer-motion";
import awardImage from "@/assets/website-of-year-award.jpg";

const RecentAwardsSection = () => {
  return (
    <section className="py-20 md:py-28 border-b border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-label font-mono">Recent Awards</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border"
        >
          <div className="overflow-hidden">
            <img
              src={awardImage}
              alt="Website of the Year Award 2026"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">
              2026 Winner
            </span>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">
              Website of the Year
            </h3>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed">
              Won the Website of the Year Award 2026 for the Eastern Province — Ronald R. Young Website of the Year Award.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentAwardsSection;
