"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  textos: {
    titulo: string;
    texto: string;
    cta: string;
    nota: string;
  };
}

export function CheckoutModal({
  open,
  onOpenChange,
  textos,
}: CheckoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="text-mannatech" size={20} />
            {textos.titulo}
          </DialogTitle>
          <DialogDescription>{textos.texto}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            className="bg-mannatech hover:bg-mannatech-dark text-white"
            onClick={() => onOpenChange(false)}
          >
            <ExternalLink size={16} className="mr-2" />
            {textos.cta}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {textos.nota}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
