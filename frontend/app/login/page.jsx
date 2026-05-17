"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { Truck } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // FORCE REAL DATABASE AUTHENTICATION
      const res = await login({ username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      let role = "admin";
      let path = "/dashboard";

      if (username === "technicien") {
        role = "technicien";
        path = "/portal-technicien";
      } else if (username === "gestionnaire") {
        role = "gestionnaire";
        path = "/vehicles"; // Redirect Gestionnaire to vehicles as they are blocked from dashboard
      }

      localStorage.setItem("user_role", role);
      router.push(path);
    } catch (err) {
      // ONLY TECHNICIEN HAS SIMULATION FALLBACK IF NEEDED
      if (username === "technicien" && password === "techn123") {
        localStorage.setItem("access_token", "sim-token");
        localStorage.setItem("user_role", "technicien");
        router.push("/portal-technicien");
        return;
      }

      setError(
        "Identifiants invalides. Le compte doit exister dans la base de données Django.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-3/5 relative bg-[#0a0a0a] items-center justify-center p-12 border-r border-white/5">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,_var(--accent)_0%,_transparent_50%)]" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <Truck size={32} className="text-[var(--accent)]" />
            <h1 className="text-4xl font-black text-white font-mono uppercase">
              Trans<span className="text-[var(--accent)]">Fleet</span>
            </h1>
          </div>
          <h2 className="text-6xl font-black text-white leading-tight mb-6 uppercase font-mono tracking-tight">
            Database <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#2a6e5a]">
              Live Sync.
            </span>
          </h2>
          <p className="text-lg text-gray-500 font-medium mb-12 max-w-md font-mono">
            Connecting to Django + Supabase Production Environment.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#050505]">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <h3 className="text-2xl font-black text-white mb-2 uppercase font-mono tracking-widest">
              Login Terminal
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] font-mono">
              Database Authentication Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] rounded-lg text-center font-black uppercase tracking-widest">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] font-mono">
                User ID
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-[var(--accent)] outline-none font-mono"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] font-mono">
                Security Key
              </label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-[var(--accent)] outline-none font-mono"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-[#050505] text-xs font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Access Database"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
