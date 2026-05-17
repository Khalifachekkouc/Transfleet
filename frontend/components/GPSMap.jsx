"use client";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { publicApi } from "@/lib/api";

const NEON_COLORS = ["#00f2ff", "#39ff14", "#ff007f", "#ff6600", "#bc13fe", "#ffff00"];

const createMarkerIcon = (color, isSelected) => L.divIcon({
  className: "custom-marker",
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
      <div style="width: ${isSelected ? '14px' : '10px'}; height: ${isSelected ? '14px' : '10px'}; background: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 20px ${color}; transition: all 0.3s ease; z-index: 2; cursor: pointer;"></div>
      ${isSelected ? `<div style="position: absolute; width: 30px; height: 30px; background: ${color}; opacity: 0.3; border-radius: 50%; animation: pulse 2s infinite; z-index: 1;"></div>` : ''}
    </div>
    <style>
      @keyframes pulse { 0% { transform: scale(0.5); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
    </style>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898], "Rabat": [34.0209, -6.8416], "Marrakech": [31.6295, -7.9811],
  "Tanger": [35.7595, -5.8340], "Agadir": [30.4278, -9.5981], "Fès": [34.0181, -5.0078],
  "Meknès": [33.8935, -5.5473], "Oujda": [34.6805, -1.9076], "Kenitra": [34.2610, -6.5802],
  "Tétouan": [35.5889, -5.3626], "Safi": [32.2994, -9.2372], "Temara": [33.9267, -6.9123],
  "Inezgane": [30.3658, -9.5331], "Mohammedia": [33.6835, -7.3848], "Laâyoune": [27.1500, -13.2000],
  "Khouribga": [32.8833, -6.9167], "Béni Mellal": [32.3372, -6.3498], "El Jadida": [33.2333, -8.5000],
  "Taza": [34.2167, -4.0167], "Nador": [35.1667, -2.9333], "Settat": [33.0000, -7.6167],
  "Larache": [35.1833, -6.1500], "Ksar El Kebir": [35.0000, -5.9000], "Khémisset": [33.8167, -6.0667],
  "Berrechid": [33.2667, -7.5833], "Guelmim": [28.9833, -10.0667], "Midelt": [32.6833, -4.7333],
  "Chefchaouen": [35.1667, -5.2667], "Asilah": [35.4667, -6.0333], "El Hajeb": [33.6833, -5.3667],
};

function MissionRoute({ mission, isSelected, color }) {
  const [route, setRoute] = useState([]);
  const [pos, setPos] = useState(null);
  const [idx, setIdx] = useState(0);
  const map = useMap();

  const getCoords = (city, description) => {
    const findInDict = (name) => {
      if (!name) return null;
      const n = name.trim().toLowerCase();
      return CITY_COORDS[name.trim()] || Object.entries(CITY_COORDS).find(([k]) => k.toLowerCase() === n)?.[1];
    };
    let coords = findInDict(city);
    if (!coords && description) {
      for (const name of Object.keys(CITY_COORDS)) {
        if (description.toLowerCase().includes(name.toLowerCase())) return CITY_COORDS[name];
      }
    }
    return coords;
  };

  const start = getCoords(mission.ville_depart, mission.description);
  const end = getCoords(mission.ville_arrivee, mission.description);

  useEffect(() => {
    if (!start || !end) return;
    fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`)
      .then(r => r.json()).then(data => {
        if (data.routes?.[0]) {
          const pts = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRoute(pts);
          setIdx(0);
          setPos(mission.statut === "terminée" ? pts[pts.length - 1] : pts[0]);
          if (isSelected && pts.length > 0 && map) {
            try {
              map.flyToBounds(L.latLngBounds(pts), { padding: [80, 80], duration: 1.5 });
            } catch (e) {
              console.warn("Map not ready for flyToBounds");
            }
          }
        }
      });
  }, [mission.ville_depart, mission.ville_arrivee, isSelected]);

  useEffect(() => {
    if (mission.statut !== "en cours" || route.length === 0) return;
    const interval = setInterval(() => setIdx(p => (p + 1 >= route.length ? 0 : p + 1)), 120);
    return () => clearInterval(interval);
  }, [mission.statut, route]);

  useEffect(() => {
    if (mission.statut === "en cours" && route[idx]) setPos(route[idx]);
  }, [idx, route]);

  if (!pos) return null;

  return (
    <>
      <Polyline positions={route} color={color} weight={isSelected ? 5 : 3} opacity={isSelected ? 1 : 0.6} />
      <Marker position={pos} icon={createMarkerIcon(color, isSelected)}>
        <Popup className="dark-popup">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-2xl min-w-[160px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">#{String(mission.id).slice(0, 8)}</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }}></div>
            </div>
            <p className="text-xs font-bold text-white mb-1">{mission.vehicle_detail?.immatriculation}</p>
            <p className="text-[10px] text-gray-400 mb-2">{mission.ville_depart} &rarr; {mission.ville_arrivee}</p>
            <div className="pt-2 border-t border-white/5 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-[var(--accent)]">D</div>
              <p className="text-[9px] text-gray-300">{mission.driver_detail?.prenom} {mission.driver_detail?.nom}</p>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

export default function GPSMap({ missions = [], selectedMission }) {
  const [mounted, setMounted] = useState(false);
  const [staticRoutes, setStaticRoutes] = useState([]);
  
  useEffect(() => { 
    setMounted(true); 
    publicApi.get('/routes/').then(res => setStaticRoutes(res.data)).catch(() => {});
  }, []);

  const allMissions = missions || [];
  const selectedIdx = allMissions.findIndex(m => m.id === selectedMission?.id);
  const selectedColor = selectedIdx !== -1 ? NEON_COLORS[selectedIdx % NEON_COLORS.length] : "#00f2ff";

  const mapLayers = useMemo(() => (
    <>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
      
      {staticRoutes.map((r, i) => (
        <Polyline key={`route-${i}`} positions={r.coordinates} color={r.color || "#ffffff33"} weight={2} opacity={0.4}>
          <Popup className="dark-popup">
            <div className="bg-black/90 border border-white/10 p-2 rounded text-[10px] font-mono">
              <span className="text-[var(--accent)] font-bold">LIGNE {r.name}</span>
            </div>
          </Popup>
        </Polyline>
      ))}

      {allMissions.map((m, i) => (
        <MissionRoute key={m.id} mission={m} isSelected={selectedMission?.id === m.id} color={NEON_COLORS[i % NEON_COLORS.length]} />
      ))}
    </>
  ), [allMissions.length, staticRoutes.length, selectedMission?.id]);

  if (!mounted) return <div className="h-[500px] w-full bg-[#050505] rounded-sm border border-[var(--border)] animate-pulse" />;

  return (
    <div className="h-[500px] w-full rounded-sm overflow-hidden border border-[var(--border)] relative bg-[#050505]">
      <MapContainer 
        key="map-instance" 
        center={[33.5731, -7.5898]} 
        zoom={6} 
        style={{ height: "100%", background: "transparent", zIndex: 1 }} 
        zoomControl={false}
      >
        {mapLayers}
      </MapContainer>
      
      {selectedMission && (
        <div className="absolute bottom-6 left-6 z-[10] bg-black/60 backdrop-blur-3xl p-5 border border-white/10 rounded-2xl shadow-2xl min-w-[260px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: selectedColor, boxShadow: `0 0 15px ${selectedColor}` }} />
            <span className="text-[10px] text-white font-black uppercase tracking-[0.4em]">Live Telemetry</span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-white flex items-center justify-between">
              <span>{selectedMission.ville_depart}</span>
              <span style={{ color: selectedColor }} className="px-3 text-xl">&rarr;</span>
              <span>{selectedMission.ville_arrivee}</span>
            </p>
            <div className="flex items-center justify-between opacity-50">
              <p className="text-[10px] text-white font-mono uppercase tracking-widest">{selectedMission.vehicle_detail?.immatriculation}</p>
              <p className="text-[10px] text-white font-mono">{selectedMission.driver_detail?.prenom} {selectedMission.driver_detail?.nom[0]}.</p>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .dark-popup .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
        .dark-popup .leaflet-popup-tip { display: none !important; }
        .dark-popup .leaflet-popup-content { margin: 0 !important; }
      `}</style>
    </div>
  );
}
