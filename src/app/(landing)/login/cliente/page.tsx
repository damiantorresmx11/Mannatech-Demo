"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginClientePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/cuenta/mi-cuenta"), 600);
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
            style={{ backgroundImage: "url('https://mx.mannatech.com/wp-content/uploads/sites/16/2024/11/MX-Luminovation.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a5c2e] via-[#1a5c2e]/50 to-[#1a5c2e]/20" />

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative z-10">
            <svg viewBox="0 0 64 60" fill="none" className="w-10 h-10">
              <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* Welcome text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10">
            <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-3">Bienvenido</p>
            <h1 className="text-4xl font-bold text-white leading-tight mb-3">
              Tu Bienestar,<br />
              <span className="font-light italic">Nuestra Ciencia</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Accede a tu cuenta para explorar productos, revisar pedidos y gestionar tu bienestar.
            </p>
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

            <h2 className="text-2xl font-bold text-zinc-900 mb-1 text-center lg:text-left">Iniciar Sesion</h2>
            <p className="text-sm text-zinc-400 mb-8 text-center lg:text-left">Cliente Mannatech</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${emailFocused ? "text-[#2A7B3D]" : "text-zinc-300"}`} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="Email"
                  required
                  className="w-full border-b-2 border-zinc-100 focus:border-[#2A7B3D] bg-transparent pl-11 pr-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none transition-colors duration-300"
                />
                <AnimatePresence>
                  {(emailFocused || email) && (
                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: -22 }} exit={{ opacity: 0 }} className="absolute left-11 top-3 text-[9px] font-semibold text-[#2A7B3D] uppercase tracking-wider">Email</motion.span>
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
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Ingresar</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-400">
                No tienes cuenta?{" "}
                <Link href="/unete" className="font-semibold text-[#2A7B3D] hover:underline">Crear cuenta</Link>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] text-zinc-300">
              <Heart size={10} className="text-[#2A7B3D]" />
              <span>Mannatech &middot; Bienestar con Ciencia</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
