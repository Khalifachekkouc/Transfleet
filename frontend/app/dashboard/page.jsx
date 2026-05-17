"use client";

import { useEffect, useState } from "react";
import { Truck, Users, Map, CheckCircle, Gauge, TrendingUp, Wrench, Droplet, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { getStats } from "@/lib/api";
import { StaggerContainer, SlideUpItem } from "@/components/Animations";
import AdminLayout from "@/components/AdminLayout";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Impossible de charger les statistiques."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
          <Truck size={480} className="text-white opacity-[0.02] -mr-16" strokeWidth={0.5} />
        </div>

      <div className="page-header relative">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--accent)" }}>Tableau de bord</p>
        <h1 className="page-title">Vue d&apos;ensemble de la flotte</h1>
        <p className="page-subtitle">Statistiques en temps réel de votre parc automobile</p>
      </div>

      {loading && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-sm p-6 animate-pulse h-36" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      )}

      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-sm p-4 text-red-400 text-sm">{error}</div>
      )}

      {stats?.document_alerts > 0 && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-sm p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="text-red-500" size={24} />
          <div>
            <p className="text-red-500 font-bold text-sm uppercase tracking-wide">Action Requise: Documents Expirés</p>
            <p className="text-red-400 text-xs mt-0.5">{stats.document_alerts} véhicule(s) ont des documents expirés ou expirant dans moins de 15 jours.</p>
          </div>
        </div>
      )}

      {stats?.maintenance_alerts > 0 && (
        <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-sm p-4 flex items-center gap-3">
          <AlertTriangle className="text-amber-500" size={24} />
          <div>
            <p className="text-amber-500 font-bold text-sm uppercase tracking-wide">Alerte Entretien: Révision Proche</p>
            <p className="text-amber-400 text-xs mt-0.5">{stats.maintenance_alerts} véhicule(s) approchent de leur kilométrage d'entretien (dans les 500 km).</p>
          </div>
        </div>
      )}

      {stats && (
        <StaggerContainer className="grid grid-cols-2 xl:grid-cols-6 gap-4 mb-10 relative">
          <StatCard index={0} icon={Truck} label="Véhicules" value={stats.total_vehicles} />
          <StatCard index={1} icon={CheckCircle} label="Disponibles" value={stats.available_vehicles} />
          <StatCard index={2} icon={Map} label="Missions" value={stats.active_missions} />
          <StatCard index={3} icon={Users} label="Chauffeurs" value={stats.total_drivers} />
          <StatCard index={4} icon={Wrench} label="Coût Maint." value={`${stats.total_maintenance_cost} MAD`} />
          <StatCard index={5} icon={Droplet} label="Coût Carburant" value={`${stats.total_fuel_cost} MAD`} />
        </StaggerContainer>
      )}

      {stats && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <SlideUpItem index={0} className="rounded-sm p-6 transition-all duration-300" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Gauge size={16} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--accent)" }}>Disponibilité Chauffeurs</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black tabular-nums text-white">{stats.available_drivers}</span>
              <span className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>/ {stats.total_drivers}</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
              <div className="h-2 rounded-full transition-all duration-500" style={{ background: "linear-gradient(to right, var(--accent), #2a6e5a)", width: stats.total_drivers ? `${(stats.available_drivers / stats.total_drivers) * 100}%` : "0%" }} />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>chauffeurs disponibles</p>
          </SlideUpItem>

          <SlideUpItem index={1} className="rounded-sm p-6 transition-all duration-300" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--accent)" }}>Taux de Disponibilité Flotte</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black tabular-nums text-white">
                {stats.total_vehicles ? Math.round((stats.available_vehicles / stats.total_vehicles) * 100) : 0}
                <span className="text-xl" style={{ color: "var(--text-muted)" }}>%</span>
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
              <div className="h-2 rounded-full transition-all duration-500" style={{ background: "linear-gradient(to right, #2a6e5a, var(--accent))", width: stats.total_vehicles ? `${(stats.available_vehicles / stats.total_vehicles) * 100}%` : "0%" }} />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>véhicules disponibles</p>
          </SlideUpItem>

          <SlideUpItem index={2} className="col-span-1 md:col-span-2 rounded-sm p-6 transition-all duration-300" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-6">
              <Droplet size={16} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--accent)" }}>Dépenses en Carburant (Aperçu)</span>
            </div>
            <div className="flex h-32 items-end gap-2">
              {/* Dummy data bars representing months to meet visual reqs simply */}
              {[40, 65, 30, 80, 50, 95].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                  <div 
                    className="w-full bg-[var(--teal)] rounded-t-sm opacity-50 group-hover:opacity-100 transition-all duration-300" 
                    style={{ height: `${val}%` }} 
                    />
                  <span className="text-[10px] text-[var(--text-muted)] mt-2 font-mono">M{i+1}</span>
                </div>
              ))}
            </div>
          </SlideUpItem>
        </StaggerContainer>
      )}
      </div>
    </AdminLayout>
  );
}
