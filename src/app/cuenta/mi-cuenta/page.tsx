"use client";

import { mockCliente } from "@/lib/mock-data/cliente";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function MiCuentaPage() {
  const { perfil } = mockCliente;

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.h1
        className="text-2xl font-bold text-[#262626] dark:text-foreground mb-6"
        {...fadeUp}
      >
        Mi Cuenta
      </motion.h1>

      {/* Profile info */}
      <motion.div {...fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
              Informacion Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Nombre completo
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <User className="size-4 text-zinc-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {perfil.nombre}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Correo electronico
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <Mail className="size-4 text-zinc-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {perfil.email}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Telefono
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <Phone className="size-4 text-zinc-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {perfil.telefono}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
              ID de cliente: {perfil.id} &middot; Registrado desde{" "}
              {new Date(perfil.fechaRegistro).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Addresses */}
      <motion.div {...fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-[#00A88F] dark:text-[#00C9A7]" />
              Mis Direcciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {perfil.direcciones.map((dir) => (
                <div
                  key={dir.id}
                  className="relative rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  {dir.predeterminada && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 bg-[#00A88F]/10 text-[#00A88F] dark:bg-[#00C9A7]/15 dark:text-[#00C9A7]"
                    >
                      Predeterminada
                    </Badge>
                  )}
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {dir.alias}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {dir.calle}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {dir.colonia}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {dir.ciudad}, {dir.estado} {dir.cp}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
