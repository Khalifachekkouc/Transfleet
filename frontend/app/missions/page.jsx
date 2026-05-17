"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Map, Truck, Users, Download } from "lucide-react";
import { SlideUpItem, StaggerContainer } from "@/components/Animations";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import AdminLayout from "@/components/AdminLayout";
import { getMissions, createMission, updateMission, deleteMission, getVehicles, getDrivers } from "@/lib/api";
import dynamic from "next/dynamic";
const GPSMap = dynamic(() => import("@/components/GPSMap"), { ssr: false });

const CITY_OPTIONS = [
  "Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès", "Meknès", "Oujda", 
  "Kenitra", "Tétouan", "Safi", "Temara", "Inezgane", "Mohammedia", "Laâyoune", 
  "Khouribga", "Béni Mellal", "El Jadida", "Taza", "Nador", "Settat", "Larache", 
  "Ksar El Kebir", "Khémisset", "Berrechid", "Guelmim", "Midelt", "Chefchaouen", 
  "Asilah", "El Hajeb"
];
const STATUT_OPTIONS = ["planifiée", "en cours", "terminée", "annulée"];
const EMPTY_FORM = { 
  vehicle: "", 
  driver: "", 
  description: "", 
  statut: "planifiée", 
  consommation_litres: 0, 
  cout_carburant: 0, 
  km_depart: 0, 
  km_arrivee: 0,
  ville_depart: "Casablanca",
  ville_arrivee: "Tanger"
};

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (mission) => {
    setEditTarget(mission);
    setForm({
      vehicle: mission.vehicle,
      driver: mission.driver,
      description: mission.description,
      statut: mission.statut,
      consommation_litres: mission.consommation_litres || 0,
      cout_carburant: mission.cout_carburant || 0,
      km_depart: mission.km_depart || 0,
      km_arrivee: mission.km_arrivee || 0,
      ville_depart: mission.ville_depart || "Casablanca",
      ville_arrivee: mission.ville_arrivee || "Tanger",
    });
    setModalOpen(true);
  };

  const load = (statut = "") => {
    setLoading(true);
    getMissions(statut).then((res) => {
      setMissions(res.data);
      if (!selectedMission && res.data.length > 0) {
        const active = res.data.find(m => m.statut === "en cours");
        setSelectedMission(active || res.data[0]);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getVehicles().then((res) => setVehicles(res.data.filter((v) => v.etat === "disponible")));
    getDrivers().then((res) => setDrivers(res.data.filter((d) => d.disponible)));
  }, []);

  useEffect(() => { load(filter); }, [filter]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTarget) {
        await updateMission(editTarget.id, form);
      } else {
        await createMission(form);
      }
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setEditTarget(null);
      load(filter);
    } finally { setSaving(false); }
  };

  const handleStatutChange = async (mission, statut) => {
    await updateMission(mission.id, { ...mission, vehicle: mission.vehicle, driver: mission.driver, statut });
    load(filter);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMission(deleteTarget.id);
    setDeleteTarget(null);
    load(filter);
  };

  const exportPDF = () => {
    import("jspdf").then(({ default: jsPDF }) => {
      import("jspdf-autotable").then(({ default: autoTable }) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("TransFleet - Rapport des Missions", 14, 22);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
        
        autoTable(doc, {
          startY: 36,
          head: [["ID", "Description", "Véhicule", "Chauffeur", "Distance (km)", "Carburant (L)", "Coût (MAD)", "Statut"]],
          body: missions.map(m => [
            m.id.slice(0, 8),
            m.description || "—",
            m.vehicle_detail?.immatriculation || "—",
            m.driver_detail ? `${m.driver_detail.prenom} ${m.driver_detail.nom}` : "—",
            m.distance_parcourue || 0,
            m.consommation_litres,
            m.cout_carburant,
            m.statut
          ]),
        });
        doc.save("TransFleet_Missions.pdf");
      });
    });
  };

  return (
    <AdminLayout>
      <div className="relative">
      <div className="page-header flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--accent)] font-semibold tracking-widest uppercase mb-1">Opérations</p>
          <h1 className="page-title">Missions</h1>
          <p className="page-subtitle">{missions.length} mission(s)</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-2 border border-[var(--border)]" onClick={exportPDF} disabled={loading || missions.length === 0}>
            <Download size={16} /> Télécharger Rapport PDF
          </button>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={16} /> Nouvelle mission
          </button>
        </div>
      </div>

      {/* Map Header */}
      <div className="mb-8">
        <GPSMap missions={missions} selectedMission={selectedMission} />
      </div>

      {/* Statut filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["", ...STATUT_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-none text-xs font-semibold border transition-all duration-200
              ${filter === s
                ? "bg-[var(--teal)] border-[var(--teal)] text-[var(--bg-deep)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--teal)] hover:text-[var(--text)]"
              }`}
          >
            {s === "" ? "Toutes" : s}
          </button>
        ))}
      </div>

      {/* Mission cards */}
      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-sm p-4 h-16 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && missions.length === 0 && (
        <div className="text-center py-24">
          <Map size={48} className="mx-auto text-[var(--border)] mb-4" />
          <p className="text-[var(--text-muted)]">Aucune mission trouvée</p>
        </div>
      )}

      <StaggerContainer className="flex flex-col gap-2">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider border-b border-[var(--border)]">
          <div className="col-span-1">ID</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-2">Véhicule</div>
          <div className="col-span-2">Chauffeur</div>
          <div className="col-span-1 text-right">Performances</div>
          <div className="col-span-1 flex justify-center">Statut</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {missions.map((m, i) => (
          <SlideUpItem
            key={m.id}
            index={i}
            onClick={() => setSelectedMission(m)}
            className={`bg-[var(--bg-card)] border rounded-sm p-4 transition-all duration-300 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 group cursor-pointer
              ${selectedMission?.id === m.id 
                ? "border-l-4 border-l-[var(--accent)] border-y-[var(--border)] border-r-[var(--border)] bg-[#0f1a14] shadow-lg scale-[1.005]" 
                : "border-[var(--border)] hover:border-[var(--accent)] opacity-80 hover:opacity-100"}`}
          >
            <div className="col-span-1 text-xs text-[var(--text-muted)] font-mono">#{String(m.id).slice(0, 8)}</div>
            <div className="col-span-3 text-[var(--text)] text-sm font-medium whitespace-normal break-words">{m.description || "—"}</div>
            
            <div className="col-span-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              {m.vehicle_detail && (
                <>
                  <Truck size={12} className="text-[var(--teal)] shrink-0" />
                  <span className="whitespace-normal break-words">{m.vehicle_detail.immatriculation}</span>
                </>
              )}
            </div>

            <div className="col-span-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              {m.driver_detail && (
                <>
                  <Users size={12} className="text-[var(--accent)] shrink-0" />
                  <span className="whitespace-normal break-words">{m.driver_detail.prenom} {m.driver_detail.nom}</span>
                </>
              )}
            </div>

            <div className="col-span-1 flex flex-col lg:items-end text-xs font-mono">
              <span className="text-[var(--teal)] font-bold">{m.distance_parcourue} km</span>
              <span className="text-[var(--text-muted)] mt-0.5">{m.consommation_litres} L</span>
              <span className="text-[var(--accent)] mt-0.5">{m.cout_carburant} MAD</span>
            </div>

            <div className="col-span-1 flex lg:justify-center items-center">
              <Badge status={m.statut} />
            </div>

            <div className="col-span-2 flex lg:justify-end gap-2 mt-2 lg:mt-0">
              <button
                className="border border-[var(--border)] text-[var(--teal)] hover:bg-[var(--teal)] hover:text-[var(--bg-deep)] px-3 py-1.5 rounded-sm transition-all duration-200 flex items-center gap-1.5 text-xs font-bold"
                onClick={() => openEdit(m)}
              >
                <Pencil size={12} /> Modifier
              </button>
              <button
                className="w-8 h-8 flex-shrink-0 border border-[var(--border)] text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-sm transition-all duration-200 flex justify-center items-center"
                onClick={() => setDeleteTarget(m)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </SlideUpItem>
        ))}
      </StaggerContainer>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal 
          wide 
          title={editTarget ? "Modifier la mission" : "Nouvelle mission"} 
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Form */}
            <div className="lg:w-[40%] space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Véhicule</label>
                  <select className="select-dark" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                    <option value="">Sélectionner</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.immatriculation}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Chauffeur</label>
                  <select className="select-dark" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })}>
                    <option value="">Sélectionner</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.prenom} {d.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Ville Départ</label>
                  <input 
                    list="cities" 
                    className="input-dark" 
                    placeholder="Chercher..." 
                    value={form.ville_depart} 
                    onChange={(e) => setForm({ ...form, ville_depart: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Ville Arrivée</label>
                  <input 
                    list="cities" 
                    className="input-dark" 
                    placeholder="Chercher..." 
                    value={form.ville_arrivee} 
                    onChange={(e) => setForm({ ...form, ville_arrivee: e.target.value })} 
                  />
                </div>
                <datalist id="cities">
                  {CITY_OPTIONS.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Description</label>
                <textarea
                  className="input-dark resize-none h-20 text-sm"
                  placeholder="Détails..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">KM Départ</label>
                  <input type="number" className="input-dark font-mono text-sm" value={form.km_depart} onChange={(e) => setForm({ ...form, km_depart: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">KM Arrivée</label>
                  <input type="number" className="input-dark font-mono text-sm" value={form.km_arrivee} onChange={(e) => setForm({ ...form, km_arrivee: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Carburant (L)</label>
                  <input type="number" className="input-dark font-mono text-sm" value={form.consommation_litres} onChange={(e) => setForm({ ...form, consommation_litres: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Coût (MAD)</label>
                  <input type="number" className="input-dark font-mono text-sm" value={form.cout_carburant} onChange={(e) => setForm({ ...form, cout_carburant: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-semibold uppercase tracking-wider">Statut</label>
                <select className="select-dark" value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                  {STATUT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                <button className="btn-primary flex-1" onClick={handleSave} disabled={saving || !form.vehicle || !form.driver}>
                  {saving ? "..." : (editTarget ? "Enregistrer" : "Créer")}
                </button>
                <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              </div>
            </div>

            {/* Right Column: Preview Map */}
            <div className="lg:w-[60%] min-h-[400px] lg:min-h-full rounded-xl overflow-hidden border border-[var(--accent)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]">
              <GPSMap mission={{ ...form, vehicle_detail: vehicles.find(v => v.id === form.vehicle) }} />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title="Confirmer la suppression" onClose={() => setDeleteTarget(null)}>
          <p className="text-[#64748b] text-sm mb-6">
            Supprimer la mission <strong className="text-[#f1f5f9] font-mono">#{deleteTarget.id.slice(0, 8)}</strong> ?
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
