"use client";
import AdminLayout from "@/components/AdminLayout";
import { Truck, Map, Users, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GestionnairePortal() {
  return (
    <AdminLayout>
      <div className="relative">
        <div className="page-header relative">
          <p className="text-xs font-bold tracking-widest uppercase mb-1 text-[var(--accent)]">Espace Opérationnel</p>
          <h1 className="page-title text-3xl font-black">Portail Gestionnaire</h1>
          <p className="page-subtitle text-gray-500">Gérez les flux, les véhicules et les ressources humaines de la flotte.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/vehicles" className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[var(--accent)] transition-all">
            <Truck className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Gestion Flotte</h3>
            <p className="text-sm text-gray-500 mb-6 text-balance">Inventaire complet, état des véhicules et suivi kilométrique.</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--accent)]">
              Accéder <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/missions" className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[var(--accent)] transition-all">
            <Map className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Suivi Missions</h3>
            <p className="text-sm text-gray-500 mb-6 text-balance">Visualisation en temps réel des trajets et affectations.</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--accent)]">
              Accéder <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/drivers" className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[var(--accent)] transition-all">
            <Users className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Conducteurs</h3>
            <p className="text-sm text-gray-500 mb-6 text-balance">Disponibilité, permis et affectations du personnel.</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--accent)]">
              Accéder <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/maintenance" className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[var(--accent)] transition-all">
            <Wrench className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Maintenance</h3>
            <p className="text-sm text-gray-500 mb-6 text-balance">Historique des interventions et planification garage.</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--accent)]">
              Accéder <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
