"use client";

import { Truck } from "lucide-react";

/**
 * SpeedingTruck
 * Icono de camión "corriendo" con líneas de velocidad.
 *
 * Nota: las duraciones se pasan como CSS variables (--shake / --zoom)
 * en lugar de interpolarse dentro del bloque styled-jsx. Si se interpolan
 * directamente (animation: zoom ${...}), styled-jsx renombra los @keyframes
 * de forma inconsistente y la animación no corre.
 */
type Speed = "normal" | "fast" | "turbo";

const TIMINGS: Record<Speed, { shake: string; zoom: string }> = {
  normal: { shake: "0.24s", zoom: "0.7s" },
  fast: { shake: "0.18s", zoom: "0.55s" },
  turbo: { shake: "0.12s", zoom: "0.4s" },
};

export default function SpeedingTruck({
  speed = "fast",
  size = 40,
}: {
  speed?: Speed;
  size?: number;
}) {
  const t = TIMINGS[speed];

  return (
    <div
      className="truck-wrap"
      aria-hidden="true"
      style={
        { "--shake": t.shake, "--zoom": t.zoom } as React.CSSProperties
      }
    >
      <div className="speed-lines">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="truck-run">
        <Truck size={size} className="text-mannatech" strokeWidth={2} />
      </div>

      <style jsx>{`
        .truck-wrap {
          position: relative;
          height: 70px;
          width: 100%;
          overflow: hidden;
        }
        .truck-run {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: truck-shake var(--shake) linear infinite;
        }
        .speed-lines {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 9px;
          padding-right: 54%;
        }
        .speed-lines span {
          display: block;
          height: 2px;
          border-radius: 2px;
          margin-left: auto;
          background: linear-gradient(
            90deg,
            rgba(0, 168, 143, 0) 0%,
            rgba(0, 168, 143, 0.85) 100%
          );
          animation: zoom var(--zoom) linear infinite;
        }
        .speed-lines span:nth-child(1) {
          width: 30%;
          animation-delay: 0s;
        }
        .speed-lines span:nth-child(2) {
          width: 55%;
          animation-delay: 0.1s;
        }
        .speed-lines span:nth-child(3) {
          width: 42%;
          animation-delay: 0.22s;
        }
        .speed-lines span:nth-child(4) {
          width: 58%;
          animation-delay: 0.05s;
        }
        .speed-lines span:nth-child(5) {
          width: 34%;
          animation-delay: 0.16s;
        }
        @keyframes truck-shake {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-1.5px);
          }
        }
        @keyframes zoom {
          0% {
            transform: translateX(40px);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateX(-90px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .truck-run,
          .speed-lines span {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
