"use client";
import { useState, useEffect } from "react";
import { Palette, X, Check } from "lucide-react";

function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function lighten(hex, amount = 18) {
  const [r,g,b] = hexToRgb(hex);
  const c = (v) => Math.min(255, v + amount).toString(16).padStart(2,"0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

const ACCENTS = [
  { name:"Soft Gold",  value:"#D4AF37" },
  { name:"Mustard",    value:"#d97706" },
  { name:"Champagne",  value:"#E8D5B7" },
  { name:"Emerald",    value:"#10b981" },
  { name:"Violet",     value:"#8b5cf6" },
  { name:"Rose",       value:"#f43f5e" },
  { name:"Ocean",      value:"#0ea5e9" },
  { name:"Coral",      value:"#f97316" },
  { name:"Teal",       value:"#14b8a6" },
  { name:"Pink",       value:"#ec4899" },
];

const BACKGROUNDS = [
  { name:"Forest Dark",  value:"#0B130B" },
  { name:"Void",         value:"#050505" },
  { name:"Slate Night",  value:"#0F1115" },
  { name:"Pitch",        value:"#121212" },
  { name:"Navy Abyss",   value:"#0A0E14" },
  { name:"Carbon",       value:"#141414" },
  { name:"Obsidian",     value:"#0D0D0D" },
  { name:"Midnight",     value:"#111827" },
  { name:"Deep Forest",  value:"#080C08" },
  { name:"Charcoal",     value:"#1A1B1E" },
];

function applyAccent(hex) {
  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--accent-color", hex);
}
function applyBg(hex) {
  document.documentElement.style.setProperty("--bg-deep", hex);
  document.documentElement.style.setProperty("--bg-card", lighten(hex));
}

export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState("#d97706");
  const [bg, setBg] = useState("#0f1a14");

  useEffect(() => {
    const a = localStorage.getItem("tf-accent") || "#d97706";
    const b = localStorage.getItem("tf-bg") || "#0f1a14";
    setAccent(a); setBg(b);
    applyAccent(a); applyBg(b);
  }, []);

  const pickAccent = (c) => { setAccent(c.value); localStorage.setItem("tf-accent", c.value); applyAccent(c.value); };
  const pickBg     = (c) => { setBg(c.value);     localStorage.setItem("tf-bg", c.value);     applyBg(c.value); };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Personnaliser le thème"
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{
          background: "var(--bg-card)",
          border: "2px solid var(--accent)",
          color: "var(--accent)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        <Palette size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-md shadow-2xl"
            style={{ background:"var(--bg-card)", border:"1.5px solid var(--accent)", transition:"all 0.3s ease" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-white font-bold font-heading text-base">Personnaliser le Thème</h3>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">Choisissez votre style d'interface</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Section 1 – Accent */}
            <section className="mb-6">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-3">Couleur d'Accent</p>
              <div className="grid grid-cols-5 gap-3">
                {ACCENTS.map(c => (
                  <button
                    key={c.name} onClick={() => pickAccent(c)} title={c.name}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      outline: accent === c.value ? "3px solid white" : "none",
                      outlineOffset: "2px",
                      boxShadow: accent === c.value ? `0 0 12px ${c.value}` : "none",
                    }}
                  >
                    {accent === c.value && <Check size={14} strokeWidth={3} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[var(--border)] mb-6" />

            {/* Section 2 – Background */}
            <section className="mb-6">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-3">Thème de Fond</p>
              <div className="grid grid-cols-5 gap-3">
                {BACKGROUNDS.map(c => (
                  <button
                    key={c.name} onClick={() => pickBg(c)} title={c.name}
                    className="w-12 h-12 rounded-md flex items-center justify-center border transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      borderColor: bg === c.value ? "white" : "rgba(255,255,255,0.15)",
                      boxShadow: bg === c.value ? "0 0 10px rgba(255,255,255,0.3)" : "none",
                    }}
                  >
                    {bg === c.value && <Check size={14} strokeWidth={3} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Preview */}
            <div className="pt-4 border-t border-[var(--border)]">
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2">Aperçu</p>
              <div className="flex gap-2 items-center">
                <div className="flex-1 h-8 rounded-sm border-2" style={{ borderColor: accent, backgroundColor: bg }} />
                <div className="h-8 px-4 rounded-sm text-xs font-bold flex items-center" style={{ backgroundColor: accent, color: bg }}>Bouton</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
