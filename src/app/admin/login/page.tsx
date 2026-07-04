"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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
      router.push("/admin/dashboard")
      router.refresh()
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="group">
                <label className="block text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@dmlabs.mx"
                  required
                  className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 px-0 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2">Contrasena</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 px-0 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 text-sm mt-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin mx-auto" />
                ) : (
                  "Ingresar"
                )}
              </motion.button>
            </form>

            <p className="text-center text-[10px] text-white/20 mt-8">
              Mannatech Admin &middot; Panel de Administracion
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
