"use client";
import { useEffect, useState } from "react";
import { Truck, Search, LogIn, ArrowRight, Activity, ShieldCheck, Gauge, Zap } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/Badge";
import api from "@/lib/api";
import dynamic from "next/dynamic";

const GPSMap = dynamic(() => import("@/components/GPSMap"), { ssr: false });

export default function ClientPortalPage() {
  const [vehicles, setVehicles] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/vehicles/?search=${search}`),
      api.get(`/missions/`)
    ]).then(([resVehicles, resMissions]) => {
      let vArr = Array.isArray(resVehicles.data) ? resVehicles.data : [];
      if (!search) vArr = vArr.filter(v => v.etat === "en mission" || v.etat === "disponible");
      setVehicles(vArr);
      setMissions(resMissions.data.filter(m => m.statut === "en cours"));
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="bg-[#050505] min-h-screen text-white scroll-smooth">
      {/* GLOBAL HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Truck size={20} className="text-[var(--accent)]" />
          <span className="text-xs font-black font-mono uppercase tracking-[0.4em]">TransFleet</span>
        </div>
        <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest hover:border-[var(--accent)] transition-all">
          <LogIn size={14} />
          Se connecter
        </Link>
      </header>

      {/* 1. SPLIT HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Panel */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Zap size={12} className="text-[var(--accent)]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Logistics OS v2.4</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase font-mono">
              Gestion de Flotte <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#2a6e5a] drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">Révolutionnaire</span>
            </h1>
            
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
              Optimisation du transit opérationnel, registres de maintenance avancés et simulation spatiale de trajectoires en temps réel.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#map" className="group flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--bg-deep)] text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] transition-all">
                Explorer la Flotte
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                En savoir plus
              </button>
            </div>
          </div>

          {/* Right Panel: Product Mockup */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-gradient-to-br from-white/10 to-transparent p-1 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(var(--accent-rgb),0.1)]">
              <div className="bg-[#0a0a0a] rounded-[22px] overflow-hidden aspect-video relative">
                {/* Mock Grid Mesh */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {/* Floating Glass Cards */}
                <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Activity size={14} className="text-[var(--accent)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Telemetry</span>
                  </div>
                  <p className="text-xl font-black font-mono">84 <span className="text-[10px] text-gray-500">KM/H</span></p>
                </div>

                <div className="absolute bottom-6 right-6 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <Gauge size={14} className="text-[#2a6e5a]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fuel Level</span>
                  </div>
                  <p className="text-xl font-black font-mono">42 <span className="text-[10px] text-gray-500">%</span></p>
                </div>

                {/* Abstract Vector Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                  <path d="M 0,100 Q 150,50 300,150 T 600,100" stroke="var(--accent)" strokeWidth="2" fill="none" className="animate-[dash_10s_linear_infinite]" style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }} />
                </svg>
              </div>
            </div>
            {/* Glow Orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--accent)] rounded-full blur-[120px] opacity-20" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#2a6e5a] rounded-full blur-[120px] opacity-20" />
          </div>
        </div>
      </section>

      {/* 2. MAP SECTION */}
      <section id="map" className="py-24 px-8 max-w-7xl mx-auto border-b border-white/5">
        <div className="mb-12">
          <p className="text-[10px] font-mono font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-2">01 / Suivi en temps réel</p>
          <h2 className="text-4xl font-black uppercase tracking-tight font-mono">Visualisation Globale</h2>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <GPSMap missions={missions} selectedMission={missions[0]} />
        </div>
      </section>

      {/* 3. FLEET SECTION */}
      <section id="fleet" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-[10px] font-mono font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-2">02 / Notre Flotte</p>
            <h2 className="text-4xl font-black uppercase tracking-tight font-mono">Inventaire Unités</h2>
          </div>
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--accent)] transition-all outline-none" placeholder="Filter by Unit ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 h-48 animate-pulse" />) :
            vehicles.map(v => (
              <div key={v.id} className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] hover:border-[var(--accent)] transition-all duration-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-[var(--accent)] text-xs font-black tracking-widest">{v.immatriculation}</span>
                  <Badge status={v.etat} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 font-mono">{v.marque}</h3>
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-8">{v.modele}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 text-gray-400">
                  <span className="text-[10px] font-black uppercase tracking-widest">Odometer</span>
                  <span className="text-sm font-black font-mono">{v.kilometrage.toLocaleString()} KM</span>
                </div>
              </div>
            ))
          }
        </div>
      </section>

      <style jsx global>{`
        @keyframes dash { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
