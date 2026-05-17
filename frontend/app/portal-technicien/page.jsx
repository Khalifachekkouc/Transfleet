"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wrench, LogOut, Activity, Clock, Plus, CheckCircle2 } from "lucide-react";
import { getVehicles, getMaintenances, createMaintenance } from "@/lib/api";
import ThemeCustomizer from "@/components/ThemeCustomizer";

export default function TechnicienPortal() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    vehicule: "", 
    type_intervention: "", 
    cout: 0, 
    date_maintenance: new Date().toISOString().split('T')[0],
    pieces_rechange: "",
    prestataire_garage: "",
    notes: ""
  });

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "technicien") {
      router.push("/login");
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vRes, mRes] = await Promise.all([getVehicles(), getMaintenances()]);
      setVehicles(vRes.data);
      setHistory(mRes.data.slice(0, 5));
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMaintenance(form);
    setForm({ 
      vehicule: "", 
      type_intervention: "", 
      cout: 0, 
      date_maintenance: new Date().toISOString().split('T')[0],
      pieces_rechange: "",
      prestataire_garage: "",
      notes: ""
    });
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <ThemeCustomizer />
      
      {/* Mini Header */}
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <Wrench className="text-[#050505]" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest font-mono">Portail Technique</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Maintenance Engineering</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all">
          <LogOut size={14} /> Déconnexion
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Plus size={16} className="text-[var(--accent)]" /> 
              Nouvelle Intervention
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Véhicule</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none"
                    value={form.vehicule}
                    onChange={(e) => setForm({...form, vehicule: e.target.value})}
                    required
                  >
                    <option value="" className="bg-[#111] text-white">Sélectionner</option>
                    {vehicles.map(v => <option key={v.id} value={v.id} className="bg-[#111] text-white">{v.immatriculation}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none font-mono"
                    value={form.date_maintenance}
                    onChange={(e) => setForm({...form, date_maintenance: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Type d'Intervention</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none"
                    placeholder="Ex: Vidange, Pneus..."
                    value={form.type_intervention}
                    onChange={(e) => setForm({...form, type_intervention: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Coût (MAD)</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none font-mono"
                    value={form.cout}
                    onChange={(e) => setForm({...form, cout: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Pièces de rechange</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none"
                    placeholder="Ex: Filtre à huile..."
                    value={form.pieces_rechange}
                    onChange={(e) => setForm({...form, pieces_rechange: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Prestataire / Garage</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none"
                    placeholder="Ex: Garage Maghreb..."
                    value={form.prestataire_garage}
                    onChange={(e) => setForm({...form, prestataire_garage: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Notes</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none min-h-[100px]"
                  placeholder="Détails supplémentaires..."
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-[var(--accent)] text-[#050505] font-black uppercase tracking-widest py-4 rounded-xl text-xs hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all">
                Enregistrer l'Intervention
              </button>
            </form>
          </section>

        </div>

        <aside className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Clock size={16} className="text-gray-500" /> 
              Derniers Logs
            </h2>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
              {history.map((log, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-[#050505] border border-white/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-[var(--accent)]" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono mb-1">{log.date_maintenance}</p>
                  <p className="text-xs font-bold text-white mb-0.5">{log.vehicule_detail?.immatriculation}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{log.type_intervention}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
