export type CompanyId = "mx" | "us";
export type CurrencyCode = "MXN" | "USD";
export type LocaleCode = "es-MX" | "en-US";

export interface Categoria {
  id: string;
  nombre: string;
  color: string;
  colorSecundario: string;
  descripcion: string;
  icono: string;
  imagen?: string;
}

export interface Producto {
  slug: string;
  sku: string;
  nombre: string;
  categoria: string;
  precio: number;
  presentacion: string;
  descripcionCorta: string;
  descripcionLarga: string;
  beneficios: string[];
  ingredientes: string;
  imagen: string;
  destacado: boolean;
  badge: string | null;
}

export interface Textos {
  marca: {
    nombre: string;
    tagline: string;
    fundacion: number;
    patentes: number;
    anosInnovacion: number;
  };
  sobreNosotros: {
    titulo: string;
    texto: string;
    propuestaValor: string;
  };
  hero: {
    titulo: string;
    subtitulo: string;
    ctaPrimario: string;
    ctaSecundario: string;
  };
  checkoutModal: {
    titulo: string;
    texto: string;
    cta: string;
    nota: string;
  };
  footer: {
    disclaimer: string;
    selloDmlabs: string;
    links: string[];
  };
  unete: {
    titulo: string;
    subtitulo: string;
    beneficios: string[];
    cta: string;
  };
}

export interface ProductoCompartido {
  slug: string;
  cantidad: number;
}

export interface DistribuidorStats {
  ventasMes: number;
  clicsEnlace: number;
  clientesActivos: number;
  metaMensual: number;
  tendencia: number;
  productosCompartidos: ProductoCompartido[];
  ventasHistorial: number[];
}

export interface Distribuidor {
  slug: string;
  nombre: string;
  ubicacion: string;
  whatsapp: string;
  bio: string;
  productosFavoritos: string[];
  nivel: string;
  foto: string;
  stats: DistribuidorStats;
}
