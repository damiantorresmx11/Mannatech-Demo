"use client";

import { motion } from "framer-motion";
import { Calendar, Video, BookOpen, PartyPopper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockSocio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const EVENT_CONFIG: Record<string, { icon: typeof Video; bg: string; text: string; badge: string; badgeColor: string }> = {
  webinar: {
    icon: Video,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    badge: "Webinar",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  entrenamiento: {
    icon: BookOpen,
    bg: "bg-[#00A88F]/10 dark:bg-[#00C9A7]/15",
    text: "text-[#00A88F] dark:text-[#00C9A7]",
    badge: "Entrenamiento",
    badgeColor: "bg-[#00A88F]/10 text-[#00A88F] dark:bg-[#00C9A7]/15 dark:text-[#00C9A7]",
  },
  evento: {
    icon: PartyPopper,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    badge: "Evento",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
};

const MONTHS_ES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export default function CalendarioPage() {
  const { calendario } = mockSocio;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground flex items-center gap-2">
          <Calendar className="size-6 text-[#00A88F]" />
          Calendario de Eventos
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Proximos eventos, capacitaciones y webinars
        </p>
      </motion.div>

      {/* Events List */}
      <div className="space-y-4">
        {calendario.map((evento, i) => {
          const config = EVENT_CONFIG[evento.tipo] || EVENT_CONFIG.evento;
          const Icon = config.icon;
          const date = new Date(evento.fecha + "T00:00:00");
          const day = date.getDate();
          const month = MONTHS_ES[date.getMonth()];

          return (
            <motion.div
              key={evento.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="pt-1">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Date block */}
                    <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 shrink-0 sm:w-20">
                      <div
                        className={cn(
                          "flex size-14 sm:size-16 items-center justify-center rounded-xl",
                          config.bg
                        )}
                      >
                        <div className="text-center">
                          <div className={cn("text-xl sm:text-2xl font-bold leading-none", config.text)}>
                            {day}
                          </div>
                          <div className={cn("text-[10px] sm:text-xs font-medium uppercase mt-0.5", config.text)}>
                            {month}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {evento.titulo}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            config.badgeColor
                          )}
                        >
                          <Icon className="size-3" />
                          {config.badge}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                        {evento.hora} hrs
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {evento.descripcion}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex sm:items-center shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-[#00A88F] hover:bg-[#00A88F]/90 dark:bg-[#00C9A7] dark:hover:bg-[#00C9A7]/90 text-white"
                      >
                        Registrarse
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
