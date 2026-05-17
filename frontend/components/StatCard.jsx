import { motion } from "framer-motion";

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = "blue",
  trend,
  index = 0
}) {
  const colorMap = {
    blue: "bg-[var(--teal)]/10 text-[var(--teal)] shadow-[var(--teal)]/20",
    emerald: "bg-[var(--teal)]/10 text-[var(--teal)] shadow-[var(--teal)]/20",
    amber: "bg-[var(--accent)]/10 text-[var(--accent)] shadow-[var(--accent)]/20",
    indigo: "bg-[var(--accent)]/10 text-[var(--accent)] shadow-[var(--accent)]/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 15, delay: index * 0.05 }}
      whileHover={{ 
        y: -6, 
        scale: 1.01,
        boxShadow: "0 10px 30px -10px var(--accent-color)"
      }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm p-6 transition-colors duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-sm flex items-center justify-center ${colorMap[color]} shadow-lg`}
        >
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className="text-xs text-[var(--text-muted)] bg-white/5 px-2 py-1 rounded-sm">
            {trend}
          </span>
        )}
      </div>
      <p className="text-[var(--text-muted)] text-sm font-medium tracking-wide mb-1 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-4xl font-black text-[var(--text)] tabular-nums">{value}</p>
    </motion.div>
  );
}
