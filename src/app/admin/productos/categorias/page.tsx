"use client";

import { mockAdmin } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const { productos } = mockAdmin;

const categorias = [
  { nombre: "Suplementos", color: "#00A88F" },
  { nombre: "Cuidado Personal", color: "#3B82F6" },
  { nombre: "Nutricion", color: "#F59E0B" },
  { nombre: "Peso Ideal", color: "#8B5CF6" },
  { nombre: "Aceites Esenciales", color: "#EC4899" },
];

export default function CategoriasPage() {
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
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Categorias</h1>
        <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Nueva Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((cat) => {
          const count = productos.filter((p) => p.categoria === cat.nombre).length;
          return (
            <Card key={cat.nombre} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-1">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-lg"
                    style={{ backgroundColor: cat.color + "20" }}
                  >
                    <div
                      className="size-full rounded-lg flex items-center justify-center"
                    >
                      <div
                        className="size-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{cat.nombre}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {count} producto{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
