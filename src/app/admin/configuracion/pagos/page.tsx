"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

const { configuracion } = mockAdmin;

export default function PagosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/configuracion"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Configuracion
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Metodos de Pago</h1>
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Agregar Metodo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {configuracion.metodosPago.map((metodo, i) => (
          <Card key={i}>
            <CardContent className="pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <CreditCard className="size-5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{metodo.nombre}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Comision: {metodo.comision}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`size-3 rounded-full ${
                      metodo.activo ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {metodo.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
