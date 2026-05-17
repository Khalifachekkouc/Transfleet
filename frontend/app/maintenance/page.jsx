"use client";

import { useEffect, useState } from "react";
import { Wrench, Plus, Trash2, Download, Eye } from "lucide-react";
import Modal from "@/components/Modal";
import { getMaintenances, createMaintenance, updateMaintenance, deleteMaintenance, getVehicles } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

const EMPTY_FORM = {
  vehicule: "",
  type_intervention: "",
  date_maintenance: new Date().toISOString().split('T')[0],
  cout: 0,
  pieces_rechange: "",
  prestataire_garage: "",
  notes: ""
};

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, vRes] = await Promise.all([getMaintenances(), getVehicles()]);
      setMaintenances(mRes.data);
      setVehicles(vRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createMaintenance(form);
      setModalOpen(false);
      loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMaintenance(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  };

  const exportPDF = () => {
    import("jspdf").then(({ default: jsPDF }) => {
      import("jspdf-autotable").then(({ default: autoTable }) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("TransFleet - Rapport de Maintenance", 14, 22);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
        
        autoTable(doc, {
          startY: 36,
          head: [["Véhicule", "Intervention", "Pièces", "Prestataire", "Date", "Coût (MAD)"]],
          body: maintenances.map(m => [
            m.vehicule_detail?.immatriculation || "—",
            m.type_intervention,
            m.pieces_rechange || "—",
            m.prestataire_garage || "—",
            m.date_maintenance,
            m.cout
          ]),
        });
        doc.save("TransFleet_Maintenance.pdf");
      });
    });
  };

  return (
    <AdminLayout>
      <div className="relative">
      <div className="page-header flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--accent)] font-semibold tracking-widest uppercase mb-1">Entretien</p>
          <h1 className="page-title">Maintenance</h1>
          <p className="page-subtitle">{maintenances.length} intervention(s) enregistrée(s)</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-2 border border-[var(--border)]" onClick={exportPDF} disabled={loading || maintenances.length === 0}>
            <Download size={16} /> Télécharger Rapport PDF
          </button>
          <button className="btn-primary" onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }}>
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#0f1a14]/50 text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Véhicule</th>
                <th className="px-4 py-3">Intervention</th>
                <th className="px-4 py-3 hidden md:table-cell">Pièces</th>
                <th className="px-4 py-3 hidden md:table-cell">Prestataire</th>
                <th className="px-4 py-3">Coût</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
              {maintenances.map((m) => (
                <tr key={m.id} className="hover:bg-[#0f1a14]/30 transition-colors">
                  <td className="px-4 py-3 font-mono">{m.date_maintenance}</td>
                  <td className="px-4 py-3 font-semibold">{m.vehicule_detail?.immatriculation}</td>
                  <td className="px-4 py-3">{m.type_intervention}</td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-[150px] truncate" title={m.pieces_rechange}>{m.pieces_rechange || "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-[150px] truncate" title={m.prestataire_garage}>{m.prestataire_garage || "—"}</td>
                  <td className="px-4 py-3 font-mono text-[var(--teal)]">{m.cout} MAD</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setViewTarget(m)} className="text-[var(--teal)] hover:text-[var(--accent)] transition-colors">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(m)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {maintenances.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-[var(--text-muted)]">Aucune maintenance enregistrée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title="Nouvelle intervention" onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Véhicule</label>
              <select className="select-dark" value={form.vehicule} onChange={(e) => setForm({ ...form, vehicule: e.target.value })}>
                <option value="">Sélectionner</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.immatriculation}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Intervention</label>
              <input className="input-dark" placeholder="Vidange" value={form.type_intervention} onChange={(e) => setForm({ ...form, type_intervention: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Date</label>
                <input type="date" className="input-dark font-mono" value={form.date_maintenance} onChange={(e) => setForm({ ...form, date_maintenance: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Coût (MAD)</label>
                <input type="number" className="input-dark font-mono" value={form.cout} onChange={(e) => setForm({ ...form, cout: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Pièces de rechange</label>
                <input className="input-dark" placeholder="Ex: Filtre à huile" value={form.pieces_rechange} onChange={(e) => setForm({ ...form, pieces_rechange: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Prestataire/Garage</label>
                <input className="input-dark" placeholder="Ex: Garage Renault" value={form.prestataire_garage} onChange={(e) => setForm({ ...form, prestataire_garage: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Notes</label>
              <textarea className="input-dark resize-none h-20" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button className="btn-primary flex-1" onClick={handleSave} disabled={saving || !form.vehicule}>Enregistrer</button>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Supprimer" onClose={() => setDeleteTarget(null)}>
          <p className="text-[var(--text-muted)] text-sm mb-6">Confirmer la suppression ?</p>
          <div className="flex gap-3">
            <button className="btn-primary bg-red-600 hover:bg-red-500 flex-1" onClick={handleDelete}><Trash2 size={14} /> Supprimer</button>
            <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {viewTarget && (
        <Modal title="Détails de l'intervention" onClose={() => setViewTarget(null)}>
          <div className="space-y-4 text-sm text-[var(--text)]">
            <div className="grid grid-cols-2 gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Véhicule</p>
                <p className="font-bold">{viewTarget.vehicule_detail?.immatriculation}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Date</p>
                <p className="font-mono">{viewTarget.date_maintenance}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Intervention</p>
              <p>{viewTarget.type_intervention}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Pièces remplacées</p>
                <p>{viewTarget.pieces_rechange || "Aucune"}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Prestataire</p>
                <p>{viewTarget.prestataire_garage || "Non spécifié"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Notes</p>
              <p className="bg-[#0f1a14]/50 p-3 rounded-sm border border-[var(--border)]">{viewTarget.notes || "Aucune note."}</p>
            </div>
            <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <p className="text-xs text-[var(--text-muted)] uppercase">Coût Total</p>
              <p className="text-[var(--teal)] font-mono font-bold text-lg">{viewTarget.cout} MAD</p>
            </div>
          </div>
        </Modal>
      )}
      </div>
    </AdminLayout>
  );
}
