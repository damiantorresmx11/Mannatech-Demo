"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FooterSection {
  titleKey: string;
  items: { labelKey: string; href?: string }[];
}

const sections: FooterSection[] = [
  {
    titleKey: "products",
    items: [
      { labelKey: "items.ambrotose", href: "/productos" },
      { labelKey: "items.osolean", href: "/productos" },
      { labelKey: "items.phytomatrix", href: "/productos" },
      { labelKey: "items.uth", href: "/productos" },
    ],
  },
  {
    titleKey: "categories",
    items: [
      { labelKey: "items.immuneSystem", href: "/productos" },
      { labelKey: "items.essentialNutrition", href: "/productos" },
      { labelKey: "items.personalCare", href: "/productos" },
      { labelKey: "items.performance", href: "/productos" },
    ],
  },
  {
    titleKey: "company",
    items: [
      { labelKey: "items.aboutUs" },
      { labelKey: "items.science" },
      { labelKey: "items.opportunity" },
      { labelKey: "items.blog" },
    ],
  },
];

const socialIcons = [
  {
    ariaLabel: "Facebook",
    href: "https://facebook.com/Mannatech",
    color: "hover:bg-blue-500/20 hover:text-blue-400",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    ariaLabel: "Instagram",
    href: "https://instagram.com/Mannatech",
    color: "hover:bg-pink-500/20 hover:text-pink-400",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    ariaLabel: "YouTube",
    href: "https://youtube.com/Mannatech",
    color: "hover:bg-red-500/20 hover:text-red-400",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    ariaLabel: "X (Twitter)",
    href: "https://x.com/Mannatech",
    color: "hover:bg-gray-500/20 hover:text-gray-400",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function FooterAccordion({ section, t }: { section: FooterSection; t: (key: string) => string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-white/80 uppercase tracking-wider"
      >
        {t(section.titleKey)}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-white/40" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2.5 pb-4">
              {section.items.map((item) => (
                <li key={item.labelKey}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-sm text-white/40 hover:text-mannatech-light transition-colors"
                    >
                      {t(item.labelKey)}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/40 cursor-default">
                      {t(item.labelKey)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FooterNewsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const t = useTranslations("common.footer.newsletter");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <div className="max-w-md mx-auto sm:mx-0 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle size={40} className="text-mannatech-light mx-auto mb-3" />
              </motion.div>
              <p className="text-white font-semibold">{t("successTitle")}</p>
              <p className="text-white/50 text-sm mt-1">{t("successDescription")}</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
                {t("title")}
              </p>
              <p className="text-sm text-white/40 mb-4">
                {t("description")}
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">{t("emailLabel")}</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-mannatech/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-mannatech text-white rounded-xl hover:bg-mannatech-light transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("common.footer");

  return (
    <footer className="relative mt-auto overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="h-px bg-gradient-to-r from-transparent via-mannatech/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Brand */}
          <motion.div variants={columnVariants} className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-3">Mannatech</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {t("brandDescription")}
            </p>
          </motion.div>

          {/* Sections */}
          {sections.map((section) => (
            <motion.div key={section.titleKey} variants={columnVariants}>
              <FooterAccordion section={section} t={t} />

              <div className="hidden sm:block">
                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                  {t(section.titleKey)}
                </h4>
                <ul className="space-y-2.5">
                  {section.items.map((item) => (
                    <li key={item.labelKey}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="text-sm text-white/40 hover:text-mannatech-light transition-colors"
                        >
                          {t(item.labelKey)}
                        </Link>
                      ) : (
                        <span className="text-sm text-white/40 cursor-default">
                          {t(item.labelKey)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

          {/* Contact + Social */}
          <motion.div variants={columnVariants}>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4 hidden sm:block">
              {t("contact")}
            </h4>
            <ul className="space-y-2.5 hidden sm:block">
              <li>
                <span className="text-sm text-white/40">mannatech.com</span>
              </li>
              <li>
                <span className="text-sm text-white/40">contacto@mannatech.com</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {socialIcons.map((s) => (
                <motion.a
                  key={s.ariaLabel}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.ariaLabel}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/50 ${s.color} transition-colors cursor-pointer`}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <FooterNewsletter />

        {/* Payment badges */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 48 32" className="h-6" fill="none">
              <rect width="48" height="32" rx="4" fill="#1A1F71"/>
              <path d="M19.5 21H17L18.7 11H21.2L19.5 21ZM15.3 11L12.9 18L12.6 16.5L11.7 12C11.7 12 11.6 11 10.3 11H6.1L6 11.2C6 11.2 7.5 11.5 9.2 12.5L11.4 21H14L18 11H15.3ZM35 21H37.3L35.3 11H33.3C32.2 11 31.9 11.8 31.9 11.8L28 21H30.5L31 19.5H34L34.3 21H35ZM31.7 17.5L33 13.5L33.7 17.5H31.7ZM28 13.5L28.3 12C28.3 12 27 11 25.5 11C24 11 21.5 12 21.5 14.5C21.5 16.5 24 17 25 17.5C25.5 17.8 26 18 26 18.5C26 19.5 24.5 19.5 23.5 19.5C22 19.5 21.5 19 21.5 19L21 21C21 21 22.5 21.5 24 21.5C26 21.5 28.5 20.5 28.5 18C28.5 16.5 27 15.5 26 15C25.5 14.8 24.5 14.5 24.5 13.5C24.5 12.8 25.5 12.5 26.5 12.5C27.5 12.5 28 13 28 13L28 13.5Z" fill="white"/>
            </svg>
            <svg viewBox="0 0 48 32" className="h-6" fill="none">
              <rect width="48" height="32" rx="4" fill="#252525"/>
              <circle cx="19" cy="16" r="8" fill="#EB001B"/>
              <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
              <path d="M24 10.3C25.8 11.7 27 13.7 27 16C27 18.3 25.8 20.3 24 21.7C22.2 20.3 21 18.3 21 16C21 13.7 22.2 11.7 24 10.3Z" fill="#FF5F00"/>
            </svg>
            <svg viewBox="0 0 48 32" className="h-6" fill="none">
              <rect width="48" height="32" rx="4" fill="#006FCF"/>
              <text x="24" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">AMEX</text>
            </svg>
            <svg viewBox="0 0 48 32" className="h-6" fill="none">
              <rect width="48" height="32" rx="4" fill="#F5F7FA"/>
              <rect x="0.5" y="0.5" width="47" height="31" rx="3.5" stroke="#E5E7EB"/>
              <text x="24" y="18" textAnchor="middle" fill="#003087" fontSize="8" fontWeight="bold" fontFamily="Arial">PayPal</text>
            </svg>
            <svg viewBox="0 0 48 32" className="h-6" fill="none">
              <rect width="48" height="32" rx="4" fill="#C8102E"/>
              <text x="24" y="19" textAnchor="middle" fill="#FFD100" fontSize="10" fontWeight="bold" fontFamily="Arial">OXXO</text>
            </svg>
          </div>
          <p className="text-xs text-white/30">
            {t("ssl")}
          </p>
        </div>

        {/* Certifications */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {["NSF Certified", "FDA Compliant", "GMP Certified", "Non-GMO", "Gluten Free"].map((cert, i, arr) => (
            <span key={cert} className="flex items-center gap-3">
              <span className="text-xs text-white/30">{cert}</span>
              {i < arr.length - 1 && <span className="text-white/20 text-xs">·</span>}
            </span>
          ))}
        </div>

        {/* Disclaimer + copyright */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[11px] text-white/25 text-center mb-3 max-w-3xl mx-auto">
            {t("disclaimer")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-white/25">
            <span>&copy; 2024 Mannatech. {t("copyright")}.</span>
            <span className="hidden sm:inline">|</span>
            <span>
              {t("madeBy")}{" "}
              <span className="font-semibold text-white/40">DMLABS</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
