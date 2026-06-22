"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight } from "lucide-react";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("mannatech-promo-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    setShow(false);
    localStorage.setItem("mannatech-promo-dismissed", "true");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(handleDismiss, 3000);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            {/* Top banner — dark with brand */}
            <div className="relative bg-[#0A0A0A] px-7 pt-8 pb-6 text-center overflow-hidden">
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "radial-gradient(circle at 50% 120%, rgba(0,168,143,0.4) 0%, transparent 60%)",
                }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-mannatech/20 flex items-center justify-center mx-auto mb-4"
              >
                <Gift size={28} className="text-mannatech" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10"
              >
                <p className="text-mannatech text-xs font-semibold uppercase tracking-[0.3em] mb-2">
                  Oferta exclusiva
                </p>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <span className="text-mannatech">15%</span> de descuento
                </h3>
                <p className="text-white/50 text-sm">
                  en tu primera compra
                </p>
              </motion.div>
            </div>

            {/* Bottom — form */}
            <div className="bg-white dark:bg-zinc-900 px-7 py-6">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Suscríbete y recibe tu código de descuento al instante.
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-mannatech/30 focus:border-mannatech transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-mannatech text-white font-semibold rounded-xl hover:bg-mannatech-dark transition-colors text-sm"
                    >
                      Obtener mi descuento
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="w-full py-2 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      No gracias, prefiero pagar precio completo
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    {/* Animated check */}
                    <svg width="56" height="56" viewBox="0 0 56 56" className="mx-auto mb-4">
                      <circle
                        cx="28" cy="28" r="25"
                        fill="none" stroke="#00A88F" strokeWidth="2.5"
                        strokeDasharray="157" strokeDashoffset="157"
                        className="animate-[draw-circle_0.5s_ease-out_forwards]"
                      />
                      <path
                        d="M18 29 L24 35 L38 21"
                        fill="none" stroke="#00A88F" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="35" strokeDashoffset="35"
                        className="animate-[draw-mark_0.3s_0.4s_ease-out_forwards]"
                      />
                    </svg>
                    <p className="font-bold text-lg text-foreground mb-1">
                      ¡Código enviado!
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Revisa tu correo para tu código
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-mannatech/10 border border-mannatech/20">
                      <span className="text-mannatech font-mono font-bold tracking-wider">MANNA15</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
