"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function CTABanner() {
  const t = useTranslations("landing.cta");

  return (
    <section className="relative py-32 overflow-hidden scroll-snap-section">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://mx.mannatech.com/wp-content/themes/mannatech/img/transform-03.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-mannatech/90 via-mannatech-dark/85 to-black/80" />
      </div>

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
            {t("headline")}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/productos"
              className="inline-flex items-center px-10 py-4 bg-white text-mannatech-dark font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 text-base"
            >
              {t("exploreProducts")}
            </Link>
            <Link
              href="#contacto"
              className="inline-flex items-center px-10 py-4 border-2 border-white/60 text-white font-semibold rounded-full hover:border-white hover:bg-white/10 transition-all duration-300 text-base"
            >
              {t("talkToAdvisor")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
