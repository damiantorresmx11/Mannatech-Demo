"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginAdmin, getAdminToken } from "@/lib/medusa-admin"

interface AdminAuthCtx {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AdminAuthContext = createContext<AdminAuthCtx>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null,
})

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAdminToken()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      await loginAdmin(email, password)
      setIsAuthenticated(true)
    } catch {
      setError("Credenciales incorrectas")
      throw new Error("Login failed")
    }
  }

  const logout = () => {
    sessionStorage.removeItem("medusa_admin_token")
    setIsAuthenticated(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
