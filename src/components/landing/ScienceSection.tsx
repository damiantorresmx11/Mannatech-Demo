"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FlaskConical, Dna, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight";
import { BlurFade } from "@/components/ui/blur-fade";

const categoryDefs = [
  {
    key: "cellCommunication" as const,
    icon: Dna,
    gradient: "from-mannatech to-mannatech-dark",
  },
  {
    key: "immuneSystem" as const,
    icon: ShieldCheck,
    gradient: "from-mannatech-light to-mannatech",
  },
  {
    key: "digestiveHealth" as const,
    icon: FlaskConical,
    gradient: "from-mannatech-light/70 to-mannatech-light",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function ScienceSection() {
  const t = useTranslations("landing.science");
  return (
    <section
      id="ciencia"
      data-label={t("sectionLabel")}
      className="relative py-32 scroll-snap-section overflow-hidden"
    >
      {/* Background image from Mannatech */}
      <div className="absolute inset-0">
        <Image
          src="https://mx.mannatech.com/wp-content/uploads/sites/16/2016/10/bg-opportunity.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-mannatech-light mb-4">
            {t("overline")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            {t("headline")}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {categoryDefs.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                variants={cardVariants}
              >
              <SpotlightCard
                spotlightColor="rgba(0,168,143,0.15)"
                className="rounded-3xl backdrop-blur-xl bg-white/10 border border-white/15 p-8 sm:p-10 hover:bg-white/15 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-mannatech/20 flex items-center justify-center mb-6">
                  <Icon size={26} className="text-mannatech-light" />
                </div>
                <span className="inline-flex px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-white/70 tracking-wide mb-4">
                  {t(`categories.${cat.key}.label`)}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3">
                  {t(`categories.${cat.key}.title`)}
                </h3>
                <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${cat.gradient} opacity-60 group-hover:w-20 transition-all duration-500`} />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-mannatech/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
