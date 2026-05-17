"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Truck } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/Animations";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

const ETAT_OPTIONS = ["disponible", "en mission", "en panne", "en maintenance", "archivé"];

const EMPTY_FORM = {
  immatriculation: "",
  marque: "",
  modele: "",
  etat: "disponible",
  kilometrage: 0,
  date_assurance: "",
  date_visite_technique: "",
  date_vignette: "",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, obj = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = (q = "") => {
    setLoading(true);
    getVehicles(q)
      .then((res) => setVehicles(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      immatriculation: v.immatriculation,
      marque: v.marque,
      modele: v.modele,
      etat: v.etat,
      kilometrage: v.kilometrage,
      date_assurance: v.date_assurance || "",
      date_visite_technique: v.date_visite_technique || "",
      date_vignette: v.date_vignette || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateVehicle(editing.id, form);
      } else {
        await createVehicle(form);
      }
      setModalOpen(false);
      load(search);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteVehicle(deleteTarget.id);
    setDeleteTarget(null);
    load(search);
  };
  
  return (
    <AdminLayout>
      <div className="relative">
      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--accent)] font-semibold tracking-widest uppercase mb-1">Flotte</p>
          <h1 className="page-title">Véhicules</h1>
          <p className="page-subtitle">{vehicles.length} véhicule(s) enregistré(s)</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
        <input
          className="input-dark pl-9"
          placeholder="Rechercher par immat. ou marque..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {loading && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm p-4 aspect-square animate-pulse" />
        ))}
        
        {!loading && vehicles.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Truck size={40} className="mx-auto text-[var(--border)] mb-3" />
            <p className="text-[var(--text-muted)] text-sm">Aucun véhicule trouvé</p>
          </div>
        )}

        {!loading && vehicles.map((v, i) => (
          <FadeIn
            key={v.id}
            index={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm p-4 transition-colors duration-200 flex flex-col justify-between aspect-square group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono font-bold text-[var(--accent)] text-sm">{v.immatriculation}</span>
                <Badge status={v.etat} />
              </div>
              <h3 className="text-[var(--text)] font-bold text-sm mb-0.5 font-heading whitespace-normal break-words">{v.marque}</h3>
              <p className="text-[var(--text-muted)] text-xs font-mono">{v.modele}</p>
              <p className={`text-xs tabular-nums mt-1 ${v.maintenance_due ? "text-amber-500 font-bold" : "text-[var(--text-muted)]"}`}>
                {v.kilometrage.toLocaleString()} km
              </p>
              {(() => {
                const today = new Date();
                const warning = new Date();
                warning.setDate(today.getDate() + 15);
                const isWarning = (d) => !d || new Date(d) < warning;
                const showBadge = isWarning(v.date_assurance) || isWarning(v.date_visite_technique) || isWarning(v.date_vignette);
                return showBadge ? (
                  <div className="mt-3 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-sm inline-block">
                    Docs Expirés / &lt;15j
                  </div>
                ) : (
                  <div className="mt-3 px-2 py-1 bg-[var(--teal)]/10 border border-[var(--teal)]/20 text-[var(--teal)] text-[10px] font-bold uppercase rounded-sm inline-block">
                    Docs À Jour
                  </div>
                );
              })()}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 border border-[var(--border)] text-[var(--teal)] hover:bg-[var(--teal)] hover:text-[var(--bg-deep)] text-xs font-bold py-1.5 rounded-sm transition-all duration-200 flex justify-center items-center gap-1.5"
                onClick={() => openEdit(v)}
              >
                <Pencil size={12} /> Modifier
              </button>
              <button
                className="w-8 flex-shrink-0 border border-[var(--border)] text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-sm transition-all duration-200 flex justify-center items-center"
                onClick={() => setDeleteTarget(v)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </FadeIn>
        ))}
      </StaggerContainer>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editing ? "Modifier le véhicule" : "Nouveau véhicule"}
          onClose={() => setModalOpen(false)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Immatriculation</label>
                <input className="input-dark font-mono" placeholder="AA-123-BB" value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Marque</label>
                <input className="input-dark" placeholder="Renault" value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Modèle</label>
                <input className="input-dark" placeholder="Kangoo" value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">État</label>
              <select className="select-dark" value={form.etat} onChange={(e) => setForm({ ...form, etat: e.target.value })}>
                {ETAT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Kilométrage</label>
              <input type="number" className="input-dark" value={form.kilometrage} onChange={(e) => setForm({ ...form, kilometrage: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-semibold uppercase">Assurance</label>
                <input type="date" className="input-dark text-xs" value={form.date_assurance} onChange={(e) => setForm({ ...form, date_assurance: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-semibold uppercase">Visite Tech.</label>
                <input type="date" className="input-dark text-xs" value={form.date_visite_technique} onChange={(e) => setForm({ ...form, date_visite_technique: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-semibold uppercase">Vignette</label>
                <input type="date" className="input-dark text-xs" value={form.date_vignette} onChange={(e) => setForm({ ...form, date_vignette: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal title="Confirmer la suppression" onClose={() => setDeleteTarget(null)}>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Supprimer <strong className="text-[var(--text)]">{deleteTarget.immatriculation}</strong> ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <button className="btn-primary bg-red-600 hover:bg-red-500 flex-1" onClick={handleDelete}>
              <Trash2 size={14} /> Supprimer
            </button>
            <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Annuler</button>
          </div>
        </Modal>
      )}
      </div>
    </AdminLayout>
  );
}
