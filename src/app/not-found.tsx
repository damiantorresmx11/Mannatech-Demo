"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const digits = ["4", "0", "4"];

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-mannatech/5 px-4">
      {/* Floating gradient orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-mannatech/8 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full bg-mannatech-light/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-mannatech/5 blur-[80px] pointer-events-none"
      />

      <div className="relative text-center">
        {/* Large animated 404 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {digits.map((digit, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                type: "spring",
                stiffness: 150,
                damping: 15,
              }}
              className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-br from-mannatech to-mannatech-light bg-clip-text text-transparent select-none"
            >
              {digit}
            </motion.span>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
        >
          Esta pagina no existe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="text-muted-foreground mb-10 max-w-md mx-auto"
        >
          Parece que te perdiste. Vamos a llevarte de vuelta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-mannatech text-white font-semibold rounded-xl shadow-lg shadow-mannatech/25 hover:bg-mannatech-dark transition-colors"
            >
              Ir al inicio
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-foreground font-semibold rounded-xl border border-border hover:border-mannatech/40 hover:bg-mannatech/5 transition-colors"
            >
              Explorar productos
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
