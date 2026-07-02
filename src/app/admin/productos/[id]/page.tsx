"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const { productos } = mockAdmin;

const categorias = ["Suplementos", "Nutricion", "Cuidado Personal", "Peso Ideal", "Aceites Esenciales"];

export default function ProductoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const producto = productos.find((p) => p.id === id) ?? productos[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/productos"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Productos
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{producto.nombre}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Editar Producto</h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={producto.estatus === "activo" ? "Activo" : producto.estatus === "pausado" ? "Pausado" : "Agotado"} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacion General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nombre</label>
                <input
                  type="text"
                  defaultValue={producto.nombre}
                  disabled
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">SKU</label>
                  <input
                    type="text"
                    defaultValue={producto.sku}
                    disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Categoria</label>
                  <select
                    defaultValue={producto.categoria}
                    disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Precio (MXN)</label>
                  <input
                    type="number"
                    defaultValue={producto.precio}
                    disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Stock</label>
                  <input
                    type="number"
                    defaultValue={producto.stock}
                    disabled
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descripcion</label>
                <textarea
                  defaultValue={producto.descripcion}
                  disabled
                  rows={4}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Estatus:</label>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className={`size-3 rounded-full ${producto.estatus === "activo" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {producto.estatus === "activo" ? "Activo" : "Pausado"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Imagen del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-700 dark:bg-zinc-800/50">
                <Upload className="size-8 text-zinc-400 mb-2" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Arrastra una imagen aqui</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG hasta 5MB</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadisticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Ventas (30d)</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{producto.ventas30d} uds</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Ingresos (30d)</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  ${(producto.ventas30d * producto.precio).toLocaleString("es-MX")}.00 MXN
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Stock actual</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{producto.stock} uds</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="size-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
