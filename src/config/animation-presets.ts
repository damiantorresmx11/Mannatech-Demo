export interface AnimationPreset {
  id: string
  name: string
  description: string
  category: "entrada" | "scroll" | "hover" | "especial"
  // Motion props
  initial: Record<string, any>
  animate: Record<string, any>
  transition: Record<string, any>
  // For whileInView
  whileInView?: Record<string, any>
  viewport?: Record<string, any>
  // For hover/tap
  whileHover?: Record<string, any>
  whileTap?: Record<string, any>
}

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ══════════ ENTRADA ══════════
  {
    id: "fadeUp",
    name: "Fade Up",
    description: "Aparece suavemente desde abajo",
    category: "entrada",
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
  },
  {
    id: "fadeDown",
    name: "Fade Down",
    description: "Aparece suavemente desde arriba",
    category: "entrada",
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
  },
  {
    id: "slideLeft",
    name: "Slide Left",
    description: "Entra deslizando desde la derecha",
    category: "entrada",
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-60px" },
  },
  {
    id: "slideRight",
    name: "Slide Right",
    description: "Entra deslizando desde la izquierda",
    category: "entrada",
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-60px" },
  },
  {
    id: "scaleIn",
    name: "Scale In",
    description: "Crece desde el centro con rebote",
    category: "entrada",
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
  },
  {
    id: "flipIn",
    name: "Flip In",
    description: "Gira entrando en 3D",
    category: "entrada",
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
    whileInView: { opacity: 1, rotateX: 0 },
    viewport: { once: true },
  },

  // ══════════ SCROLL ══════════
  {
    id: "staggerChildren",
    name: "Stagger Children",
    description: "Los hijos aparecen uno tras otro",
    category: "scroll",
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-40px" },
  },
  {
    id: "parallaxSlow",
    name: "Parallax Lento",
    description: "Se mueve mas lento que el scroll",
    category: "scroll",
    initial: { y: 0 },
    animate: { y: 0 },
    transition: { duration: 0 },
    // Uses CSS transform via style, not motion animate
    whileInView: { y: 0 },
    viewport: { once: false },
  },

  // ══════════ HOVER ══════════
  {
    id: "hoverLift",
    name: "Hover Lift",
    description: "Se eleva al pasar el mouse",
    category: "hover",
    initial: {},
    animate: {},
    transition: { duration: 0.3 },
    whileHover: { y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
    whileTap: { scale: 0.98 },
  },
  {
    id: "hoverGlow",
    name: "Hover Glow",
    description: "Brilla al pasar el mouse",
    category: "hover",
    initial: {},
    animate: {},
    transition: { duration: 0.3 },
    whileHover: { scale: 1.05, boxShadow: "0 0 30px rgba(0,168,143,0.3)" },
    whileTap: { scale: 0.95 },
  },

  // ══════════ ESPECIAL ══════════
  {
    id: "bounceIn",
    name: "Bounce In",
    description: "Entra con efecto de rebote elastico",
    category: "especial",
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", stiffness: 300, damping: 15 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
  },
  {
    id: "rotateIn",
    name: "Rotate In",
    description: "Gira mientras aparece",
    category: "especial",
    initial: { opacity: 0, rotate: -15, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { type: "spring", bounce: 0.3, duration: 0.8 },
    whileInView: { opacity: 1, rotate: 0, scale: 1 },
    viewport: { once: true },
  },
  {
    id: "blurIn",
    name: "Blur In",
    description: "Aparece desde un desenfoque",
    category: "especial",
    initial: { opacity: 0, filter: "blur(12px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.8 },
    whileInView: { opacity: 1, filter: "blur(0px)" },
    viewport: { once: true },
  },
  {
    id: "typewriter",
    name: "Typewriter",
    description: "Efecto de escritura caracter por caracter",
    category: "especial",
    initial: { width: 0 },
    animate: { width: "100%" },
    transition: { duration: 2, ease: "linear" },
    whileInView: { width: "100%" },
    viewport: { once: true },
  },
]

export const ANIMATION_CATEGORIES = ["entrada", "scroll", "hover", "especial"] as const

export const PRESET_MAP = Object.fromEntries(ANIMATION_PRESETS.map(p => [p.id, p]))
