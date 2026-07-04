"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2, ShieldCheck, Briefcase, TrendingUp, Globe, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginSocioPage() {
  const [associateId, setAssociateId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/socio/resumen"), 600);
  }

  const stats = [
    { icon: Globe, value: "30+", label: "Paises" },
    { icon: Award, value: "154", label: "Patentes" },
    { icon: TrendingUp, value: "25k+", label: "Asociados" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f7] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative background */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-[#0a2540]/[0.03] rounded-full blur-3xl -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#2A7B3D]/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1040px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] rounded-[28px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] border border-black/[0.04]"
      >
        {/* ══════ LEFT — Visual panel ══════ */}
        <div className="relative min-h-[260px] lg:min-h-[620px] overflow-hidden">
          {/* Background */}
          <img
            src="https://mx.mannatech.com/wp-content/uploads/sites/16/2024/07/MANNA-ZENWEB.jpg"
            alt="Mannatech Asociados"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e] via-[#0a1a2e]/50 to-[#0a1a2e]/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a2e]/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            {/* Top — logo + badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 64 60" fill="none" className="w-8 h-8">
                  <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Mannatech</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white/70 font-medium">
                <Briefcase size={10} />
                Oficina Virtual
              </div>
            </motion.div>

            {/* Bottom — content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] mb-3">
                Construye Tu<br />Futuro Global
              </h1>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6 hidden sm:block">
                Gestiona tu red, comisiones, herramientas y crece tu negocio desde cualquier lugar del mundo.
              </p>

              {/* Stats row */}
              <div className="hidden sm:flex items-center gap-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <s.icon size={14} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{s.value}</p>
                      <p className="text-[9px] text-white/40 uppercase tracking-wider">{s.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══════ RIGHT — Form panel ══════ */}
        <div className="bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-0">
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A7B3D]/10 to-emerald-500/5 flex items-center justify-center">
                  <Briefcase size={18} className="text-[#2A7B3D]" />
                </div>
                <div>
                  <h2 className="text-[22px] font-bold text-zinc-900 leading-tight">Acceso Asociado</h2>
                  <p className="text-[11px] text-zinc-400">Panel de Negocio Mannatech</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Associate ID */}
              <div>
                <label className={`block text-[11px] font-semibold mb-2 transition-colors duration-200 ${focused === "id" ? "text-[#2A7B3D]" : "text-zinc-400"}`}>
                  ID DE ASOCIADO O EMAIL
                </label>
                <div className="relative">
                  <User size={16} className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "id" ? "text-[#2A7B3D]" : "text-zinc-300"}`} />
                  <input
                    type="text"
                    value={associateId}
                    onChange={e => setAssociateId(e.target.value)}
                    onFocus={() => setFocused("id")}
                    onBlur={() => setFocused(null)}
                    placeholder="12345678 o tu@email.com"
                    required
                    className="w-full bg-transparent border-b-2 border-zinc-100 focus:border-[#2A7B3D] pl-7 pr-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-[11px] font-semibold transition-colors duration-200 ${focused === "pass" ? "text-[#2A7B3D]" : "text-zinc-400"}`}>
                    CONTRASENA
                  </label>
                  <Link href="#" className="text-[11px] text-[#2A7B3D]/70 hover:text-[#2A7B3D] font-medium transition-colors">Recuperar acceso</Link>
                </div>
                <div className="relative">
                  <Lock size={16} className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "pass" ? "text-[#2A7B3D]" : "text-zinc-300"}`} />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-transparent border-b-2 border-zinc-100 focus:border-[#2A7B3D] pl-7 pr-10 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition-all duration-300"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-zinc-300 hover:text-zinc-500 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full py-4 bg-gradient-to-r from-[#2A7B3D] to-[#1f6830] hover:from-[#1f6830] hover:to-[#185525] disabled:opacity-60 text-white font-semibold rounded-2xl transition-all text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#2A7B3D]/15 hover:shadow-[#2A7B3D]/25 mt-3 group"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Acceder al Panel<ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] text-zinc-300 font-medium">O</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>

            {/* Alternate actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login/cliente"
                className="py-3 border border-zinc-200 hover:border-[#2A7B3D]/30 hover:bg-[#2A7B3D]/[0.02] rounded-2xl text-[12px] font-medium text-zinc-500 hover:text-[#2A7B3D] transition-all flex items-center justify-center gap-1.5"
              >
                Soy Cliente
              </Link>
              <Link
                href="/unete"
                className="py-3 border border-zinc-200 hover:border-[#2A7B3D]/30 hover:bg-[#2A7B3D]/[0.02] rounded-2xl text-[12px] font-medium text-zinc-500 hover:text-[#2A7B3D] transition-all flex items-center justify-center gap-1.5"
              >
                Quiero Unirme
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-zinc-300">
              <ShieldCheck size={10} className="text-[#2A7B3D]/50" />
              <span>Conexion segura &middot; Datos encriptados</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
