"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { MannatechLogo } from "@/components/shared/MannatechLogo";

export default function LoginClientePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo only — no real auth
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-muted/30 dark:bg-zinc-950 py-16 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 sm:p-10">
        <div className="text-center mb-8">
          <MannatechLogo className="h-8 mx-auto mb-6" variant="default" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-foreground tracking-tight">
            INICIAR SESION
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Cliente Mannatech</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-mannatech/20 focus:border-mannatech/40 transition-colors"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contrasena"
              className="w-full px-4 py-3.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-mannatech/20 focus:border-mannatech/40 transition-colors pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#262626] dark:bg-mannatech hover:bg-black dark:hover:bg-mannatech-dark text-white font-semibold py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider"
          >
            Iniciar Sesion
          </button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <a href="#" className="text-sm text-muted-foreground hover:text-mannatech transition-colors italic">
            ¿Olvidaste tu contrasena?
          </a>
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/unete" className="font-semibold text-foreground hover:text-mannatech transition-colors">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
