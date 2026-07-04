"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email o contrasena incorrectos")
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/dashboard")
        router.refresh()
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1f0e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Full background tropical image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f0e]/90 via-[#0a1f0e]/70 to-[#0a1f0e]/95" />

      {/* Decorative SVG leaves */}
      <svg className="absolute top-0 left-0 w-64 h-64 text-emerald-900/30 -translate-x-1/3 -translate-y-1/4" viewBox="0 0 200 200" fill="currentColor">
        <ellipse cx="100" cy="80" rx="90" ry="60" transform="rotate(-30 100 80)" />
        <ellipse cx="60" cy="140" rx="70" ry="45" transform="rotate(20 60 140)" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-72 h-72 text-emerald-900/20 translate-x-1/4 translate-y-1/4" viewBox="0 0 200 200" fill="currentColor">
        <ellipse cx="100" cy="100" rx="85" ry="55" transform="rotate(40 100 100)" />
        <ellipse cx="140" cy="60" rx="65" ry="40" transform="rotate(-20 140 60)" />
      </svg>
      <svg className="absolute top-10 right-20 w-32 h-32 text-emerald-800/15 rotate-45" viewBox="0 0 100 100" fill="currentColor">
        <ellipse cx="50" cy="50" rx="45" ry="25" />
      </svg>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-[960px] min-h-[560px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-emerald-900/30 shadow-2xl shadow-black/50"
      >
        {/* Left side — branding */}
        <div className="relative flex flex-col justify-end p-10 lg:p-12 overflow-hidden">
          {/* Background image for left side */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0e] via-[#0a1f0e]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f0e]/30 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-4">
              Bienvenido<br />
              <span className="text-emerald-400">al Panel</span>
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Administra tu sitio web, productos, pedidos y contenido desde un solo lugar. Tecnologia de gliconutrientes al alcance de tu mano.
            </p>
          </motion.div>

          {/* Bottom badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-10 mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 w-fit"
          >
            <span className="text-xs text-white/60">powered by</span>
            <svg viewBox="0 0 64 60" fill="none" className="w-5 h-5">
              <path d="M8 52 L24 8 L32 28 L40 8 L56 52" stroke="#00A88F" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold text-white/80">DMLABS</span>
          </motion.div>
        </div>

        {/* Right side — form */}
        <div className="relative bg-[#0d1f12]/95 backdrop-blur-xl flex flex-col justify-center p-10 lg:p-12">
          {/* Subtle vertical divider glow */}
          <div className="absolute left-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent hidden lg:block" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">Iniciar Sesion</h2>
            <p className="text-sm text-white/40 mb-8">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${emailFocused ? "bg-emerald-500/15" : "bg-white/5"}`}>
                  <Mail size={16} className={`transition-colors duration-300 ${emailFocused ? "text-emerald-400" : "text-white/30"}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="admin@dmlabs.mx"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                />
                {/* Floating label */}
                <motion.span
                  animate={{ y: emailFocused || email ? -28 : 0, scale: emailFocused || email ? 0.75 : 1, opacity: emailFocused || email ? 1 : 0 }}
                  className="absolute left-12 top-3.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider pointer-events-none origin-left"
                >
                  Email
                </motion.span>
              </div>

              {/* Password field */}
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${passwordFocused ? "bg-emerald-500/15" : "bg-white/5"}`}>
                  <Lock size={16} className={`transition-colors duration-300 ${passwordFocused ? "text-emerald-400" : "text-white/30"}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-xl pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                />
                {/* Floating label */}
                <motion.span
                  animate={{ y: passwordFocused || password ? -28 : 0, scale: passwordFocused || password ? 0.75 : 1, opacity: passwordFocused || password ? 1 : 0 }}
                  className="absolute left-12 top-3.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider pointer-events-none origin-left"
                >
                  Contrasena
                </motion.span>
                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/20 hover:text-white/50 transition-colors rounded-lg"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Remember me + forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${remember ? "bg-emerald-500 border-emerald-500" : "border-white/15 group-hover:border-white/30"}`}
                  >
                    {remember && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2.5 h-2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">Recordarme</span>
                </label>
                <button type="button" className="text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors">
                  Olvidaste tu contrasena?
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl overflow-hidden"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                    <span className="text-xs text-red-400">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl overflow-hidden"
                  >
                    <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-emerald-400">Acceso autorizado. Redirigiendo...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || success}
                whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(16,185,129,0.25)" }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 text-sm overflow-hidden group"
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : success ? (
                    <>
                      <ShieldCheck size={18} />
                      Acceso Concedido
                    </>
                  ) : (
                    <>
                      Ingresar
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/[0.05]">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-white/30">SSL Seguro</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-[10px] text-white/20">Mannatech Admin v1.0</span>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-[10px] text-white/20">DMLABS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
