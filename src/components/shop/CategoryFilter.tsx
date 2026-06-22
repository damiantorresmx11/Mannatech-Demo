"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Categoria } from "@/lib/types";

interface CategoryFilterProps {
  categorias: Categoria[];
  activeCategoria: string | null;
}

export function CategoryFilter({
  categorias,
  activeCategoria,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilter(categoriaId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoriaId) {
      params.set("categoria", categoriaId);
    } else {
      params.delete("categoria");
    }
    router.push(`/productos?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => handleFilter(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeCategoria
            ? "bg-mannatech text-white"
            : "bg-muted text-muted-foreground hover:bg-mannatech/10"
        }`}
      >
        Todos
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleFilter(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategoria === cat.id
              ? "bg-mannatech text-white"
              : "bg-muted text-muted-foreground hover:bg-mannatech/10"
          }`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
