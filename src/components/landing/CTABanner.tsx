"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function CTABanner() {
  return (
    <section id="unete" className="relative py-24 sm:py-32 overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Gana dinero globalmente
          </h2>
          <h3 className="text-xl sm:text-2xl font-light text-white/80 mb-8">
            La Oportunidad Definitiva
          </h3>
          <Link
            href="/distribuidores/maria-lopez"
            className="btn-magnetic btn-ripple inline-flex items-center px-8 py-4 bg-white text-mannatech-dark font-bold rounded-xl hover:bg-white/90 transition-colors text-base shadow-xl"
          >
            Conoce Más
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
