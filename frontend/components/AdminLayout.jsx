"use client";
import FloatingNav from "./FloatingNav";
import ThemeCustomizer from "./ThemeCustomizer";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    
    // Skip protection for landing and login
    if (pathname === '/' || pathname === '/login') return;

    if (!role) {
      router.push("/login");
      return;
    }

    // Role-based restrictions
    if (role === "technicien" && !pathname.includes("portal-technicien")) {
      router.push("/portal-technicien");
    } else if (role === "gestionnaire" && pathname === "/dashboard") {
      router.push("/portal-gestionnaire");
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      <FloatingNav />
      <ThemeCustomizer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {children}
      </main>
    </div>
  );
}
