"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginClientePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/cuenta/mi-cuenta"), 600);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf8] via-white to-[#f0f7f2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative background blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#2A7B3D]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1040px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] rounded-[28px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] border border-black/[0.04]"
      >
        {/* ══════ LEFT — Visual panel ══════ */}
        <div className="relative min-h-[220px] lg:min-h-[600px] overflow-hidden">
          {/* Product image */}
          <img
            src="https://mx.mannatech.com/wp-content/uploads/sites/16/2026/05/OsoLean-Chocolate-Banner-WEB.png"
            alt="Mannatech OsoLean"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a5c2e] via-[#1a5c2e]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a5c2e]/20 to-transparent" />

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            {/* Top — logo */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 64 60" fill="none" className="w-8 h-8">
                  <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Mannatech</span>
              </div>
            </motion.div>

            {/* Bottom — headline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 text-[10px] text-white/80 font-medium">
                <Sparkles size={10} />
                Nutricion Avanzada
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] mb-3">
                Tu Salud,<br />Nuestra Prioridad
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs hidden sm:block">
                Productos respaldados por mas de 30 anos de investigacion cientifica y 154 patentes globales.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ══════ RIGHT — Form panel ══════ */}
        <div className="bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-0">
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <div className="mb-8">
              <h2 className="text-[26px] font-bold text-zinc-900 tracking-tight">Bienvenido</h2>
              <p className="text-sm text-zinc-400 mt-1">Ingresa a tu cuenta de cliente</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className={`block text-[11px] font-semibold mb-2 transition-colors duration-200 ${focused === "email" ? "text-[#2A7B3D]" : "text-zinc-400"}`}>
                  CORREO ELECTRONICO
                </label>
                <div className="relative">
                  <Mail size={16} className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "email" ? "text-[#2A7B3D]" : "text-zinc-300"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="tu@correo.com"
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
                  <Link href="#" className="text-[11px] text-[#2A7B3D]/70 hover:text-[#2A7B3D] font-medium transition-colors">Olvidaste?</Link>
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
                className="w-full py-4 bg-[#2A7B3D] hover:bg-[#1f6830] disabled:opacity-60 text-white font-semibold rounded-2xl transition-all text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#2A7B3D]/15 hover:shadow-[#2A7B3D]/25 mt-3 group"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Iniciar Sesion<ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] text-zinc-300 font-medium">O</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>

            {/* Alternate login */}
            <Link
              href="/login/socio"
              className="w-full py-3 border border-zinc-200 hover:border-[#2A7B3D]/30 hover:bg-[#2A7B3D]/[0.02] rounded-2xl text-sm font-medium text-zinc-600 hover:text-[#2A7B3D] transition-all flex items-center justify-center gap-2"
            >
              Soy Asociado / Socio
            </Link>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-400">
                No tienes cuenta?{" "}
                <Link href="/unete" className="font-semibold text-[#2A7B3D] hover:underline">Registrate</Link>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-300">
              <ShieldCheck size={10} className="text-[#2A7B3D]/50" />
              <span>Conexion segura &middot; SSL 256-bit</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
