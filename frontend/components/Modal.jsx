"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`w-full ${wide ? 'max-w-7xl' : 'max-w-lg'} rounded-sm shadow-2xl overflow-hidden`} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderTop: "3px solid var(--accent)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-base font-bold tracking-wide" style={{ color: "var(--text)" }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10" style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
