import { motion } from "framer-motion";

interface PortfolioFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const PortfolioFilter = ({ categories, activeCategory, onCategoryChange }: PortfolioFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`relative px-4 py-2 text-sm font-mono transition-colors ${
            activeCategory === category 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeCategory === category && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 border border-foreground"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{category}</span>
        </button>
      ))}
    </div>
  );
};

export default PortfolioFilter;
