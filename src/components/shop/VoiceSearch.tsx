"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

interface VoiceSearchProps {
  onResult: (query: string) => void;
}

export function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [listening, setListening] = useState(false);

  function handleClick() {
    if (listening) return;
    setListening(true);

    // Mock: after 2s, "hear" Ambrotose
    setTimeout(() => {
      setListening(false);
      onResult("Ambrotose");
    }, 2000);
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`p-3 rounded-xl border transition-all duration-300 ${
          listening
            ? "bg-mannatech text-white border-mannatech shadow-lg shadow-mannatech/30"
            : "border-border bg-white hover:border-mannatech/40 hover:bg-mannatech/5 text-muted-foreground"
        }`}
        aria-label="Busqueda por voz"
        title="Busqueda por voz (demo)"
      >
        <Mic size={18} />
      </button>

      {/* Pulsing rings */}
      <AnimatePresence>
        {listening && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut" as const,
                }}
                className="absolute inset-0 rounded-xl border-2 border-mannatech pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
