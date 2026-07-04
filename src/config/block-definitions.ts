export interface FieldDef {
  key: string
  type: "text" | "textarea" | "number" | "slider" | "color" | "select" | "toggle" | "media" | "icon" | "animation" | "array"
  label: string
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
  defaultValue?: any
  arrayFields?: FieldDef[]
}

export interface BlockDefinition {
  type: string
  label: string
  icon: string
  content: FieldDef[]
  design: FieldDef[]
  advanced: FieldDef[]
}

const commonDesign: FieldDef[] = [
  { key: "bgColor", type: "color", label: "Color de Fondo" },
  { key: "paddingTop", type: "slider", label: "Padding Superior", min: 0, max: 200, defaultValue: 48 },
  { key: "paddingBottom", type: "slider", label: "Padding Inferior", min: 0, max: 200, defaultValue: 48 },
  { key: "animation", type: "animation", label: "Animacion" },
]

const commonAdvanced: FieldDef[] = [
  { key: "cssId", type: "text", label: "ID CSS" },
  { key: "cssClasses", type: "text", label: "Clases Extra" },
  { key: "anchor", type: "text", label: "Anchor Link" },
]

export const blockDefinitions: BlockDefinition[] = [
  {
    type: "hero",
    label: "Hero / Banner",
    icon: "Sparkles",
    content: [
      {
        key: "slides", type: "array", label: "Slides del Banner",
        arrayFields: [
          { key: "src", type: "media", label: "Imagen del Slide" },
          { key: "alt", type: "text", label: "Texto Alternativo" },
          { key: "href", type: "text", label: "Link al hacer clic" },
        ],
      },
      { key: "heading", type: "text", label: "Titulo (modo texto)" },
      { key: "subheading", type: "textarea", label: "Subtitulo" },
      { key: "badge", type: "text", label: "Badge" },
      { key: "cta.label", type: "text", label: "Texto del Boton" },
      { key: "cta.url", type: "text", label: "URL del Boton" },
      { key: "interval", type: "number", label: "Intervalo (ms)", min: 1000, max: 15000 },
      { key: "slideTransition", type: "select", label: "Transicion de Slides", options: ["fade", "zoom", "slideHorizontal", "slideUp", "flipVertical", "zoomRotate", "blur", "elastic", "curtain", "crossZoom", "swingIn", "bounceSlide", "diagonal", "kenBurns"] },
      { key: "style", type: "select", label: "Estilo", options: ["slider", "centered", "left", "video"] },
    ],
    design: [
      { key: "bgType", type: "select", label: "Tipo de Fondo", options: ["color", "gradient", "image"] },
      ...commonDesign,
      { key: "overlayOpacity", type: "slider", label: "Overlay", min: 0, max: 100, defaultValue: 0 },
      { key: "titleSize", type: "slider", label: "Tamano Titulo", min: 24, max: 80, defaultValue: 48 },
      { key: "textColor", type: "color", label: "Color Texto" },
    ],
    advanced: commonAdvanced,
  },
  {
    type: "stats",
    label: "Estadisticas",
    icon: "BarChart3",
    content: [
      { key: "title", type: "text", label: "Titulo" },
      {
        key: "stats", type: "array", label: "Estadisticas",
        arrayFields: [
          { key: "value", type: "text", label: "Valor" },
          { key: "suffix", type: "text", label: "Sufijo" },
          { key: "label", type: "text", label: "Etiqueta" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "ctaBanner",
    label: "Call to Action",
    icon: "MousePointerClick",
    content: [
      { key: "backgroundImage", type: "media", label: "Imagen de Fondo" },
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "text", label: "Subtitulo" },
      { key: "text", type: "textarea", label: "Texto" },
      { key: "buttonLabel", type: "text", label: "Texto del Boton" },
      { key: "buttonUrl", type: "text", label: "URL del Boton" },
    ],
    design: [
      { key: "bgType", type: "select", label: "Tipo de Fondo", options: ["color", "gradient"] },
      ...commonDesign,
    ],
    advanced: commonAdvanced,
  },
  {
    type: "featuredGrid",
    label: "Productos Destacados",
    icon: "Package",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "title", type: "text", label: "Titulo" },
      { key: "maxProducts", type: "slider", label: "Cantidad de Productos", min: 2, max: 20, defaultValue: 10 },
      { key: "ctaText", type: "text", label: "Texto del Boton" },
      { key: "ctaHref", type: "text", label: "URL del Boton" },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "testimonials",
    label: "Testimonios",
    icon: "MessageSquareQuote",
    content: [
      {
        key: "testimonials", type: "array", label: "Testimonios",
        arrayFields: [
          { key: "name", type: "text", label: "Nombre" },
          { key: "role", type: "text", label: "Rol" },
          { key: "quote", type: "textarea", label: "Testimonio" },
          { key: "rating", type: "number", label: "Rating", min: 1, max: 5 },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "faq",
    label: "Preguntas Frecuentes",
    icon: "HelpCircle",
    content: [
      {
        key: "items", type: "array", label: "Preguntas",
        arrayFields: [
          { key: "question", type: "text", label: "Pregunta" },
          { key: "answer", type: "textarea", label: "Respuesta" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "howItWorks",
    label: "Como Funciona",
    icon: "ListChecks",
    content: [
      {
        key: "steps", type: "array", label: "Pasos",
        arrayFields: [
          { key: "number", type: "number", label: "Numero" },
          { key: "title", type: "text", label: "Titulo" },
          { key: "description", type: "textarea", label: "Descripcion" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "joinSection",
    label: "Seccion Unete",
    icon: "UserPlus",
    content: [
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subtitle", type: "textarea", label: "Subtitulo" },
      { key: "cta", type: "text", label: "Texto CTA" },
      {
        key: "benefits", type: "array", label: "Beneficios",
        arrayFields: [
          { key: "text", type: "text", label: "Beneficio" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "teamGrid",
    label: "Equipo",
    icon: "Users",
    content: [
      { key: "title", type: "text", label: "Titulo" },
      { key: "subtitle", type: "text", label: "Subtitulo" },
      {
        key: "members", type: "array", label: "Miembros",
        arrayFields: [
          { key: "name", type: "text", label: "Nombre" },
          { key: "role", type: "text", label: "Cargo" },
          { key: "initials", type: "text", label: "Iniciales" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "benefitsGrid",
    label: "Grid de Beneficios",
    icon: "Grid3x3",
    content: [
      { key: "title", type: "text", label: "Titulo" },
      { key: "subtitle", type: "text", label: "Subtitulo" },
      {
        key: "benefits", type: "array", label: "Beneficios",
        arrayFields: [
          { key: "icon", type: "text", label: "Icono" },
          { key: "title", type: "text", label: "Titulo" },
          { key: "description", type: "textarea", label: "Descripcion" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "quickCategoryMenu",
    label: "Menu Categorias",
    icon: "LayoutGrid",
    content: [
      {
        key: "categories", type: "array", label: "Categorias",
        arrayFields: [
          { key: "name", type: "text", label: "Nombre" },
          { key: "href", type: "text", label: "URL" },
          { key: "icon", type: "icon", label: "Icono" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "missionSection",
    label: "Mision / Stats",
    icon: "BarChart3",
    content: [
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "text", label: "Subtitulo" },
      {
        key: "stats", type: "array", label: "Estadisticas",
        arrayFields: [
          { key: "value", type: "number", label: "Valor" },
          { key: "suffix", type: "text", label: "Sufijo" },
          { key: "label", type: "text", label: "Etiqueta" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "scienceSection",
    label: "Ciencia",
    icon: "FlaskConical",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "text", label: "Subtitulo" },
      { key: "description", type: "textarea", label: "Descripcion" },
      {
        key: "benefits", type: "array", label: "Beneficios",
        arrayFields: [
          { key: "icon", type: "icon", label: "Icono" },
          { key: "label", type: "text", label: "Titulo" },
          { key: "desc", type: "text", label: "Descripcion" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "glycansSection",
    label: "Glicanos",
    icon: "Dna",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      {
        key: "paragraphs", type: "array", label: "Parrafos",
        arrayFields: [
          { key: "text", type: "textarea", label: "Texto" },
        ],
      },
      {
        key: "benefits", type: "array", label: "Beneficios",
        arrayFields: [
          { key: "icon", type: "icon", label: "Icono" },
          { key: "title", type: "text", label: "Titulo" },
          { key: "desc", type: "text", label: "Descripcion" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "whyGlycansSection",
    label: "Por Que Glicanos",
    icon: "HelpCircle",
    content: [
      { key: "heading", type: "text", label: "Titulo" },
      {
        key: "paragraphs", type: "array", label: "Parrafos",
        arrayFields: [
          { key: "text", type: "textarea", label: "Texto" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "trustMarquee",
    label: "Beneficios / Trust",
    icon: "ShieldCheck",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      {
        key: "benefits", type: "array", label: "Beneficios",
        arrayFields: [
          { key: "icon", type: "icon", label: "Icono" },
          { key: "text", type: "text", label: "Texto" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "categories",
    label: "Categorias de Compra",
    icon: "LayoutGrid",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      {
        key: "categories", type: "array", label: "Categorias",
        arrayFields: [
          { key: "name", type: "text", label: "Nombre" },
          { key: "desc", type: "text", label: "Descripcion" },
          { key: "href", type: "text", label: "URL" },
          { key: "icon", type: "icon", label: "Icono" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  ...["newsletter", "socialProof"].map((type) => ({
    type,
    label: type.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim(),
    icon: "Component",
    content: [] as FieldDef[],
    design: commonDesign,
    advanced: commonAdvanced,
  })),
  // New premium blocks
  {
    type: "videoHero",
    label: "Video Hero",
    icon: "Play",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "textarea", label: "Subtitulo" },
      { key: "videoUrl", type: "text", label: "URL del Video (YouTube embed)" },
      { key: "videoPoster", type: "media", label: "Imagen de Fondo" },
      { key: "cta.text", type: "text", label: "Texto Boton" },
      { key: "cta.href", type: "text", label: "URL Boton" },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "timeline",
    label: "Linea de Tiempo",
    icon: "Clock",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      {
        key: "events", type: "array", label: "Eventos",
        arrayFields: [
          { key: "year", type: "text", label: "Ano" },
          { key: "title", type: "text", label: "Titulo" },
          { key: "desc", type: "textarea", label: "Descripcion" },
          { key: "icon", type: "icon", label: "Icono" },
        ],
      },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "pricingTable",
    label: "Tabla de Precios",
    icon: "CreditCard",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "text", label: "Subtitulo" },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "parallaxBanner",
    label: "Banner Parallax",
    icon: "Image",
    content: [
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "textarea", label: "Subtitulo" },
      { key: "image", type: "media", label: "Imagen de Fondo" },
      { key: "cta.text", type: "text", label: "Texto Boton" },
      { key: "cta.href", type: "text", label: "URL Boton" },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "logoGrid",
    label: "Logos y Certificaciones",
    icon: "Award",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "text", label: "Subtitulo" },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
  {
    type: "animatedFeatures",
    label: "Features Animadas",
    icon: "Sparkles",
    content: [
      { key: "overline", type: "text", label: "Overline" },
      { key: "heading", type: "text", label: "Titulo" },
      { key: "subheading", type: "textarea", label: "Subtitulo" },
    ],
    design: commonDesign,
    advanced: commonAdvanced,
  },
]

export const blockDefMap = Object.fromEntries(blockDefinitions.map((b) => [b.type, b]))
