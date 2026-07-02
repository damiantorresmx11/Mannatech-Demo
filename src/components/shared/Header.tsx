"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, UserCircle, Briefcase, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MannatechLogo } from "@/components/shared/MannatechLogo";
import { CartButton } from "@/components/shop/cart/CartButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";

interface NavLink {
  href: string;
  labelKey: string;
}

const navLinkDefs: NavLink[] = [
  { href: "/productos", labelKey: "shop" },
  { href: "/impacto", labelKey: "impact" },
  { href: "/#ciencia", labelKey: "science" },
  { href: "/#historia", labelKey: "successStories" },
  { href: "/quienes-somos", labelKey: "aboutUs" },
  { href: "/unete", labelKey: "join" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = useTranslations("common.nav");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close login dropdown on outside click
  useEffect(() => {
    if (!loginOpen) return;
    function handleClick(e: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [loginOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Main header */}
      <header
        className={`bg-white dark:bg-zinc-950 border-b border-border transition-shadow duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo — left */}
            <Link href="/" className="flex-shrink-0" aria-label={t("logoAria")}>
              <MannatechLogo className="h-8 sm:h-10" variant="default" />
            </Link>

            {/* Desktop nav — center */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinkDefs.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href.replace("/#", "/")));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium uppercase tracking-wider px-4 py-2 transition-colors duration-200 ${
                      isActive
                        ? "text-mannatech"
                        : "text-foreground/70 hover:text-mannatech"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>

            {/* Right side — icons */}
            <div className="flex items-center gap-1.5">
              <button
                className="hidden md:flex p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} className="text-foreground/70" />
              </button>

              <div className="hidden md:flex">
                <LocaleSwitcher />
              </div>

              {/* Login dropdown */}
              <div className="relative hidden md:block" ref={loginRef}>
                <button
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setLoginOpen(!loginOpen)}
                  aria-label="Iniciar sesion"
                  aria-expanded={loginOpen}
                >
                  <User size={20} className="text-foreground/70" />
                </button>
                <AnimatePresence>
                  {loginOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-border overflow-hidden z-50"
                    >
                      <Link
                        href="/login/cliente"
                        className="flex items-center gap-4 px-5 py-4 hover:bg-muted/60 transition-colors border-b border-border/50"
                        onClick={() => setLoginOpen(false)}
                      >
                        <UserCircle size={28} className="text-mannatech flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">¿Eres cliente Mannatech?</p>
                          <p className="text-xs text-muted-foreground">Inicia Sesion Aqui</p>
                        </div>
                      </Link>
                      <Link
                        href="/login/socio"
                        className="flex items-center gap-4 px-5 py-4 hover:bg-muted/60 transition-colors border-b border-border/50"
                        onClick={() => setLoginOpen(false)}
                      >
                        <Briefcase size={28} className="text-mannatech flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">¿Eres <span className="underline">socio</span> Mannatech?</p>
                          <p className="text-xs text-muted-foreground">Inicia Sesion Aqui</p>
                        </div>
                      </Link>
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-4 px-5 py-3 hover:bg-muted/60 transition-colors"
                        onClick={() => setLoginOpen(false)}
                      >
                        <Shield size={22} className="text-zinc-500 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">Panel de Administracion</p>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DarkModeToggle />
              <CartButton />

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-foreground/80 hover:bg-muted transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-[calc(72px+var(--announcement-bar-height))] bg-black/30 backdrop-blur-sm md:hidden z-40"
                onClick={() => setMenuOpen(false)}
              />
              <motion.nav
                key="mobile-nav"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="md:hidden border-t border-border bg-white dark:bg-zinc-900 relative z-50 overflow-hidden"
              >
                <div className="px-4 py-3 space-y-1">
                  {navLinkDefs.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: i * 0.06,
                        ease: "easeOut" as const,
                      }}
                    >
                      <Link
                        href={link.href}
                        className="block py-2.5 px-3 text-sm font-medium uppercase tracking-wider text-foreground/80 hover:text-mannatech hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {t(link.labelKey)}
                      </Link>
                    </motion.div>
                  ))}
                  {/* Mobile login links */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: navLinkDefs.length * 0.06,
                      ease: "easeOut" as const,
                    }}
                    className="border-t border-border mt-2 pt-3 space-y-1"
                  >
                    <Link
                      href="/login/cliente"
                      className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-foreground/80 hover:text-mannatech hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <UserCircle size={18} />
                      Iniciar sesion — Cliente
                    </Link>
                    <Link
                      href="/login/socio"
                      className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-foreground/80 hover:text-mannatech hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Briefcase size={18} />
                      Iniciar sesion — Socio
                    </Link>
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 py-2.5 px-3 text-xs text-muted-foreground hover:text-mannatech hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Shield size={16} />
                      Panel Admin
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: (navLinkDefs.length + 1) * 0.06,
                      ease: "easeOut" as const,
                    }}
                    className="flex items-center gap-4 py-2.5 px-3 border-t border-border mt-2 pt-3"
                  >
                    <LocaleSwitcher />
                  </motion.div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
