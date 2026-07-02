"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, AvatarWithStatus } from "@/components/dashboard";
import { ArrowLeft, UserCog, Power } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const { usuarios } = mockAdmin;

const TIPO_LABELS: Record<string, string> = {
  cliente: "Cliente",
  socio: "Socio",
  admin: "Administrador",
};

export default function UsuarioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const usuario = usuarios.find((u) => u.id === id) ?? usuarios[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/usuarios"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Usuarios
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{usuario.nombre}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <AvatarWithStatus name={usuario.nombre} status={usuario.estatus === "activo" ? "online" : "offline"} size="lg" />
            <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">{usuario.nombre}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{usuario.email}</p>
            <div className="mt-2">
              <StatusBadge status={usuario.estatus === "activo" ? "Activo" : "Inactivo"} />
            </div>
            <div className="mt-4 w-full space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Tipo</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{TIPO_LABELS[usuario.tipo]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Telefono</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{usuario.telefono}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Registro</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{usuario.fechaRegistro}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 dark:text-zinc-400">Ultima Actividad</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{usuario.ultimaActividad}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2 w-full">
              <Button variant="outline" className="flex-1 gap-1.5">
                <Power className="size-4" />
                {usuario.estatus === "activo" ? "Desactivar" : "Activar"}
              </Button>
              <Button variant="outline" className="flex-1 gap-1.5">
                <UserCog className="size-4" />
                Cambiar Rol
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{usuario.pedidos}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Pedidos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${usuario.gastoTotal.toLocaleString("es-MX")}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Gasto Total</p>
                </div>
                {usuario.tipo === "socio" && (
                  <>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {(usuario as any).nivel ?? "---"}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Nivel</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {(usuario as any).pv?.toLocaleString("es-MX") ?? "---"}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">PV</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {(usuario as any).red ?? "---"}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Miembros en Red</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Direccion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{usuario.direccion}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
