export function MannatechLogo({
  className = "h-10",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white";
}) {
  // "default" uses currentColor so it inherits from parent text color (works with dark mode)
  // "white" forces white (for transparent header over hero)
  const textFill = variant === "white" ? "#FFFFFF" : "currentColor";
  const tmFill = variant === "white" ? "rgba(255,255,255,0.6)" : "currentColor";
  const tmOpacity = variant === "white" ? 1 : 0.5;

  return (
    <svg
      viewBox="0 0 280 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mannatech"
    >
      {/* Stylized M - two leaves */}
      <path
        d="M8 52 L24 8 L32 28 L40 8 L56 52"
        stroke="#00A88F"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 52 L32 12 L48 52"
        stroke="#69CA98"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Wordmark */}
      <text
        x="72"
        y="44"
        fontFamily="'Open Sans', 'Trebuchet MS', sans-serif"
        fontWeight="700"
        fontSize="28"
        letterSpacing="4"
        fill={textFill}
      >
        MANNATECH
      </text>
      {/* Registered trademark */}
      <text
        x="268"
        y="24"
        fontFamily="'Open Sans', sans-serif"
        fontSize="9"
        fill={tmFill}
        opacity={tmOpacity}
      >
        ®
      </text>
    </svg>
  );
}
