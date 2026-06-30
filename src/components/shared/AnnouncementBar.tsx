"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronRight } from "lucide-react";

const messages = [
  "Con tu compra, juntos nutrimos a quienes más lo necesitan",
  "Suscríbete y ahorra 10% en tus productos favoritos",
  "Envío gratis en pedidos mayores a $2,999",
  "Garantía de satisfacción de 180 días",
];

const INTERVAL = 4000;

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % messages.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#f5f5f5] dark:bg-zinc-900 border-b border-border/50 text-xs h-10 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left — phone */}
        <a
          href="tel:+528001234567"
          className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <Phone size={12} />
          <span className="font-medium">800-123-4567</span>
        </a>

        {/* Center — rotating messages */}
        <div className="flex-1 flex items-center justify-center overflow-hidden h-10">
          <div className="relative w-full h-5">
            {messages.map((msg, i) => (
              <span
                key={msg}
                className={`absolute inset-0 flex items-center justify-center font-bold uppercase tracking-wider text-foreground/80 text-[11px] sm:text-xs whitespace-nowrap transition-all duration-500 ease-in-out ${
                  i === current
                    ? "opacity-100 translate-y-0"
                    : i === (current - 1 + messages.length) % messages.length
                      ? "opacity-0 translate-y-full"
                      : "opacity-0 -translate-y-full"
                }`}
              >
                {msg}
              </span>
            ))}
          </div>
        </div>

        {/* Right — find associate */}
        <button className="hidden sm:flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors font-medium flex-shrink-0">
          Encuentra un Asociado
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
