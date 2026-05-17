"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Users, Map } from "lucide-react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/vehicles", label: "Véhicules", icon: Truck },
  { href: "/drivers", label: "Chauffeurs", icon: Users },
  { href: "/missions", label: "Missions", icon: Map },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50" style={{ background: "var(--bg-sidebar)", borderRight: "1px solid var(--border)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--accent)" }}>
          <Truck size={18} className="text-black" />
        </div>
        <div>
          <span className="text-lg font-black tracking-widest text-white">TRANS</span>
          <span className="text-lg font-black tracking-widest" style={{ color: "var(--accent)" }}>FLEET</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative`}
              style={active ? {
                background: "rgba(232, 168, 48, 0.1)",
                color: "var(--accent)",
                borderLeft: "4px solid var(--accent)",
                borderRadius: "0 12px 12px 0",
              } : {
                color: "var(--text-muted)",
              }}
            >
              <Icon size={18} style={active ? { color: "var(--accent)" } : {}} className={!active ? "group-hover:text-[#E8A830]" : ""} />
              <span className="text-sm font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>TransFleet v1.0</p>
      </div>
    </aside>
  );
}
