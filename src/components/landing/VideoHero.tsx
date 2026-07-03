"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";
import { useState } from "react";

const DEFAULT_CONTENT = {
  overline: "Descubre Mannatech",
  heading: "La Ciencia del Bienestar",
  subheading: "Más de 30 años transformando vidas con tecnología patentada de gliconutrientes",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  videoPoster: "https://mx.mannatech.com/wp-content/themes/mannatech/img/transform-03.jpg",
  cta: { text: "Ver Productos", href: "/productos" },
  ctaSecondary: { text: "Conocer Más", href: "/quienes-somos" },
};

export function VideoHero({ cms }: { cms?: Record<string, any> }) {
  const c = { ...DEFAULT_CONTENT, ...cms };
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${c.videoPoster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-mannatech-dark/70" />
      </div>

      {/* Floating SVG decorations */}
      <svg className="absolute top-20 left-10 w-24 h-24 text-mannatech/10 animate-float" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" />
      </svg>
      <svg className="absolute bottom-32 right-16 w-16 h-16 text-emerald-400/10 animate-float-delayed" viewBox="0 0 100 100" fill="currentColor">
        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
      </svg>
      <svg className="absolute top-1/3 right-1/4 w-8 h-8 text-amber-400/15 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-mannatech text-xs font-semibold uppercase tracking-[0.4em] mb-4"
        >
          {c.overline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
        >
          {c.heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10"
        >
          {c.subheading}
        </motion.p>

        {/* Play button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setShowVideo(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-mannatech flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={18} className="ml-0.5" fill="white" />
            </div>
            <span className="font-semibold">Ver Video</span>
          </button>

          <Link
            href={c.cta?.href || "/productos"}
            className="px-8 py-4 bg-mannatech text-white font-semibold rounded-2xl hover:bg-mannatech-dark transition-colors shadow-lg shadow-mannatech/30"
          >
            {c.cta?.text || "Ver Productos"}
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="animate-bounce"
        >
          <ChevronDown size={24} className="text-white/40 mx-auto" />
        </motion.div>
      </div>

      {/* Video modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={c.videoUrl}
              className="w-full h-full rounded-2xl"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-3deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
      `}</style>
    </section>
  );
}
