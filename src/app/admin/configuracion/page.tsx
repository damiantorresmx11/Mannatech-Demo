"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CreditCard, Building2 } from "lucide-react";
import Link from "next/link";

const { configuracion } = mockAdmin;

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Configuracion</h1>

      {/* Company info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Informacion de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">Nombre</span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{configuracion.empresa.nombre}</p>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">RFC</span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{configuracion.empresa.rfc}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-zinc-500 dark:text-zinc-400">Direccion</span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{configuracion.empresa.direccion}</p>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">Telefono</span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{configuracion.empresa.telefono}</p>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">Email</span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{configuracion.empresa.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax settings */}
      <Card>
        <CardHeader>
          <CardTitle>Impuestos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">IVA</span>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{configuracion.impuestos.iva}%</p>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">IEPS</span>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{configuracion.impuestos.ieps}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links to sub-pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/configuracion/envios">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-1">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
                  <Truck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Envios</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Zonas, costos y tiempos de entrega</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/configuracion/pagos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-1">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
                  <CreditCard className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Pagos</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Metodos de pago y comisiones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
