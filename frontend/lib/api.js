import axios from "axios";
export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

const MOCK = {
  "/stats/": { total_vehicles: 12, available_vehicles: 8, active_missions: 4, total_drivers: 15, available_drivers: 6, total_maintenance_cost: 45000, total_fuel_cost: 128000, document_alerts: 2, maintenance_alerts: 1 },
  "/vehicles/": [{ id: 1, immatriculation: "12345-A-10", marque: "Renault", modele: "Master", etat: "en mission", kilometrage: 125000 }, { id: 2, immatriculation: "67890-B-20", marque: "Mercedes", modele: "Sprinter", etat: "disponible", kilometrage: 85000 }],
  "/drivers/": [{ id: 1, nom: "Alaoui", prenom: "Ahmed", num_permis: "B12345", disponible: true }, { id: 2, nom: "Benani", prenom: "Youssef", num_permis: "C67890", disponible: false }],
  "/missions/": [{ id: 1, ville_depart: "Casablanca", ville_arrivee: "Tanger", statut: "en cours", vehicule_detail: { immatriculation: "12345-A-10" } }],
  "/maintenances/": [{ id: 1, type_intervention: "Vidange", date_maintenance: "2026-05-10", cout: 1200, vehicule_detail: { immatriculation: "67890-B-20" } }]
};

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("access_token");
  
  if (token === "sim-token") {
    const key = Object.keys(MOCK).find(k => config.url.includes(k));
    if (key) return Promise.reject({ isMock: true, data: MOCK[key] });
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

publicApi.interceptors.response.use(
  (res) => res,
  (err) => {
    // Redirect to login only if not on public landing or login page
    if (err.response?.status === 401 && typeof window !== "undefined" && !window.location.pathname.includes('/login') && window.location.pathname !== '/') {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined" && !window.location.pathname.includes('/login') && window.location.pathname !== '/') {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const login = (data) => api.post("/token/", data);
export const getVehicles = (s = "") => api.get(`/vehicles/${s ? `?search=${s}` : ""}`);
export const createVehicle = (d) => api.post("/vehicles/", d);
export const updateVehicle = (id, d) => api.put(`/vehicles/${id}/`, d);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}/`);
export const getDrivers = (s = "") => api.get(`/drivers/${s ? `?search=${s}` : ""}`);
export const createDriver = (d) => api.post("/drivers/", d);
export const updateDriver = (id, d) => api.put(`/drivers/${id}/`, d);
export const deleteDriver = (id) => api.delete(`/drivers/${id}/`);
export const getMissions = (s = "") => api.get(`/missions/${s ? `?search=${s}` : ""}`);
export const createMission = (d) => api.post("/missions/", d);
export const updateMission = (id, d) => api.put(`/missions/${id}/`, d);
export const deleteMission = (id) => api.delete(`/missions/${id}/`);
export const getMaintenances = () => api.get("/maintenances/");
export const createMaintenance = (d) => api.post("/maintenances/", d);
export const updateMaintenance = (id, d) => api.put(`/maintenances/${id}/`, d);
export const deleteMaintenance = (id) => api.delete(`/maintenances/${id}/`);
export const getStats = () => api.get("/stats/");

export default api;
