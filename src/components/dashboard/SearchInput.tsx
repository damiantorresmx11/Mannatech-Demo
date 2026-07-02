"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors focus-within:border-[#00A88F] focus-within:ring-1 focus-within:ring-[#00A88F]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-[#00C9A7] dark:focus-within:ring-[#00C9A7]/30",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-zinc-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-zinc-700 outline-none placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="shrink-0 rounded-sm p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          aria-label="Limpiar busqueda"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
