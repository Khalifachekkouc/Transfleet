"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Truck, Users, Wrench, CalendarDays, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/vehicles", label: "Véhicules", icon: Truck, roles: ["admin", "gestionnaire"] },
  { href: "/drivers", label: "Chauffeurs", icon: Users, roles: ["admin", "gestionnaire"] },
  { href: "/maintenance", label: "Maintenance", icon: Wrench, roles: ["admin", "gestionnaire"] },
  { href: "/missions", label: "Missions", icon: CalendarDays, roles: ["admin", "gestionnaire"] },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role");
    setRole(savedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/portal-technicien')) return null;

  const filteredItems = navItems.filter(item => !role || item.roles.includes(role));

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99] w-fit">
      <nav className="flex items-center gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-center px-4 py-2 border-r border-white/10 mr-1">
          <span className="text-[10px] font-black font-mono tracking-[0.4em] text-white">
            T<span className="text-[var(--accent)]">F</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-2.5 rounded-full text-[10px] font-black font-mono uppercase tracking-widest transition-colors duration-300"
                style={{ color: isActive ? '#fff' : '#666' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon size={12} className={isActive ? "text-[var(--accent)]" : "text-gray-600"} />
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 border-l border-white/10 ml-1 pl-1">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black font-mono uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={12} />
            <span className="hidden lg:inline">Quitter</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
