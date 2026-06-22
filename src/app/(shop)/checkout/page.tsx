"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, CreditCard, MapPin, Package, User, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import SpeedingTruck from "@/components/shop/SpeedingTruck";
import CardNumberInput from "@/components/shop/CardNumberInput";
import { detectCardBrand, formatCardNumber, type CardBrand } from "@/lib/card";
import OrderConfirmation from "@/components/shop/OrderConfirmation";
import { formatPrecio } from "@/lib/format";

const steps = [
  { id: 1, label: "Datos", icon: User },
  { id: 2, label: "Envio", icon: MapPin },
  { id: 3, label: "Pago", icon: CreditCard },
  { id: 4, label: "Confirmacion", icon: Package },
];

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

// Full-screen confetti explosion
function ConfettiExplosion() {
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.5;
        const velocity = 150 + Math.random() * 250;
        return {
          id: i,
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity - 100,
          rotation: Math.random() * 720,
          size: Math.random() * 8 + 4,
          color: ["#00897B", "#4DB6AC", "#00695C", "#80CBC4", "#26A69A", "#FFD700", "#FF6B6B", "#8B5CF6"][i % 8],
          delay: Math.random() * 0.3,
          shape: i % 3, // 0: circle, 1: square, 2: rectangle
        };
      }),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0, 1, 1, 0.3],
            rotate: p.rotation,
          }}
          transition={{
            duration: 2,
            delay: 0.3 + p.delay,
            ease: "easeOut" as const,
          }}
          className="absolute"
          style={{
            width: p.shape === 2 ? p.size * 2 : p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 0 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

// Brand-aware gradient map
const CARD_GRADIENTS: Record<CardBrand, string> = {
  visa: "from-[#1a1f71] to-[#2557d6]",
  mastercard: "from-[#eb001b] via-[#f79e1b] to-[#ff5f00]",
  amex: "from-[#006fcf] to-[#00aeef]",
  unknown: "from-mannatech to-mannatech-dark",
};

const CARD_BACK_GRADIENTS: Record<CardBrand, string> = {
  visa: "from-[#2557d6] to-[#0d1b4a]",
  mastercard: "from-[#cc0000] to-[#4a0000]",
  amex: "from-[#00aeef] to-[#003a6b]",
  unknown: "from-mannatech-dark to-[#004D40]",
};

function AnimatedCreditCard({ form, showBack }: { form: FormData; showBack: boolean }) {
  const brand = detectCardBrand(form.numeroTarjeta);
  const frontGrad = CARD_GRADIENTS[brand];
  const backGrad = CARD_BACK_GRADIENTS[brand];
  const brandLabel = brand === "unknown" ? "DEMO" : brand.toUpperCase();

  return (
    <div className="perspective-[800px] h-52 mb-4">
      <motion.div
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${frontGrad} rounded-2xl p-6 text-white shadow-2xl`}
          style={{ backfaceVisibility: "hidden" }}
          layout
        >
          {/* Holographic sheen */}
          <div
            className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.3) 40%, transparent 60%)",
            }}
          />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-auto">
              {/* Chip */}
              <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-300 shadow-inner" />
              {/* Brand */}
              <motion.span
                key={brand}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-bold tracking-widest opacity-80"
              >
                {brandLabel}
              </motion.span>
            </div>

            {/* Number */}
            <p className="text-xl tracking-[0.2em] font-mono my-4 opacity-95">
              {form.numeroTarjeta || "**** **** **** ****"}
            </p>

            <div className="flex justify-between text-xs mt-auto">
              <div>
                <p className="opacity-40 text-[10px] mb-0.5">TITULAR</p>
                <p className="opacity-85 uppercase tracking-wider text-sm font-medium">
                  {form.nombre || "NOMBRE COMPLETO"}
                </p>
              </div>
              <div className="text-right">
                <p className="opacity-40 text-[10px] mb-0.5">VENCE</p>
                <p className="opacity-85 font-mono">{form.vencimiento || "MM/AA"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${backGrad} rounded-2xl text-white shadow-2xl`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="w-full h-12 bg-black/50 mt-8" />
          <div className="px-6 mt-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-9 bg-white/15 rounded-lg" />
              <div className="w-16 h-9 bg-white/25 rounded-lg flex items-center justify-center text-base font-mono tracking-widest">
                {form.cvv || "***"}
              </div>
            </div>
            <p className="text-[10px] opacity-30 mt-8 text-center">
              Este es un demo — no se procesarán pagos reales
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


// Floating label input
function FloatingInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  maxLength,
  shaking,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  maxLength?: number;
  shaking: boolean;
}) {
  return (
    <div className="relative">
      <motion.input
        animate={shaking ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder=" "
        className={`peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-mannatech/40 focus:border-mannatech transition-all text-sm ${
          shaking ? "border-red-400 ring-2 ring-red-200" : "border-border"
        }`}
      />
      <label className="absolute left-4 top-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
        {label}
      </label>
    </div>
  );
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [shakeFields, setShakeFields] = useState<string[]>([]);
  const [showCardBack, setShowCardBack] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    numeroTarjeta: "",
    vencimiento: "",
    cvv: "",
  });

  useEffect(() => setMounted(true), []);

  const { items, getSubtotal, getIVA, getTotal, clearCart } = useCartStore();

  // Snapshot items before clearCart wipes them on step 3→4
  const [confirmedItems, setConfirmedItems] = useState<typeof items>([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  // Prevent hydration mismatch — cart values come from localStorage
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="w-10 h-10 border-2 border-mannatech border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setShakeFields((prev) => prev.filter((f) => f !== name));
    // Flip card when focusing CVV
    if (name === "cvv") setShowCardBack(true);
    else setShowCardBack(false);
  }

  function getRequiredFields(): string[] {
    if (currentStep === 1) return ["nombre", "email"];
    if (currentStep === 2) return ["direccion", "ciudad", "estado", "codigoPostal"];
    if (currentStep === 3) return ["numeroTarjeta", "vencimiento", "cvv"];
    return [];
  }

  function nextStep() {
    const required = getRequiredFields();
    const empty = required.filter((f) => !form[f as keyof FormData].trim());
    if (empty.length > 0) {
      setShakeFields(empty);
      return;
    }
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 4));
    if (currentStep === 3) {
      setConfirmedItems([...items]);
      setConfirmedTotal(getTotal());
      clearCart();
    }
  }

  function prevStep() {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -60 : 60,
    }),
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">Checkout</h1>

        {/* Desktop horizontal stepper / Mobile vertical */}
        <div className="flex items-center justify-center mb-12 gap-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : isCurrent
                        ? "bg-mannatech text-white shadow-lg shadow-mannatech/40"
                        : "bg-white dark:bg-zinc-800 border-2 border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle size={20} />
                      </motion.div>
                    ) : (
                      <Icon size={18} />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCurrent ? "text-mannatech" : isCompleted ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="relative w-14 sm:w-24 h-1 mb-5 mx-2">
                    <div className="absolute inset-0 bg-border rounded-full" />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" as const }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm p-6 sm:p-8" ref={formRef}>
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-mannatech/10 flex items-center justify-center">
                        <User size={16} className="text-mannatech" />
                      </div>
                      Datos Personales
                    </h2>
                    <FloatingInput label="Nombre completo" name="nombre" value={form.nombre} onChange={handleChange} shaking={shakeFields.includes("nombre")} />
                    <FloatingInput label="Correo electronico" name="email" value={form.email} onChange={handleChange} type="email" shaking={shakeFields.includes("email")} />
                    <FloatingInput label="Telefono" name="telefono" value={form.telefono} onChange={handleChange} type="tel" shaking={shakeFields.includes("telefono")} />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-mannatech/10 flex items-center justify-center">
                        <MapPin size={16} className="text-mannatech" />
                      </div>
                      Direccion de Envio
                    </h2>
                    <SpeedingTruck speed="fast" />
                    <FloatingInput label="Direccion" name="direccion" value={form.direccion} onChange={handleChange} shaking={shakeFields.includes("direccion")} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingInput label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} shaking={shakeFields.includes("ciudad")} />
                      <FloatingInput label="Estado" name="estado" value={form.estado} onChange={handleChange} shaking={shakeFields.includes("estado")} />
                    </div>
                    <FloatingInput label="Codigo Postal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} shaking={shakeFields.includes("codigoPostal")} />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-mannatech/10 flex items-center justify-center">
                        <CreditCard size={16} className="text-mannatech" />
                      </div>
                      Informacion de Pago
                    </h2>

                    <AnimatedCreditCard form={form} showBack={showCardBack} />

                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                      Este es un demo — no se procesaran pagos reales
                    </div>
                    <CardNumberInput
                      value={form.numeroTarjeta}
                      onChange={(formatted) => {
                        setForm((prev) => ({ ...prev, numeroTarjeta: formatted }));
                        setShakeFields((prev) => prev.filter((f) => f !== "numeroTarjeta"));
                        setShowCardBack(false);
                      }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Fecha de vencimiento" name="vencimiento" value={form.vencimiento} onChange={handleChange} maxLength={5} shaking={shakeFields.includes("vencimiento")} />
                      <FloatingInput label="CVV" name="cvv" value={form.cvv} onChange={handleChange} maxLength={4} shaking={shakeFields.includes("cvv")} />
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <OrderConfirmation
                      customerName={form.nombre || "Cliente"}
                      orderId={`MNT-${Date.now().toString(36).toUpperCase()}`}
                      email={form.email || "cliente@ejemplo.com"}
                      items={confirmedItems.map((it) => ({
                        name: it.nombre,
                        qty: it.cantidad,
                        price: it.precio * it.cantidad,
                      }))}
                      shippingAddress={`${form.direccion}, ${form.ciudad}, ${form.estado}`}
                      deliveryEstimate="3 – 5 días hábiles"
                      freeShipping={confirmedTotal >= 1500}
                      shippingCost={99}
                      onTrack={() => {}}
                      onHome={() => window.location.href = "/"}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {currentStep > 1 ? (
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                    >
                      Anterior
                    </button>
                  ) : (
                    <div />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="flex items-center gap-2 px-7 py-3 bg-mannatech text-white text-sm font-semibold rounded-xl hover:bg-mannatech-dark transition-colors shadow-lg shadow-mannatech/20"
                  >
                    {currentStep === 3 ? "Confirmar Pedido" : "Siguiente"}
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          {currentStep < 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-base mb-4">Tu pedido</h3>

                {items.length > 0 ? (
                  <div className="space-y-3 mb-5">
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex gap-3 items-center"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                          <Image
                            src={item.imagen}
                            alt={item.nombre}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.nombre}</p>
                          <p className="text-xs text-muted-foreground">x{item.cantidad}</p>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatPrecio(item.precio * item.cantidad)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-5">No hay productos en el carrito</p>
                )}

                <div className="space-y-2 text-sm pt-4 border-t border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrecio(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>IVA 16%</span>
                    <span>{formatPrecio(getIVA())}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-mannatech">{formatPrecio(getTotal())}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
