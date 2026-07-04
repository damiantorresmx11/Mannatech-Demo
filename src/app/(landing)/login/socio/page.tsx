"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Globe, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginSocioPage() {
  const [associateId, setAssociateId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/socio/resumen"), 600);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1060px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_70px_-15px_rgba(0,0,0,0.08)] border border-zinc-200/60"
      >
        {/* ══════ LEFT — Image ══════ */}
        <div className="relative min-h-[240px] sm:min-h-[300px] lg:min-h-0 overflow-hidden bg-[#0f1923]">
          <img
            src="https://mx.mannatech.com/wp-content/uploads/sites/16/2024/07/MANNA-ZENWEB.jpg"
            alt="Mannatech Asociados"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1520] via-[#0a1520]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1520]/50 to-transparent" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-6 left-6 z-10"
          >
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.15em]">
              Oficina Virtual
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white leading-[1.15] mb-3">
              Construye Tu<br />Negocio Global
            </h2>
            <p className="text-white/40 text-xs sm:text-sm max-w-xs leading-relaxed mb-5">
              Gestiona tu red, comisiones y herramientas desde cualquier lugar.
            </p>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-5">
              {[
                { icon: Globe, val: "30+", lbl: "Paises" },
                { icon: Award, val: "154", lbl: "Patentes" },
                { icon: TrendingUp, val: "25k", lbl: "Socios" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                    <s.icon size={12} className="text-white/50" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{s.val}</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-wider">{s.lbl}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Curve blend */}
          <div className="absolute top-0 right-0 w-8 h-full bg-white rounded-l-[32px] hidden lg:block" />
        </div>

        {/* ══════ RIGHT — Form ══════ */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {/* Top right */}
            <div className="flex justify-end mb-10">
              <p className="text-xs text-zinc-400">
                Quieres unirte?{" "}
                <Link href="/unete" className="font-semibold text-zinc-900 hover:text-[#2A7B3D] border border-zinc-200 hover:border-[#2A7B3D]/30 px-3 py-1.5 rounded-lg ml-2 transition-all">
                  Registrate
                </Link>
              </p>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-zinc-900 tracking-tight">Acceso Asociado</h1>
              <p className="text-sm text-zinc-400 mt-1.5">Ingresa a tu panel de negocio</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">ID de Asociado o Email</label>
                <input
                  type="text"
                  value={associateId}
                  onChange={e => setAssociateId(e.target.value)}
                  placeholder="12345678 o tu@email.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-[#2A7B3D] focus:ring-2 focus:ring-[#2A7B3D]/10 focus:bg-white transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-500">Contrasena</label>
                  <Link href="#" className="text-[11px] text-[#2A7B3D] font-medium hover:underline">Recuperar acceso</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-[#2A7B3D] focus:ring-2 focus:ring-[#2A7B3D]/10 focus:bg-white transition-all pr-11"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all mt-2 group"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Acceder al Panel<ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></>}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] text-zinc-300">o</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>

            {/* Alt link */}
            <Link href="/login/cliente" className="w-full py-3.5 border border-zinc-200 hover:border-zinc-300 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center justify-center gap-2 transition-all">
              Acceder como Cliente
            </Link>

            {/* Footer */}
            <div className="flex items-center justify-center gap-1.5 mt-8 text-[10px] text-zinc-300">
              <ShieldCheck size={10} className="text-[#2A7B3D]/40" />
              <span>Mannatech &middot; Datos encriptados</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
