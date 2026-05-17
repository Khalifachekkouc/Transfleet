"use client";
import { motion, AnimatePresence } from "framer-motion";

const springConfig = {
  type: "spring",
  stiffness: 50,
  damping: 15,
};

export function StaggerContainer({ children, className = "" }) {
  return (
    <AnimatePresence>
      <motion.div className={className}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function SlideUpItem({ children, index = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springConfig, delay: index * 0.05 }}
      whileHover={{ 
        y: -6, 
        scale: 1.01,
        boxShadow: "0 10px 30px -10px var(--accent-color)"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Alias for convenience
export const FadeIn = SlideUpItem;
