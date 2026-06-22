"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import {
  detectCardBrand,
  formatCardNumber,
  type CardBrand,
} from "@/lib/card";

const BRAND_STYLES: Record<CardBrand, { label: string; className: string }> = {
  visa: { label: "Visa", className: "bg-blue-500/15 text-blue-400" },
  mastercard: { label: "Mastercard", className: "bg-amber-500/15 text-amber-400" },
  amex: { label: "Amex", className: "bg-emerald-500/15 text-emerald-400" },
  unknown: { label: "", className: "" },
};

export default function CardNumberInput({
  value,
  onChange,
}: {
  value: string;
  onChange?: (formatted: string, brand: CardBrand) => void;
}) {
  const [internal, setInternal] = useState(value ?? "");
  const brand = detectCardBrand(internal);
  const meta = BRAND_STYLES[brand];

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setInternal(formatted);
    onChange?.(formatted, detectCardBrand(formatted));
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
        Número de tarjeta
      </label>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          value={internal}
          onChange={handle}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-28 font-mono tabular-nums tracking-wider text-foreground outline-none transition focus:border-mannatech focus:ring-2 focus:ring-mannatech/20"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {brand === "unknown" ? (
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          ) : (
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${meta.className}`}
            >
              {meta.label}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
