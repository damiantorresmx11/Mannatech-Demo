"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-red-50/30">
      {/* Subtle bg gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-red-100/40 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-mannatech/5 blur-[80px]" />
      </div>

      <div className="relative text-center max-w-md mx-auto">
        {/* Animated warning triangle SVG */}
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
        >
          <motion.path
            d="M40 10 L72 65 L8 65 Z"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
          />
          <motion.line
            x1="40"
            y1="32"
            x2="40"
            y2="48"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
          <motion.circle
            cx="40"
            cy="55"
            r="2"
            fill="#ef4444"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />
        </motion.svg>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
        >
          Algo salio mal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="text-muted-foreground mb-8"
        >
          Ocurrio un error inesperado. Intenta de nuevo o regresa al inicio.
        </motion.p>

        {/* Error details collapsible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            {showDetails ? "Ocultar detalles" : "Ver detalles del error"}
          </button>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-3 bg-slate-100 rounded-xl p-4 text-left text-xs text-muted-foreground font-mono overflow-auto max-h-32"
            >
              <p>{error.message}</p>
              {error.digest && (
                <p className="mt-1 text-slate-400">Digest: {error.digest}</p>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => unstable_retry()}
            className="px-7 py-3.5 bg-mannatech text-white font-semibold rounded-xl shadow-lg shadow-mannatech/25 hover:bg-mannatech-dark transition-colors"
          >
            Intentar de nuevo
          </motion.button>
          <Link
            href="/"
            className="px-7 py-3.5 bg-white text-foreground font-semibold rounded-xl border border-border hover:border-mannatech/40 hover:bg-mannatech/5 transition-colors"
          >
            Ir al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
