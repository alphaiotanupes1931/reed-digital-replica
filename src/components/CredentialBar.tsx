import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const CredentialBar = () => {
  return (
    <motion.div 
      className="py-4 bg-primary text-primary-foreground overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <div className="container">
        <motion.div 
          className="flex items-center justify-center gap-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <Trophy className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm md:text-base font-medium">
            Choose a team that's won <span className="font-bold">4+ hackathons</span>. Not rookies.
          </p>
          <Trophy className="w-4 h-4 flex-shrink-0 hidden md:block" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CredentialBar;
