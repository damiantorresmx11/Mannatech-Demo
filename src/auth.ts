import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const CMS_API = process.env.CMS_API_URL || "http://127.0.0.1:3002"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "CMS Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`${CMS_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) return null

          const data = await res.json()
          if (!data.token) return null

          return {
            id: data.user?.id || "admin",
            name: data.user?.name || "Admin DMLABS",
            email: credentials.email as string,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin")
      const isLoginPage = request.nextUrl.pathname === "/admin/login"
      const isLoggedIn = !!session?.user

      if (isAdmin && !isLoginPage && !isLoggedIn) {
        return Response.redirect(new URL("/admin/login", request.nextUrl.origin))
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", request.nextUrl.origin))
      }

      return true
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "mannatech-cms-secret-2026-dmlabs",
  trustHost: true,
})
