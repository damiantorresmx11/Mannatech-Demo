"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MannatechLogo } from "@/components/shared/MannatechLogo";
import { CartButton } from "@/components/shop/cart/CartButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { CompanySelector } from "@/components/shared/CompanySelector";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";

interface HeaderProps {
  variant?: "landing" | "shop";
}

interface NavLink {
  href: string;
  labelKey: string;
}

const landingLinkDefs: NavLink[] = [
  { href: "/", labelKey: "home" },
  { href: "/#ciencia", labelKey: "science" },
  { href: "/productos", labelKey: "products" },
  { href: "/distribuidores/maria-lopez", labelKey: "distributors" },
];

const shopLinkDefs: NavLink[] = [
  { href: "/productos", labelKey: "products" },
];

export function Header({ variant = "landing" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("common.nav");
  const isLandingHome = variant === "landing" && pathname === "/";

  const navLinks = useMemo(
    () => (variant === "shop" ? shopLinkDefs : landingLinkDefs),
    [variant]
  );

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On landing home: transparent at top, glass when scrolled
  // On other pages: always solid
  const headerBg = isLandingHome
    ? scrolled
      ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-white/15 dark:border-white/10 shadow-lg shadow-black/[0.03]"
      : "bg-transparent border-transparent"
    : scrolled
      ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-white/15 shadow-lg shadow-black/[0.03]"
      : "bg-white dark:bg-zinc-950 border-border dark:border-zinc-800";

  // Text color: white when transparent over hero, normal otherwise
  const textColor = isLandingHome && !scrolled
    ? "text-white/90 hover:text-white"
    : "text-foreground/70 hover:text-mannatech";

  const activeTextColor = isLandingHome && !scrolled
    ? "text-white font-semibold"
    : "text-mannatech font-semibold";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex-shrink-0 text-foreground" aria-label={t("logoAria")}>
            <MannatechLogo
              className="h-8 sm:h-10"
              variant={isLandingHome && !scrolled ? "white" : "default"}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive ? activeTextColor : textColor
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t(link.labelKey)}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-mannatech/10 dark:bg-mannatech/20 -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <div className="hidden md:flex items-center gap-3 mr-2">
              <CompanySelector />
              <LocaleSwitcher />
            </div>
            <DarkModeToggle />
            {variant === "shop" && <CartButton />}

            <button
              className={`md:hidden p-2 rounded-xl transition-colors ${
                isLandingHome && !scrolled
                  ? "text-white hover:bg-white/10"
                  : "text-foreground/80 hover:bg-muted"
              }`}
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
              className="fixed inset-0 top-[72px] bg-black/30 backdrop-blur-sm md:hidden z-40"
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
                {navLinks.map((link, i) => (
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
                      className="block py-2.5 px-3 text-sm font-medium text-foreground/80 hover:text-mannatech hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: navLinks.length * 0.06,
                    ease: "easeOut" as const,
                  }}
                  className="flex items-center gap-4 py-2.5 px-3 border-t border-border mt-2 pt-3"
                >
                  <CompanySelector />
                  <LocaleSwitcher />
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
