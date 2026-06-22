"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations("landing.newsletter");

  return (
    <section className="py-20 bg-gradient-to-br from-mannatech to-mannatech-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
          <Mail size={24} className="text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {t("headline")}
        </h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t("placeholder")}
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
          />
          <button className="px-6 py-3.5 bg-white text-mannatech-dark font-semibold rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap">
            {t("subscribe")}
          </button>
        </div>

        <p className="text-xs text-white/40 mt-4">
          {t("consent")}
        </p>
      </motion.div>
    </section>
  );
}
