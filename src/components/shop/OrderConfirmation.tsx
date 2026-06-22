"use client";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type OrderConfirmationProps = {
  customerName: string;
  orderId: string;
  email: string;
  items: OrderItem[];
  shippingAddress: string;
  deliveryEstimate: string;
  freeShipping?: boolean;
  shippingCost?: number;
  onTrack?: () => void;
  onHome?: () => void;
};

const IVA_RATE = 0.16;
const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function OrderConfirmation({
  customerName,
  orderId,
  email,
  items,
  shippingAddress,
  deliveryEstimate,
  freeShipping = true,
  shippingCost = 0,
  onTrack,
  onHome,
}: OrderConfirmationProps) {
  const subtotal = items.reduce((acc, it) => acc + it.price, 0);
  const iva = subtotal * IVA_RATE;
  const shipping = freeShipping ? 0 : shippingCost;
  const total = subtotal + iva + shipping;

  return (
    <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-white/5 bg-slate-800/40 p-7">
      <div className="confetti" aria-hidden="true">
        {[
          { x: "8%", d: "0s", c: "#10b981" },
          { x: "22%", d: "0.3s", c: "#34d399" },
          { x: "38%", d: "0.15s", c: "#fbbf24" },
          { x: "55%", d: "0.45s", c: "#10b981" },
          { x: "70%", d: "0.1s", c: "#60a5fa" },
          { x: "84%", d: "0.35s", c: "#34d399" },
          { x: "92%", d: "0.2s", c: "#fbbf24" },
        ].map((p, i) => (
          <i
            key={i}
            style={
              {
                "--x": p.x,
                "--d": p.d,
                "--c": p.c,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Check animado */}
      <div className="mb-5 flex justify-center">
        <svg width="84" height="84" viewBox="0 0 84 84" className="check-svg">
          <circle
            cx="42"
            cy="42"
            r="38"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="239"
            strokeDashoffset="239"
            className="check-circle"
          />
          <path
            d="M26 43 L37 54 L58 31"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            strokeDashoffset="60"
            className="check-mark"
          />
        </svg>
      </div>

      <h3 className="mb-1.5 text-center text-2xl font-medium text-slate-100">
        ¡Pedido confirmado!
      </h3>
      <p className="mb-4 text-center text-sm leading-relaxed text-slate-400">
        Gracias, {customerName}. Te enviamos el comprobante a {email}.
      </p>

      {/* Número de pedido */}
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-[13px] text-emerald-400">
          Pedido <span className="font-medium tracking-wide">{orderId}</span>
        </span>
      </div>

      {/* Resumen */}
      <div className="mb-3.5 rounded-xl border border-white/5 bg-slate-900/50 p-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-white/5 pb-2.5 text-sm last:border-0"
          >
            <div>
              <div className="text-slate-200">{it.name}</div>
              <div className="text-xs text-slate-500">Cantidad: {it.qty}</div>
            </div>
            <div className="text-slate-200">{mxn(it.price)}</div>
          </div>
        ))}

        <div className="pt-3 text-[13px]">
          <Row label="Subtotal" value={mxn(subtotal)} />
          <Row label="IVA (16%)" value={mxn(iva)} />
          <Row
            label="Envío"
            value={shipping === 0 ? "Gratis" : mxn(shipping)}
            valueClass={shipping === 0 ? "text-emerald-400" : "text-slate-300"}
          />
          <div className="mt-1 flex justify-between border-t border-white/10 pt-2.5">
            <span className="font-medium text-slate-100">Total</span>
            <span className="font-medium text-slate-100">{mxn(total)}</span>
          </div>
        </div>
      </div>

      {/* Entrega + dirección */}
      <div className="mb-6 flex gap-3">
        <InfoCard label="Entrega estimada" value={deliveryEstimate} />
        <InfoCard label="Envío a" value={shippingAddress} />
      </div>

      <button
        onClick={onTrack}
        className="mb-2.5 w-full rounded-xl bg-emerald-500 py-3 text-[15px] font-medium text-emerald-950 transition hover:bg-emerald-400"
      >
        Rastrear mi pedido
      </button>
      <button
        onClick={onHome}
        className="w-full rounded-xl border border-white/10 py-3 text-sm text-slate-300 transition hover:bg-white/5"
      >
        Volver al inicio
      </button>

      <style jsx>{`
        .check-circle {
          animation: draw-circle 0.6s ease-out forwards;
        }
        .check-mark {
          animation: draw-mark 0.4s 0.5s ease-out forwards;
        }
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-mark {
          to { stroke-dashoffset: 0; }
        }
        .check-svg {
          animation: pop 0.4s 0.85s ease-out both;
        }
        @keyframes pop {
          0% { transform: scale(1); }
          45% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .confetti {
          position: absolute;
          inset: 0 0 auto 0;
          height: 0;
          pointer-events: none;
        }
        .confetti i {
          position: absolute;
          top: -12px;
          left: var(--x);
          width: 7px;
          height: 11px;
          background: var(--c);
          border-radius: 2px;
          opacity: 0;
          animation: fall 1.5s var(--d) ease-in forwards;
        }
        @keyframes fall {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(340px) rotate(420deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .check-circle, .check-mark { animation: none; stroke-dashoffset: 0; }
          .check-svg, .confetti i { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "text-slate-300",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="mb-1.5 flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-xl border border-white/5 bg-slate-900/50 px-4 py-3.5">
      <div className="mb-1.5 text-xs text-slate-500">{label}</div>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  );
}
