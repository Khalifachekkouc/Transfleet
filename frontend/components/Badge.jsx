const STATUS_STYLES = {
  disponible: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  "en mission": "bg-[#E8A830]/15 text-[#E8A830] border border-[#E8A830]/25",
  "en panne": "bg-red-500/15 text-red-400 border border-red-500/25",
  "en maintenance": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  "archivé": "bg-gray-500/15 text-gray-400 border border-gray-500/25",
  "planifiée": "bg-[#E8A830]/15 text-[#E8A830] border border-[#E8A830]/25",
  "en cours": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  "terminée": "bg-gray-500/15 text-gray-400 border border-gray-500/25",
  "annulée": "bg-red-500/15 text-red-400 border border-red-500/25",
};

export default function Badge({ status }) {
  const styles = STATUS_STYLES[status] || "bg-gray-500/15 text-gray-400 border border-gray-500/25";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-semibold ${styles} tracking-wide transition-all duration-300`}>
      {status}
    </span>
  );
}
