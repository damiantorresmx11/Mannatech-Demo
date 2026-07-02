"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Play,
  Clock,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockSocio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AprendizajePage() {
  const { aprendizaje } = mockSocio;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground flex items-center gap-2">
          <GraduationCap className="size-6 text-[#00A88F]" />
          Centro de Aprendizaje
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Desarrolla tus habilidades y crece como lider
        </p>
      </motion.div>

      {/* In Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            En Progreso
          </h2>
          {aprendizaje.enProgreso.length > 3 && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {aprendizaje.enProgreso.map((curso, i) => (
            <motion.div
              key={curso.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="min-w-[300px] max-w-[340px] snap-start flex-shrink-0"
            >
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-[#00A88F]/20 to-[#00A88F]/5 dark:from-[#00C9A7]/20 dark:to-[#00C9A7]/5 flex items-center justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 shadow-md">
                    <Play className="size-7 text-[#00A88F] dark:text-[#00C9A7] ml-0.5" />
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                    <Clock className="size-3" />
                    {curso.duracion}
                  </div>
                </div>

                <CardContent className="pt-3">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
                    {curso.titulo}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    {curso.modulosCompletados} de {curso.modulos} modulos completados
                  </p>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${curso.progreso}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className="h-full rounded-full bg-[#00A88F] dark:bg-[#00C9A7]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#00A88F] dark:text-[#00C9A7]">
                      {curso.progreso}%
                    </span>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#00A88F] hover:bg-[#00A88F]/90 dark:bg-[#00C9A7] dark:hover:bg-[#00C9A7]/90 text-white"
                    >
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Completed Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Completados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {aprendizaje.completados.map((curso, i) => {
            const date = new Date(curso.fechaCompletado + "T00:00:00");
            return (
              <motion.div
                key={curso.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <div className="flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="size-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {curso.titulo}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      Completado{" "}
                      {date.toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
