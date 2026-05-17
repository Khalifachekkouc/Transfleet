"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/Animations";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

const EMPTY_FORM = { nom: "", prenom: "", num_permis: "", disponible: true };

function DriverCard({ driver, onEdit, onDelete, index }) {
  const initials = `${driver.prenom[0] || ""}${driver.nom[0] || ""}`.toUpperCase();
  return (
    <FadeIn 
      index={index}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm p-4 transition-colors duration-200 flex flex-col justify-between aspect-square group"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-sm bg-[var(--bg-deep)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center font-black text-sm tracking-wider">
            {initials}
          </div>
          <Badge status={driver.disponible ? "disponible" : "en mission"} />
        </div>
        <h3 className="text-[var(--text)] font-bold text-sm mb-0.5 font-heading whitespace-normal break-words">
          {driver.prenom} {driver.nom}
        </h3>
        <p className="text-[var(--text-muted)] text-xs font-mono">Permis: {driver.num_permis}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 border border-[var(--border)] text-[var(--teal)] hover:bg-[var(--teal)] hover:text-[var(--bg-deep)] text-xs font-bold py-1.5 rounded-sm transition-all duration-200 flex justify-center items-center gap-1.5"
          onClick={() => onEdit(driver)}
        >
          <Pencil size={12} /> Modifier
        </button>
        <button
          className="w-8 flex-shrink-0 border border-[var(--border)] text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-sm transition-all duration-200 flex justify-center items-center"
          onClick={() => onDelete(driver)}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </FadeIn>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getDrivers().then((res) => setDrivers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (d) => {
    setEditing(d);
    setForm({ nom: d.nom, prenom: d.prenom, num_permis: d.num_permis, disponible: d.disponible });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      editing ? await updateDriver(editing.id, form) : await createDriver(form);
      setModalOpen(false);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteDriver(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="relative">
      <div className="page-header flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--accent)] font-semibold tracking-widest uppercase mb-1">Personnel</p>
          <h1 className="page-title">Chauffeurs</h1>
          <p className="page-subtitle">{drivers.length} chauffeur(s) enregistré(s)</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm p-4 aspect-square animate-pulse" />
          ))}
        </div>
      )}

      {!loading && drivers.length === 0 && (
        <div className="text-center py-24">
          <Users size={48} className="mx-auto text-[var(--border)] mb-4" />
          <p className="text-[var(--text-muted)]">Aucun chauffeur enregistré</p>
        </div>
      )}

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {drivers.map((d, i) => (
          <DriverCard key={d.id} index={i} driver={d} onEdit={openEdit} onDelete={setDeleteTarget} />
        ))}
      </StaggerContainer>

      {/* Create / Edit */}
      {modalOpen && (
        <Modal title={editing ? "Modifier le chauffeur" : "Nouveau chauffeur"} onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Prénom</label>
                <input className="input-dark" placeholder="Jean" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Nom</label>
                <input className="input-dark" placeholder="Dupont" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">N° Permis</label>
              <input className="input-dark font-mono" placeholder="123456789" value={form.num_permis} onChange={(e) => setForm({ ...form, num_permis: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, disponible: !form.disponible })}
                className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none
                  ${form.disponible ? "bg-[var(--teal)]" : "bg-[var(--border)]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 ${form.disponible ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm text-[var(--text)]">{form.disponible ? "Disponible" : "Indisponible"}</span>
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

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title="Confirmer la suppression" onClose={() => setDeleteTarget(null)}>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Supprimer <strong className="text-[var(--text)]">{deleteTarget.prenom} {deleteTarget.nom}</strong> ?
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
