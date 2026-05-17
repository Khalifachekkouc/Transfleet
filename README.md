# TransFleet - Logistics Intelligence Platform

Premium fleet management system for the Moroccan logistics market.

## 🔐 Authentication & Access Control Guide

Use the following simulated accounts to explore the different workspace portals. Each role is strictly isolated via the system's route protection middleware.

| Username | Password | Assigned Role | Redirect Path | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `admin123` | **Administrator** | `/dashboard` | Full control (Stats, Flotte, Staff, Ops) |
| `gestionnaire` | `gestion123` | **Gestionnaire** | `/portal-gestionnaire` | Operational (Vehicles, Drivers, Missions) |
| `technicien` | `techn123` | **Technicien** | `/portal-technicien` | Technical (Maintenance, Logs, Status) |

---

## 🚀 Key Workspaces

### 1. Client Landing Page (`/`)
Public-facing portal featuring real-time tracking, fleet inventory visibility, and high-end interactive animations.

### 2. Admin Dashboard (`/dashboard`)
The command center for administrators. High-level telemetry, financial overviews (Fuel/Maintenance), and critical alerts for expiring documents.

### 3. Gestionnaire Portal (`/portal-gestionnaire`)
Focused operational environment. No financial stats; only fleet, personnel, and mission execution tools.

### 4. Technician Terminal (`/portal-technicien`)
Minimalist technical workspace. Quick intervention logging, status switching, and chronological maintenance history.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React.
- **Geospatial**: React-Leaflet, OpenStreetMap, OSRM API.
- **Backend**: Django REST Framework.
- **Design**: Cyber-Minimalist Dark (Glassmorphism).
