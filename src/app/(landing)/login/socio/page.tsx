"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2, Briefcase, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginSocioPage() {
  const [associateId, setAssociateId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/socio/resumen"), 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f3f0]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[920px] min-h-[540px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-black/10"
      >
        {/* Left — image panel */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://mx.mannatech.com/wp-content/themes/mannatech/img/transform-03.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540] via-[#0a2540]/60 to-[#0a2540]/30" />

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative z-10">
            <svg viewBox="0 0 64 60" fill="none" className="w-10 h-10">
              <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* Welcome text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10">
            <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-3">Oficina Virtual</p>
            <h1 className="text-4xl font-bold text-white leading-tight mb-3">
              Tu Negocio,<br />
              <span className="font-light italic">Sin Limites</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Accede a tu panel de asociado, revisa tu red, comisiones, herramientas y crece tu negocio global.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              {[{ v: "30+", l: "Paises" }, { v: "154", l: "Patentes" }, { v: "25k+", l: "Socios" }].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <p className="text-lg font-bold text-white">{s.v}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — form panel */}
        <div className="bg-white flex flex-col justify-center px-8 sm:px-12 py-12">
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <svg viewBox="0 0 64 60" fill="none" className="w-10 h-10">
                <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="#2A7B3D" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#2A7B3D]/10 flex items-center justify-center">
                <Briefcase size={16} className="text-[#2A7B3D]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 leading-tight">Acceso Asociado</h2>
                <p className="text-[10px] text-zinc-400">Oficina Virtual Mannatech</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Associate ID */}
              <div className="relative">
                <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${idFocused ? "text-[#2A7B3D]" : "text-zinc-300"}`} />
                <input
                  type="text"
                  value={associateId}
                  onChange={e => setAssociateId(e.target.value)}
                  onFocus={() => setIdFocused(true)}
                  onBlur={() => setIdFocused(false)}
                  placeholder="ID de Asociado o Email"
                  required
                  className="w-full border-b-2 border-zinc-100 focus:border-[#2A7B3D] bg-transparent pl-11 pr-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition-colors duration-300"
                />
                <AnimatePresence>
                  {(idFocused || associateId) && (
                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: -22 }} exit={{ opacity: 0 }} className="absolute left-11 top-3 text-[9px] font-semibold text-[#2A7B3D] uppercase tracking-wider">ID o Email</motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${passFocused ? "text-[#2A7B3D]" : "text-zinc-300"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  placeholder="Contrasena"
                  required
                  className="w-full border-b-2 border-zinc-100 focus:border-[#2A7B3D] bg-transparent pl-11 pr-20 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition-colors duration-300"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-zinc-500 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Link href="#" className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] text-[#2A7B3D] font-medium hover:underline">Olvidaste?</Link>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-[#2A7B3D] hover:bg-[#1a5c2e] disabled:opacity-60 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2A7B3D]/20 mt-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Acceder</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>

            {/* Links */}
            <div className="mt-8 space-y-3 text-center">
              <p className="text-sm text-zinc-400">
                Quieres ser asociado?{" "}
                <Link href="/unete" className="font-semibold text-[#2A7B3D] hover:underline">Unete ahora</Link>
              </p>
              <p className="text-sm text-zinc-400">
                Eres cliente?{" "}
                <Link href="/login/cliente" className="font-semibold text-zinc-600 hover:text-[#2A7B3D] transition-colors">Ingresar aqui</Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-4 text-[10px] text-zinc-300">
              <div className="flex items-center gap-1"><Shield size={10} className="text-[#2A7B3D]" /><span>Conexion Segura</span></div>
              <span>&middot;</span>
              <span>Mannatech Asociados</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
