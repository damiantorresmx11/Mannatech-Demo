"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  Copy,
  Check,
  QrCode,
  FileText,
  Download,
  Share2,
  Camera,
  Globe,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockSocio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SOCIAL_ICONS: Record<string, typeof Camera> = {
  Instagram: Camera,
  Facebook: Globe,
  WhatsApp: MessageCircle,
};

const SOCIAL_COLORS: Record<string, { bg: string; text: string }> = {
  Instagram: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400" },
  Facebook: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  WhatsApp: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
};

export default function HerramientasPage() {
  const { herramientas, perfil } = mockSocio;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(herramientas.linkReferido);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Herramientas de Marketing
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Todo lo que necesitas para hacer crecer tu negocio
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="size-4 text-[#00A88F]" />
                Link de Referido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                Comparte este enlace con tus prospectos para que se registren bajo tu red.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 truncate font-mono">
                  {herramientas.linkReferido}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 mt-2"
                >
                  Enlace copiado al portapapeles
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="size-4 text-[#00A88F]" />
                Codigo QR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Escanea este codigo para acceder a tu enlace de referido.
              </p>
              <div className="flex justify-center">
                {/* QR Code placeholder - CSS grid pattern */}
                <div className="relative p-4 bg-white dark:bg-zinc-100 rounded-xl shadow-inner">
                  <svg
                    width="140"
                    height="140"
                    viewBox="0 0 140 140"
                    className="text-zinc-900"
                  >
                    {/* Top-left finder */}
                    <rect x="4" y="4" width="40" height="40" rx="4" fill="currentColor" />
                    <rect x="10" y="10" width="28" height="28" rx="2" fill="white" />
                    <rect x="16" y="16" width="16" height="16" rx="1" fill="currentColor" />
                    {/* Top-right finder */}
                    <rect x="96" y="4" width="40" height="40" rx="4" fill="currentColor" />
                    <rect x="102" y="10" width="28" height="28" rx="2" fill="white" />
                    <rect x="108" y="16" width="16" height="16" rx="1" fill="currentColor" />
                    {/* Bottom-left finder */}
                    <rect x="4" y="96" width="40" height="40" rx="4" fill="currentColor" />
                    <rect x="10" y="102" width="28" height="28" rx="2" fill="white" />
                    <rect x="16" y="108" width="16" height="16" rx="1" fill="currentColor" />
                    {/* Data modules (decorative pattern) */}
                    {[50, 58, 66, 74, 82].map((x) =>
                      [10, 18, 26, 34, 42].map((y) => (
                        <rect
                          key={`${x}-${y}`}
                          x={x}
                          y={y}
                          width="6"
                          height="6"
                          fill="currentColor"
                          opacity={(x + y) % 16 === 0 ? 0.3 : 1}
                        />
                      ))
                    )}
                    {[10, 22, 34, 50, 62, 74].map((x) =>
                      [50, 58, 66, 74, 82, 90].map((y) => (
                        <rect
                          key={`d-${x}-${y}`}
                          x={x}
                          y={y}
                          width="6"
                          height="6"
                          fill="currentColor"
                          opacity={(x * y) % 7 === 0 ? 0 : 1}
                        />
                      ))
                    )}
                    {[50, 62, 74, 86, 98, 110, 122].map((x) =>
                      [50, 62, 74, 86, 98, 110, 122].map((y) => {
                        if (x > 90 && y > 90) return null;
                        return (
                          <rect
                            key={`p-${x}-${y}`}
                            x={x}
                            y={y}
                            width="5"
                            height="5"
                            fill="currentColor"
                            opacity={(x + y) % 12 < 6 ? 1 : 0}
                          />
                        );
                      })
                    )}
                    {/* Center Mannatech accent */}
                    <rect x="56" y="56" width="28" height="28" rx="4" fill="#00A88F" />
                    <text
                      x="70"
                      y="74"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="white"
                    >
                      M
                    </text>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-center text-zinc-400 dark:text-zinc-500 mt-3">
                ID: {perfil.id}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Downloadable Materials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-[#00A88F]" />
              Materiales Descargables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {herramientas.materiales.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <FileText className="size-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                      {mat.nombre}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {mat.tipo} · {mat.tamano}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <Download className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Media Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="size-4 text-[#00A88F]" />
              Plantillas para Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {herramientas.plantillasSocial.map((tpl) => {
                const Icon = SOCIAL_ICONS[tpl.red] || Share2;
                const colors = SOCIAL_COLORS[tpl.red] || {
                  bg: "bg-zinc-100 dark:bg-zinc-800",
                  text: "text-zinc-600 dark:text-zinc-400",
                };

                return (
                  <div
                    key={tpl.id}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-sm transition-all"
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        colors.bg
                      )}
                    >
                      <Icon className={cn("size-5", colors.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {tpl.nombre}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {tpl.red}
                      </p>
                    </div>
                    {/* Visual placeholder thumbnail */}
                    <div className="hidden sm:flex size-14 shrink-0 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 items-center justify-center">
                      <Icon className="size-5 text-zinc-400 dark:text-zinc-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
