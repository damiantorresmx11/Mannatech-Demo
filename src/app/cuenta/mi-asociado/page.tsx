"use client";

import { mockCliente } from "@/lib/mock-data/cliente";
import { AvatarWithStatus } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, Mail, MessageCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function MiAsociadoPage() {
  const { asociado } = mockCliente;

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground mb-6">
        Mi Asociado
      </h1>

      {/* Associate card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
            Informacion de tu Asociado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar + name */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <AvatarWithStatus
                name={asociado.nombre}
                src={asociado.foto ?? undefined}
                status="online"
                size="lg"
              />
              <div className="mt-3">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {asociado.nombre}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-[#00A88F]/10 text-[#00A88F] dark:bg-[#00C9A7]/15 dark:text-[#00C9A7]"
                >
                  {asociado.nivel}
                </Badge>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex-1 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <Phone className="size-4 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Telefono
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {asociado.telefono}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <Mail className="size-4 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Correo
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 break-all">
                      {asociado.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp button */}
              <a
                href={`https://wa.me/${asociado.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button
                  variant="default"
                  size="lg"
                  className="gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                >
                  <MessageCircle className="size-4" />
                  Enviar WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card>
        <CardContent className="flex gap-3 items-start pt-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00A88F]/10 dark:bg-[#00C9A7]/15">
            <Info className="size-4 text-[#00A88F] dark:text-[#00C9A7]" />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tu asociado te ayuda con pedidos, consultas sobre productos y
            seguimiento de tu cuenta. No dudes en contactarlo para cualquier
            pregunta sobre los productos Mannatech o tu plan de bienestar
            personalizado.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
