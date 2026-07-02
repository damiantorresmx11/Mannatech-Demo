"use client";

import { useState } from "react";
import { mockAdmin } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const { usuarios } = mockAdmin;

const TIPO_BADGE: Record<string, { label: string; className: string }> = {
  cliente: { label: "Cliente", className: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" },
  socio: { label: "Socio", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  admin: { label: "Admin", className: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
};

function UsuariosTable({ data }: { data: typeof usuarios }) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Nombre</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Email</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Tipo</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Fecha Registro</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Ultima Actividad</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Estatus</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            data.map((u) => {
              const tipoBadge = TIPO_BADGE[u.tipo] ?? TIPO_BADGE.cliente;
              return (
                <tr
                  key={u.id}
                  onClick={() => router.push(`/admin/usuarios/${u.id}`)}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{u.nombre}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tipoBadge.className}`}>
                      {tipoBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{u.fechaRegistro}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{u.ultimaActividad}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.estatus === "activo" ? "Activo" : "Inactivo"} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function UsuariosPage() {
  const clientes = usuarios.filter((u) => u.tipo === "cliente");
  const socios = usuarios.filter((u) => u.tipo === "socio");
  const admins = usuarios.filter((u) => u.tipo === "admin");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Usuarios</h1>
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Tabs defaultValue="clientes">
        <TabsList>
          <TabsTrigger value="clientes">Clientes ({clientes.length})</TabsTrigger>
          <TabsTrigger value="socios">Socios ({socios.length})</TabsTrigger>
          <TabsTrigger value="admins">Administradores ({admins.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes">
          <UsuariosTable data={clientes} />
        </TabsContent>
        <TabsContent value="socios">
          <UsuariosTable data={socios} />
        </TabsContent>
        <TabsContent value="admins">
          <UsuariosTable data={admins} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
