"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronRight, Heart, Truck, Shield, Sparkles } from "lucide-react";

const messages = [
  { icon: Heart, text: "Con tu compra, juntos nutrimos a quienes mas lo necesitan" },
  { icon: Sparkles, text: "Suscribete y ahorra 10% en tus productos favoritos" },
  { icon: Truck, text: "Envio gratis en pedidos mayores a $2,999" },
  { icon: Shield, text: "Garantia de satisfaccion de 180 dias" },
];

const INTERVAL = 4500;

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % messages.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const Icon = messages[current].icon;

  return (
    <div className="w-full bg-gradient-to-r from-mannatech-dark via-mannatech to-mannatech-dark dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-white text-xs h-10 flex items-center relative overflow-hidden">
      {/* Subtle shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
        {/* Left — phone */}
        <a
          href="tel:+528001234567"
          className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white transition-colors flex-shrink-0"
        >
          <Phone size={12} />
          <span className="font-medium">800-123-4567</span>
        </a>

        {/* Center — rotating messages */}
        <div className="flex-1 flex items-center justify-center overflow-hidden h-10">
          <div className="relative w-full h-5">
            {messages.map((msg, i) => (
              <span
                key={msg.text}
                className={`absolute inset-0 flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-white text-[10px] sm:text-[11px] whitespace-nowrap transition-all duration-500 ease-in-out ${
                  i === current
                    ? "opacity-100 translate-y-0"
                    : i === (current - 1 + messages.length) % messages.length
                      ? "opacity-0 translate-y-full"
                      : "opacity-0 -translate-y-full"
                }`}
              >
                <msg.icon size={13} className="flex-shrink-0" />
                {msg.text}
              </span>
            ))}
          </div>
        </div>

        {/* Right — find associate */}
        <button className="hidden sm:flex items-center gap-0.5 text-white/70 hover:text-white transition-colors font-medium flex-shrink-0">
          Encuentra un Asociado
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
