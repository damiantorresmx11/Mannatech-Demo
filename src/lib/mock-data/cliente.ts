// Mock data — Dashboard Cliente
// Mannatech Demo Premium | DMLABS

export const mockCliente = {
  perfil: {
    id: "CLI-2847",
    nombre: "Maria Garcia Lopez",
    email: "maria.garcia@email.com",
    telefono: "+52 33 1234 5678",
    fechaRegistro: "2024-03-15",
    avatar: null,
    direcciones: [
      {
        id: 1,
        alias: "Casa",
        calle: "Av. Vallarta 1234",
        colonia: "Col. Americana",
        ciudad: "Guadalajara",
        estado: "Jalisco",
        cp: "44160",
        predeterminada: true,
      },
      {
        id: 2,
        alias: "Oficina",
        calle: "Av. Americas 567",
        colonia: "Col. Providencia",
        ciudad: "Guadalajara",
        estado: "Jalisco",
        cp: "44630",
        predeterminada: false,
      },
    ],
  },

  pedidos: [
    {
      id: "ORD-2847",
      fecha: "2026-06-28",
      estatus: "en camino",
      items: [
        { nombre: "Ambrotose", cantidad: 2, precio: 1850, imagen: "/products/ambrotose.png" },
        { nombre: "MannaBears", cantidad: 1, precio: 780, imagen: "/products/mannabears.png" },
      ],
      subtotal: 4480,
      envio: 149,
      total: 4629,
    },
    {
      id: "ORD-2790",
      fecha: "2026-06-15",
      estatus: "entregado",
      items: [
        { nombre: "Optimal Support Packets", cantidad: 1, precio: 2350, imagen: "/products/optimal-support.png" },
        { nombre: "PhytoMatrix", cantidad: 1, precio: 920, imagen: "/products/phytomatrix.png" },
      ],
      subtotal: 3270,
      envio: 149,
      total: 3419,
    },
    {
      id: "ORD-2685",
      fecha: "2026-05-22",
      estatus: "entregado",
      items: [
        { nombre: "GI-Pro", cantidad: 1, precio: 1680, imagen: "/products/gi-pro.png" },
        { nombre: "Plus", cantidad: 2, precio: 1450, imagen: "/products/plus.png" },
      ],
      subtotal: 4580,
      envio: 0,
      total: 4580,
    },
    {
      id: "ORD-2601",
      fecha: "2026-05-03",
      estatus: "entregado",
      items: [
        { nombre: "Ambrotose", cantidad: 1, precio: 1850, imagen: "/products/ambrotose.png" },
      ],
      subtotal: 1850,
      envio: 149,
      total: 1999,
    },
    {
      id: "ORD-2534",
      fecha: "2026-04-18",
      estatus: "cancelado",
      items: [
        { nombre: "MannaBears", cantidad: 3, precio: 780, imagen: "/products/mannabears.png" },
        { nombre: "Ambrotose", cantidad: 1, precio: 1850, imagen: "/products/ambrotose.png" },
      ],
      subtotal: 4190,
      envio: 149,
      total: 4339,
    },
    {
      id: "ORD-2410",
      fecha: "2026-03-27",
      estatus: "procesando",
      items: [
        { nombre: "Optimal Support Packets", cantidad: 2, precio: 2350, imagen: "/products/optimal-support.png" },
        { nombre: "GI-Pro", cantidad: 1, precio: 1680, imagen: "/products/gi-pro.png" },
        { nombre: "PhytoMatrix", cantidad: 1, precio: 920, imagen: "/products/phytomatrix.png" },
      ],
      subtotal: 7300,
      envio: 0,
      total: 7300,
    },
  ],

  favoritos: [
    { slug: "ambrotose", nombre: "Ambrotose", precio: 1850, imagen: "/products/ambrotose.png", categoria: "Gliconutrientes" },
    { slug: "mannabears", nombre: "MannaBears", precio: 780, imagen: "/products/mannabears.png", categoria: "Infantil" },
    { slug: "gi-pro", nombre: "GI-Pro", precio: 1680, imagen: "/products/gi-pro.png", categoria: "Digestivo" },
    { slug: "optimal-support", nombre: "Optimal Support Packets", precio: 2350, imagen: "/products/optimal-support.png", categoria: "Paquetes" },
    { slug: "plus", nombre: "Plus", precio: 1450, imagen: "/products/plus.png", categoria: "Nutricion" },
    { slug: "phytomatrix", nombre: "PhytoMatrix", precio: 920, imagen: "/products/phytomatrix.png", categoria: "Vitaminas" },
  ],

  autoenvio: {
    activo: true,
    proximoEnvio: "2026-07-15",
    frecuencia: "Mensual",
    metodoPago: "Visa ****4589",
    direccion: "Av. Vallarta 1234, Col. Americana",
    productos: [
      { nombre: "Ambrotose", cantidad: 2, precio: 1850, imagen: "/products/ambrotose.png" },
      { nombre: "MannaBears", cantidad: 1, precio: 780, imagen: "/products/mannabears.png" },
      { nombre: "PhytoMatrix", cantidad: 1, precio: 920, imagen: "/products/phytomatrix.png" },
    ],
    historial: [
      { fecha: "2026-06-15", total: 5400, estatus: "entregado" },
      { fecha: "2026-05-15", total: 5400, estatus: "entregado" },
      { fecha: "2026-04-15", total: 4480, estatus: "entregado" },
    ],
  },

  puntos: {
    pvAcumulados: 2450,
    pvEsteMes: 380,
    nivelLealtad: "Plata",
    siguienteNivel: "Oro",
    pvParaSiguienteNivel: 550,
    historial: [
      { mes: "Enero 2026", pv: 320, nivel: "Bronce" },
      { mes: "Febrero 2026", pv: 410, nivel: "Bronce" },
      { mes: "Marzo 2026", pv: 480, nivel: "Plata" },
      { mes: "Abril 2026", pv: 350, nivel: "Plata" },
      { mes: "Mayo 2026", pv: 510, nivel: "Plata" },
      { mes: "Junio 2026", pv: 380, nivel: "Plata" },
    ],
    recompensasDisponibles: [
      { id: 1, nombre: "Envio gratis en tu proximo pedido", pvCosto: 200, tipo: "envio" as const },
      { id: 2, nombre: "10% descuento en Ambrotose", pvCosto: 500, tipo: "descuento" as const },
      { id: 3, nombre: "Muestra gratis GI-Pro", pvCosto: 150, tipo: "producto" as const },
    ],
  },

  asociado: {
    nombre: "Carlos Rodriguez",
    telefono: "+52 33 9876 5432",
    email: "carlos.rodriguez@mannatech.com",
    foto: null,
    nivel: "Director Nacional",
    whatsapp: "5213398765432",
  },

  notificaciones: [
    { id: 1, titulo: "Pedido enviado", descripcion: "Tu pedido #ORD-2847 esta en camino", tiempo: "Hace 2 horas", leida: false },
    { id: 2, titulo: "Puntos ganados", descripcion: "Has ganado 180 PV por tu ultima compra", tiempo: "Hace 1 dia", leida: false },
    { id: 3, titulo: "Autoenvio proximo", descripcion: "Tu autoenvio se procesara el 15 de julio", tiempo: "Hace 3 dias", leida: true },
    { id: 4, titulo: "Nuevo nivel alcanzado", descripcion: "Felicidades! Has alcanzado el nivel Plata", tiempo: "Hace 1 semana", leida: true },
  ],
} as const
