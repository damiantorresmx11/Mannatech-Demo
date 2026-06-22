"use client";

import { useCallback } from "react";
import { MessageCircle } from "lucide-react";

interface ShareWhatsAppProps {
  productoNombre: string;
  productoSlug: string;
  className?: string;
  size?: "sm" | "md";
}

export function ShareWhatsApp({
  productoNombre,
  productoSlug,
  className = "",
  size = "sm",
}: ShareWhatsAppProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const origin = window.location.origin;
      const mensaje = encodeURIComponent(
        `¡Mira este producto de Mannatech! ${productoNombre}. Conoce más aquí: ${origin}/productos/${productoSlug}`
      );
      window.open(`https://wa.me/?text=${mensaje}`, "_blank");
    },
    [productoNombre, productoSlug]
  );

  const sizeClasses =
    size === "sm" ? "p-2 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20BD5A] transition-colors cursor-pointer ${sizeClasses} ${className}`}
    >
      <MessageCircle size={size === "sm" ? 14 : 16} />
      {size === "md" && "Compartir por WhatsApp"}
    </button>
  );
}
