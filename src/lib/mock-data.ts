// ============================================================
// Mock data for Socio (Associate) MLM Dashboard
// ============================================================

export const mockSocio = {
  perfil: {
    id: "SOC-2847",
    nombre: "Carlos",
    nombreCompleto: "Carlos Mendoza Rivera",
    email: "carlos.mendoza@email.com",
    telefono: "+52 33 1234 5678",
    avatar: null,
    rango: "Asociado Plata",
    rangoIcon: "silver",
    fechaIngreso: "2024-03-15",
    patrocinador: "Ana Lucia Fernandez",
    linkReferido: "https://mannatech.com/ref/carlos-mendoza",
  },

  kpis: {
    ventasMes: 48750,
    pvPersonal: 320,
    pvGrupal: 1850,
    comisionesMes: 12340,
    clientesActivos: 24,
    nuevosEsteMes: 3,
    tendenciaVentas: 12.5,
    tendenciaPV: 8.2,
    tendenciaGrupal: 15.3,
    tendenciaComisiones: 9.7,
  },

  ventasHistorial: [
    { mes: "Ene", ventas: 32000, pv: 210 },
    { mes: "Feb", ventas: 38500, pv: 250 },
    { mes: "Mar", ventas: 35200, pv: 230 },
    { mes: "Abr", ventas: 42100, pv: 280 },
    { mes: "May", ventas: 45800, pv: 300 },
    { mes: "Jun", ventas: 48750, pv: 320 },
  ],

  red: {
    totalMiembros: 47,
    activos: 38,
    inactivos: 9,
    pvGrupalTotal: 1850,
    arbol: [
      {
        id: "m1",
        nombre: "Maria Garcia Lopez",
        rango: "Asociado Bronce",
        pvPersonal: 180,
        activo: true,
        nivel: 1,
        avatar: null,
        hijos: [
          {
            id: "m1-1",
            nombre: "Pedro Sanchez",
            rango: "Asociado",
            pvPersonal: 95,
            activo: true,
            nivel: 2,
            avatar: null,
            hijos: [
              {
                id: "m1-1-1",
                nombre: "Lucia Romero",
                rango: "Asociado",
                pvPersonal: 60,
                activo: true,
                nivel: 3,
                avatar: null,
                hijos: [],
              },
            ],
          },
          {
            id: "m1-2",
            nombre: "Andrea Flores",
            rango: "Asociado",
            pvPersonal: 110,
            activo: true,
            nivel: 2,
            avatar: null,
            hijos: [],
          },
        ],
      },
      {
        id: "m2",
        nombre: "Roberto Diaz Herrera",
        rango: "Asociado Plata",
        pvPersonal: 280,
        activo: true,
        nivel: 1,
        avatar: null,
        hijos: [
          {
            id: "m2-1",
            nombre: "Sofia Martinez",
            rango: "Asociado Bronce",
            pvPersonal: 150,
            activo: true,
            nivel: 2,
            avatar: null,
            hijos: [
              {
                id: "m2-1-1",
                nombre: "Diego Ruiz",
                rango: "Asociado",
                pvPersonal: 45,
                activo: false,
                nivel: 3,
                avatar: null,
                hijos: [],
              },
              {
                id: "m2-1-2",
                nombre: "Valentina Torres",
                rango: "Asociado",
                pvPersonal: 80,
                activo: true,
                nivel: 3,
                avatar: null,
                hijos: [],
              },
            ],
          },
        ],
      },
      {
        id: "m3",
        nombre: "Laura Jimenez",
        rango: "Asociado",
        pvPersonal: 70,
        activo: false,
        nivel: 1,
        avatar: null,
        hijos: [],
      },
      {
        id: "m4",
        nombre: "Fernando Castillo",
        rango: "Asociado Bronce",
        pvPersonal: 200,
        activo: true,
        nivel: 1,
        avatar: null,
        hijos: [
          {
            id: "m4-1",
            nombre: "Carmen Navarro",
            rango: "Asociado",
            pvPersonal: 90,
            activo: true,
            nivel: 2,
            avatar: null,
            hijos: [],
          },
        ],
      },
    ],
  },

  clientes: [
    {
      id: "cl-001",
      nombre: "Ana Patricia Gonzalez",
      email: "ana.gonzalez@email.com",
      telefono: "+52 33 9876 5432",
      ultimaCompra: "2026-06-28",
      totalCompras: 15680,
      estatus: "activo" as const,
      productosFavoritos: ["Ambrotose", "Ambrotose LIFE", "PhytoMatrix"],
      compras: [
        { fecha: "2026-06-28", productos: ["Ambrotose LIFE x2"], total: 3200 },
        { fecha: "2026-06-01", productos: ["PhytoMatrix x1"], total: 1890 },
        { fecha: "2026-05-15", productos: ["Ambrotose x1", "GI-ProBalance x1"], total: 4100 },
      ],
    },
    {
      id: "cl-002",
      nombre: "Miguel Angel Torres",
      email: "miguel.torres@email.com",
      telefono: "+52 33 5555 1234",
      ultimaCompra: "2026-06-25",
      totalCompras: 22450,
      estatus: "activo" as const,
      productosFavoritos: ["Ambrotose", "MannaBears", "Optimal Support Packets"],
      compras: [
        { fecha: "2026-06-25", productos: ["MannaBears x3"], total: 2700 },
        { fecha: "2026-05-20", productos: ["Ambrotose x2"], total: 5400 },
      ],
    },
    {
      id: "cl-003",
      nombre: "Patricia Herrera Ruiz",
      email: "patricia.h@email.com",
      telefono: "+52 33 4444 5678",
      ultimaCompra: "2026-05-10",
      totalCompras: 8900,
      estatus: "activo" as const,
      productosFavoritos: ["Ambrotose LIFE", "Uth Skin Rejuvenation"],
      compras: [
        { fecha: "2026-05-10", productos: ["Uth Skin Rejuvenation x1"], total: 3200 },
      ],
    },
    {
      id: "cl-004",
      nombre: "Jose Luis Ramirez",
      email: "joseluis.r@email.com",
      telefono: "+52 33 3333 9876",
      ultimaCompra: "2026-04-02",
      totalCompras: 5200,
      estatus: "inactivo" as const,
      productosFavoritos: ["PhytoMatrix"],
      compras: [
        { fecha: "2026-04-02", productos: ["PhytoMatrix x2"], total: 3780 },
      ],
    },
    {
      id: "cl-005",
      nombre: "Gabriela Morales",
      email: "gaby.morales@email.com",
      telefono: "+52 33 2222 3456",
      ultimaCompra: "2026-06-30",
      totalCompras: 31200,
      estatus: "activo" as const,
      productosFavoritos: ["Ambrotose", "Ambrotose LIFE", "GI-ProBalance", "MannaBears"],
      compras: [
        { fecha: "2026-06-30", productos: ["Ambrotose LIFE x2", "MannaBears x2"], total: 5900 },
        { fecha: "2026-06-10", productos: ["GI-ProBalance x1"], total: 2100 },
        { fecha: "2026-05-22", productos: ["Ambrotose x3"], total: 8100 },
      ],
    },
    {
      id: "cl-006",
      nombre: "Ricardo Fuentes",
      email: "ricardo.f@email.com",
      telefono: "+52 33 1111 7890",
      ultimaCompra: "2026-03-18",
      totalCompras: 3400,
      estatus: "inactivo" as const,
      productosFavoritos: ["Ambrotose"],
      compras: [
        { fecha: "2026-03-18", productos: ["Ambrotose x1"], total: 2700 },
      ],
    },
  ],

  comisiones: {
    totalMes: 12340,
    bonoRetail: 4500,
    bonoGrupal: 5200,
    bonoLiderazgo: 2640,
    historial: [
      { mes: "Ene", retail: 2800, grupal: 3200, liderazgo: 1500, total: 7500 },
      { mes: "Feb", retail: 3200, grupal: 3800, liderazgo: 1800, total: 8800 },
      { mes: "Mar", retail: 3000, grupal: 3500, liderazgo: 1600, total: 8100 },
      { mes: "Abr", retail: 3800, grupal: 4200, liderazgo: 2100, total: 10100 },
      { mes: "May", retail: 4200, grupal: 4800, liderazgo: 2400, total: 11400 },
      { mes: "Jun", retail: 4500, grupal: 5200, liderazgo: 2640, total: 12340 },
    ],
    detalle: [
      { mes: "Junio 2026", tipo: "Bono Retail", monto: 4500, estatus: "pagado" as const },
      { mes: "Junio 2026", tipo: "Bono Grupal", monto: 5200, estatus: "pagado" as const },
      { mes: "Junio 2026", tipo: "Bono Liderazgo", monto: 2640, estatus: "pendiente" as const },
      { mes: "Mayo 2026", tipo: "Bono Retail", monto: 4200, estatus: "pagado" as const },
      { mes: "Mayo 2026", tipo: "Bono Grupal", monto: 4800, estatus: "pagado" as const },
      { mes: "Mayo 2026", tipo: "Bono Liderazgo", monto: 2400, estatus: "pagado" as const },
      { mes: "Abril 2026", tipo: "Bono Retail", monto: 3800, estatus: "pagado" as const },
      { mes: "Abril 2026", tipo: "Bono Grupal", monto: 4200, estatus: "pagado" as const },
      { mes: "Abril 2026", tipo: "Bono Liderazgo", monto: 2100, estatus: "pagado" as const },
    ],
  },

  pedidos: {
    misPedidos: [
      {
        id: "PED-1047",
        fecha: "2026-06-28",
        productos: [
          { nombre: "Ambrotose LIFE", cantidad: 2, precio: 1600 },
          { nombre: "PhytoMatrix", cantidad: 1, precio: 1890 },
        ],
        total: 5090,
        estatus: "entregado" as const,
        timeline: [
          { paso: "Pedido recibido", fecha: "28 Jun 2026", completado: true },
          { paso: "En preparacion", fecha: "28 Jun 2026", completado: true },
          { paso: "Enviado", fecha: "29 Jun 2026", completado: true },
          { paso: "Entregado", fecha: "30 Jun 2026", completado: true },
        ],
      },
      {
        id: "PED-1032",
        fecha: "2026-06-15",
        productos: [
          { nombre: "Ambrotose", cantidad: 3, precio: 2700 },
        ],
        total: 8100,
        estatus: "entregado" as const,
        timeline: [
          { paso: "Pedido recibido", fecha: "15 Jun 2026", completado: true },
          { paso: "En preparacion", fecha: "15 Jun 2026", completado: true },
          { paso: "Enviado", fecha: "16 Jun 2026", completado: true },
          { paso: "Entregado", fecha: "18 Jun 2026", completado: true },
        ],
      },
      {
        id: "PED-1058",
        fecha: "2026-06-30",
        productos: [
          { nombre: "MannaBears", cantidad: 4, precio: 900 },
          { nombre: "GI-ProBalance", cantidad: 1, precio: 2100 },
        ],
        total: 5700,
        estatus: "enviado" as const,
        timeline: [
          { paso: "Pedido recibido", fecha: "30 Jun 2026", completado: true },
          { paso: "En preparacion", fecha: "30 Jun 2026", completado: true },
          { paso: "Enviado", fecha: "1 Jul 2026", completado: true },
          { paso: "Entregado", fecha: "", completado: false },
        ],
      },
    ],
    pedidosRed: [
      {
        id: "PED-R2001",
        fecha: "2026-06-29",
        cliente: "Maria Garcia Lopez",
        productos: [
          { nombre: "Ambrotose", cantidad: 1, precio: 2700 },
        ],
        total: 2700,
        estatus: "entregado" as const,
        timeline: [
          { paso: "Pedido recibido", fecha: "29 Jun 2026", completado: true },
          { paso: "En preparacion", fecha: "29 Jun 2026", completado: true },
          { paso: "Enviado", fecha: "30 Jun 2026", completado: true },
          { paso: "Entregado", fecha: "1 Jul 2026", completado: true },
        ],
      },
      {
        id: "PED-R2002",
        fecha: "2026-06-27",
        cliente: "Roberto Diaz Herrera",
        productos: [
          { nombre: "Ambrotose LIFE", cantidad: 1, precio: 1600 },
          { nombre: "MannaBears", cantidad: 2, precio: 900 },
        ],
        total: 3400,
        estatus: "enviado" as const,
        timeline: [
          { paso: "Pedido recibido", fecha: "27 Jun 2026", completado: true },
          { paso: "En preparacion", fecha: "27 Jun 2026", completado: true },
          { paso: "Enviado", fecha: "28 Jun 2026", completado: true },
          { paso: "Entregado", fecha: "", completado: false },
        ],
      },
      {
        id: "PED-R2003",
        fecha: "2026-06-30",
        cliente: "Fernando Castillo",
        productos: [
          { nombre: "Optimal Support Packets", cantidad: 2, precio: 1950 },
        ],
        total: 3900,
        estatus: "procesando" as const,
        timeline: [
          { paso: "Pedido recibido", fecha: "30 Jun 2026", completado: true },
          { paso: "En preparacion", fecha: "1 Jul 2026", completado: true },
          { paso: "Enviado", fecha: "", completado: false },
          { paso: "Entregado", fecha: "", completado: false },
        ],
      },
    ],
  },

  herramientas: {
    linkReferido: "https://mannatech.com/ref/carlos-mendoza",
    materiales: [
      { id: "mat-1", nombre: "Catalogo de Productos 2026", tipo: "PDF", tamano: "4.2 MB" },
      { id: "mat-2", nombre: "Presentacion de Negocio", tipo: "PDF", tamano: "8.1 MB" },
      { id: "mat-3", nombre: "Guia de Gliconutrientes", tipo: "PDF", tamano: "2.8 MB" },
      { id: "mat-4", nombre: "Flyer Ambrotose", tipo: "PDF", tamano: "1.5 MB" },
      { id: "mat-5", nombre: "Plan de Compensacion", tipo: "PDF", tamano: "3.6 MB" },
    ],
    plantillasSocial: [
      { id: "tpl-1", nombre: "Historia de Exito", red: "Instagram" },
      { id: "tpl-2", nombre: "Promocion Producto", red: "Facebook" },
      { id: "tpl-3", nombre: "Invitacion Webinar", red: "WhatsApp" },
      { id: "tpl-4", nombre: "Testimonio Cliente", red: "Instagram" },
    ],
  },

  calendario: [
    {
      id: "ev-1",
      titulo: "Webinar: Ciencia de los Gliconutrientes",
      fecha: "2026-07-05",
      hora: "19:00",
      tipo: "webinar" as const,
      descripcion: "Aprende sobre la ciencia detras de Ambrotose y como comunicar los beneficios a tus clientes.",
    },
    {
      id: "ev-2",
      titulo: "Entrenamiento de Liderazgo",
      fecha: "2026-07-10",
      hora: "10:00",
      tipo: "entrenamiento" as const,
      descripcion: "Sesion intensiva para desarrollar habilidades de liderazgo y gestion de equipos en tu red.",
    },
    {
      id: "ev-3",
      titulo: "Lanzamiento Nuevo Producto",
      fecha: "2026-07-15",
      hora: "18:00",
      tipo: "evento" as const,
      descripcion: "Se a parte del lanzamiento exclusivo del nuevo suplemento de la linea Ambrotose.",
    },
    {
      id: "ev-4",
      titulo: "Taller de Redes Sociales",
      fecha: "2026-07-20",
      hora: "11:00",
      tipo: "entrenamiento" as const,
      descripcion: "Estrategias efectivas para promocionar productos y reclutar nuevos asociados en redes sociales.",
    },
    {
      id: "ev-5",
      titulo: "Conferencia Regional Guadalajara",
      fecha: "2026-07-28",
      hora: "09:00",
      tipo: "evento" as const,
      descripcion: "Gran evento presencial con reconocimientos, capacitaciones y networking con los lideres de la region.",
    },
  ],

  rango: {
    actual: "Asociado Plata",
    siguiente: "Asociado Oro",
    progresoGeneral: 72,
    requisitos: [
      {
        nombre: "PV Personal",
        actual: 320,
        requerido: 300,
        cumplido: true,
        unidad: "PV",
      },
      {
        nombre: "PV Grupal",
        actual: 1850,
        requerido: 2500,
        cumplido: false,
        unidad: "PV",
      },
      {
        nombre: "Miembros Activos en Red",
        actual: 38,
        requerido: 50,
        cumplido: false,
        unidad: "miembros",
      },
      {
        nombre: "Lineas Calificadas",
        actual: 3,
        requerido: 3,
        cumplido: true,
        unidad: "lineas",
      },
    ],
    beneficiosSiguienteRango: [
      "Bono de liderazgo del 8% (actualmente 5%)",
      "Acceso a eventos VIP exclusivos",
      "Descuento adicional del 5% en productos",
      "Reconocimiento en conferencia regional",
    ],
  },

  aprendizaje: {
    enProgreso: [
      {
        id: "cur-1",
        titulo: "Fundamentos de Gliconutricion",
        progreso: 65,
        duracion: "2h 30min",
        modulos: 8,
        modulosCompletados: 5,
      },
      {
        id: "cur-2",
        titulo: "Tecnicas de Venta Consultiva",
        progreso: 30,
        duracion: "1h 45min",
        modulos: 6,
        modulosCompletados: 2,
      },
      {
        id: "cur-3",
        titulo: "Construyendo tu Red MLM",
        progreso: 80,
        duracion: "3h 00min",
        modulos: 10,
        modulosCompletados: 8,
      },
    ],
    completados: [
      {
        id: "cur-4",
        titulo: "Introduccion a Mannatech",
        fechaCompletado: "2024-04-10",
      },
      {
        id: "cur-5",
        titulo: "Conoce los Productos",
        fechaCompletado: "2024-05-22",
      },
      {
        id: "cur-6",
        titulo: "Primeros Pasos como Asociado",
        fechaCompletado: "2024-03-28",
      },
      {
        id: "cur-7",
        titulo: "Servicio al Cliente de Excelencia",
        fechaCompletado: "2025-01-15",
      },
    ],
  },

  notificaciones: [
    {
      id: "n1",
      tipo: "venta" as const,
      mensaje: "Nueva venta de $3,200 MXN registrada",
      fecha: "2026-06-30",
      hora: "14:32",
    },
    {
      id: "n2",
      tipo: "red" as const,
      mensaje: "Valentina Torres alcanzo 80 PV este mes",
      fecha: "2026-06-29",
      hora: "09:15",
    },
    {
      id: "n3",
      tipo: "comision" as const,
      mensaje: "Bono Grupal de $5,200 MXN depositado",
      fecha: "2026-06-28",
      hora: "11:00",
    },
    {
      id: "n4",
      tipo: "red" as const,
      mensaje: "Maria Garcia inscribio a un nuevo miembro",
      fecha: "2026-06-27",
      hora: "16:45",
    },
    {
      id: "n5",
      tipo: "logro" as const,
      mensaje: "Cumpliste el requisito de PV Personal para Asociado Oro",
      fecha: "2026-06-26",
      hora: "08:00",
    },
    {
      id: "n6",
      tipo: "evento" as const,
      mensaje: "Recordatorio: Webinar manana a las 19:00",
      fecha: "2026-06-25",
      hora: "18:00",
    },
  ],
};

// =============================================================================
// Mock Data for Admin Dashboard
// =============================================================================

export const mockAdmin = {
  // --- KPIs -----------------------------------------------------------------
  kpis: {
    ventasHoy: 47_850,
    ventasMes: 1_284_500,
    pedidosNuevos: 23,
    usuariosNuevos: 18,
    sociosActivos: 342,
    ticketsAbiertos: 7,
    ventasHoyDelta: 12.5,
    ventasMesDelta: 8.3,
    pedidosDelta: -3.2,
    usuariosDelta: 15.0,
    sociosDelta: 2.1,
    ticketsDelta: -22.0,
  },

  // --- Ventas Historial (12 meses) ------------------------------------------
  ventasHistorial: [
    { mes: "Jul", actual: 980_000, anterior: 870_000 },
    { mes: "Ago", actual: 1_050_000, anterior: 920_000 },
    { mes: "Sep", actual: 1_120_000, anterior: 1_010_000 },
    { mes: "Oct", actual: 1_200_000, anterior: 1_050_000 },
    { mes: "Nov", actual: 1_350_000, anterior: 1_180_000 },
    { mes: "Dic", actual: 1_580_000, anterior: 1_320_000 },
    { mes: "Ene", actual: 1_100_000, anterior: 960_000 },
    { mes: "Feb", actual: 1_050_000, anterior: 940_000 },
    { mes: "Mar", actual: 1_180_000, anterior: 1_020_000 },
    { mes: "Abr", actual: 1_220_000, anterior: 1_080_000 },
    { mes: "May", actual: 1_310_000, anterior: 1_150_000 },
    { mes: "Jun", actual: 1_284_500, anterior: 1_200_000 },
  ],

  // --- Ventas por Categoria -------------------------------------------------
  ventasPorCategoria: [
    { nombre: "Suplementos", valor: 485_000, color: "#00A88F" },
    { nombre: "Cuidado Personal", valor: 312_000, color: "#3B82F6" },
    { nombre: "Nutricion", valor: 245_000, color: "#F59E0B" },
    { nombre: "Peso Ideal", valor: 158_000, color: "#8B5CF6" },
    { nombre: "Aceites Esenciales", valor: 84_500, color: "#EC4899" },
  ],

  // --- Pedidos --------------------------------------------------------------
  pedidos: [
    { id: "PED-001", fecha: "2026-06-30", cliente: "Maria Garcia Lopez", items: 3, total: 4_250, metodoPago: "Tarjeta Credito", estatus: "completado", email: "maria@email.com", telefono: "33-1234-5678", direccion: "Av. Vallarta 1234, Guadalajara, Jal.", productos: [{ nombre: "Ambrotose", cantidad: 1, precio: 1_890 }, { nombre: "PhytoMatrix", cantidad: 1, precio: 1_250 }, { nombre: "OsoLean", cantidad: 1, precio: 1_110 }], subtotal: 4_250, envio: 0, impuestos: 680, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-30 09:15", completado: true }, { paso: "Pago Confirmado", fecha: "2026-06-30 09:16", completado: true }, { paso: "En Preparacion", fecha: "2026-06-30 10:30", completado: true }, { paso: "Enviado", fecha: "2026-06-30 14:00", completado: true }, { paso: "Entregado", fecha: "2026-07-01 11:20", completado: true }] },
    { id: "PED-002", fecha: "2026-06-30", cliente: "Carlos Hernandez", items: 1, total: 1_890, metodoPago: "PayPal", estatus: "en_proceso", email: "carlos@email.com", telefono: "33-9876-5432", direccion: "Col. Providencia 567, Guadalajara, Jal.", productos: [{ nombre: "Ambrotose", cantidad: 1, precio: 1_890 }], subtotal: 1_890, envio: 150, impuestos: 302, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-30 14:22", completado: true }, { paso: "Pago Confirmado", fecha: "2026-06-30 14:23", completado: true }, { paso: "En Preparacion", fecha: "2026-06-30 15:00", completado: true }, { paso: "Enviado", fecha: "", completado: false }, { paso: "Entregado", fecha: "", completado: false }] },
    { id: "PED-003", fecha: "2026-06-29", cliente: "Ana Rodriguez Martinez", items: 5, total: 7_830, metodoPago: "Transferencia", estatus: "pendiente", email: "ana@email.com", telefono: "55-1122-3344", direccion: "Polanco 890, CDMX", productos: [{ nombre: "GI-ProBalance", cantidad: 2, precio: 1_580 }, { nombre: "Ambrotose", cantidad: 1, precio: 1_890 }, { nombre: "MannaCLEANSE", cantidad: 2, precio: 1_390 }], subtotal: 7_830, envio: 0, impuestos: 1_253, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-29 18:45", completado: true }, { paso: "Pago Confirmado", fecha: "", completado: false }, { paso: "En Preparacion", fecha: "", completado: false }, { paso: "Enviado", fecha: "", completado: false }, { paso: "Entregado", fecha: "", completado: false }] },
    { id: "PED-004", fecha: "2026-06-29", cliente: "Luis Ramirez Ortiz", items: 2, total: 3_140, metodoPago: "Tarjeta Debito", estatus: "completado", email: "luis@email.com", telefono: "81-5566-7788", direccion: "San Pedro 456, Monterrey, NL", productos: [{ nombre: "PhytoMatrix", cantidad: 1, precio: 1_250 }, { nombre: "Ambrotose", cantidad: 1, precio: 1_890 }], subtotal: 3_140, envio: 200, impuestos: 502, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-29 10:00", completado: true }, { paso: "Pago Confirmado", fecha: "2026-06-29 10:01", completado: true }, { paso: "En Preparacion", fecha: "2026-06-29 11:30", completado: true }, { paso: "Enviado", fecha: "2026-06-29 16:00", completado: true }, { paso: "Entregado", fecha: "2026-06-30 14:00", completado: true }] },
    { id: "PED-005", fecha: "2026-06-28", cliente: "Patricia Sanchez", items: 4, total: 5_670, metodoPago: "Tarjeta Credito", estatus: "cancelado", email: "patricia@email.com", telefono: "33-4455-6677", direccion: "Av. Americas 123, Guadalajara, Jal.", productos: [{ nombre: "PLUS", cantidad: 2, precio: 1_450 }, { nombre: "OsoLean", cantidad: 2, precio: 1_385 }], subtotal: 5_670, envio: 0, impuestos: 907, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-28 08:30", completado: true }, { paso: "Cancelado", fecha: "2026-06-28 09:15", completado: true }] },
    { id: "PED-006", fecha: "2026-06-28", cliente: "Roberto Flores", items: 1, total: 2_340, metodoPago: "PayPal", estatus: "en_proceso", email: "roberto@email.com", telefono: "33-7788-9900", direccion: "Zapopan Centro 789, Zapopan, Jal.", productos: [{ nombre: "Ambrotose LIFE", cantidad: 1, precio: 2_340 }], subtotal: 2_340, envio: 150, impuestos: 374, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-28 12:00", completado: true }, { paso: "Pago Confirmado", fecha: "2026-06-28 12:01", completado: true }, { paso: "En Preparacion", fecha: "2026-06-28 14:00", completado: true }, { paso: "Enviado", fecha: "", completado: false }, { paso: "Entregado", fecha: "", completado: false }] },
    { id: "PED-007", fecha: "2026-06-27", cliente: "Sofia Torres Ruiz", items: 3, total: 4_180, metodoPago: "Transferencia", estatus: "completado", email: "sofia@email.com", telefono: "55-2233-4455", direccion: "Roma Norte 456, CDMX", productos: [{ nombre: "Ambrotose", cantidad: 1, precio: 1_890 }, { nombre: "MannaCLEANSE", cantidad: 1, precio: 1_390 }, { nombre: "Manapol", cantidad: 1, precio: 900 }], subtotal: 4_180, envio: 0, impuestos: 669, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-27 16:30", completado: true }, { paso: "Pago Confirmado", fecha: "2026-06-27 16:31", completado: true }, { paso: "En Preparacion", fecha: "2026-06-27 17:00", completado: true }, { paso: "Enviado", fecha: "2026-06-28 09:00", completado: true }, { paso: "Entregado", fecha: "2026-06-29 12:00", completado: true }] },
    { id: "PED-008", fecha: "2026-06-27", cliente: "Miguel Angel Diaz", items: 2, total: 2_780, metodoPago: "Tarjeta Credito", estatus: "pendiente", email: "miguel@email.com", telefono: "81-3344-5566", direccion: "Cumbres 234, Monterrey, NL", productos: [{ nombre: "GI-ProBalance", cantidad: 1, precio: 1_580 }, { nombre: "OsoLean", cantidad: 1, precio: 1_200 }], subtotal: 2_780, envio: 200, impuestos: 445, timeline: [{ paso: "Pedido Recibido", fecha: "2026-06-27 20:00", completado: true }, { paso: "Pago Confirmado", fecha: "", completado: false }, { paso: "En Preparacion", fecha: "", completado: false }, { paso: "Enviado", fecha: "", completado: false }, { paso: "Entregado", fecha: "", completado: false }] },
  ],

  // --- Productos ------------------------------------------------------------
  productos: [
    { id: "1", nombre: "Ambrotose", sku: "AMB-001", categoria: "Suplementos", precio: 1_890, stock: 145, ventas30d: 89, estatus: "activo", descripcion: "El suplemento insignia de Mannatech. Contiene gliconutrientes esenciales para apoyar la comunicacion celular." },
    { id: "2", nombre: "Ambrotose LIFE", sku: "AML-002", categoria: "Suplementos", precio: 2_340, stock: 78, ventas30d: 52, estatus: "activo", descripcion: "Formula avanzada con gliconutrientes y antioxidantes para una salud celular optima." },
    { id: "3", nombre: "PhytoMatrix", sku: "PHY-003", categoria: "Nutricion", precio: 1_250, stock: 203, ventas30d: 67, estatus: "activo", descripcion: "Multivitaminico con fitonutrientes de frutas y verduras reales." },
    { id: "4", nombre: "PLUS", sku: "PLS-004", categoria: "Nutricion", precio: 1_450, stock: 12, ventas30d: 45, estatus: "activo", descripcion: "Suplemento de vitaminas y minerales con tecnologia de gliconutrientes." },
    { id: "5", nombre: "OsoLean", sku: "OSO-005", categoria: "Peso Ideal", precio: 1_385, stock: 95, ventas30d: 38, estatus: "activo", descripcion: "Apoya la perdida de grasa mientras preserva la masa muscular magra." },
    { id: "6", nombre: "GI-ProBalance", sku: "GIP-006", categoria: "Suplementos", precio: 1_580, stock: 5, ventas30d: 71, estatus: "activo", descripcion: "Probioticos y prebioticos para una salud digestiva optima." },
    { id: "7", nombre: "MannaCLEANSE", sku: "MCL-007", categoria: "Cuidado Personal", precio: 1_390, stock: 167, ventas30d: 33, estatus: "activo", descripcion: "Programa de limpieza y desintoxicacion de 7 dias." },
    { id: "8", nombre: "Manapol", sku: "MNP-008", categoria: "Suplementos", precio: 900, stock: 0, ventas30d: 28, estatus: "agotado", descripcion: "Polvo de Aloe vera de alta calidad rico en acemannano." },
    { id: "9", nombre: "Emprizone Gel", sku: "EMP-009", categoria: "Cuidado Personal", precio: 680, stock: 234, ventas30d: 19, estatus: "activo", descripcion: "Gel topico con gliconutrientes para el cuidado de la piel." },
    { id: "10", nombre: "Uth Cleanser", sku: "UTH-010", categoria: "Cuidado Personal", precio: 750, stock: 89, ventas30d: 15, estatus: "pausado", descripcion: "Limpiador facial con tecnologia de gliconutrientes." },
    { id: "11", nombre: "Omega-3 with Vitamin D3", sku: "OMG-011", categoria: "Nutricion", precio: 1_100, stock: 156, ventas30d: 41, estatus: "activo", descripcion: "Aceite de pescado de alta calidad con vitamina D3." },
    { id: "12", nombre: "MannaBOOM", sku: "MBM-012", categoria: "Aceites Esenciales", precio: 890, stock: 67, ventas30d: 22, estatus: "activo", descripcion: "Mezcla de aceites esenciales para bienestar general." },
  ],

  // --- Inventario -----------------------------------------------------------
  inventario: [
    { producto: "Manapol", stockActual: 0, stockMinimo: 20, nivel: "critico", ultimoRestock: "2026-05-15" },
    { producto: "GI-ProBalance", stockActual: 5, stockMinimo: 30, nivel: "critico", ultimoRestock: "2026-06-10" },
    { producto: "PLUS", stockActual: 12, stockMinimo: 25, nivel: "bajo", ultimoRestock: "2026-06-20" },
    { producto: "Ambrotose", stockActual: 145, stockMinimo: 50, nivel: "normal", ultimoRestock: "2026-06-25" },
    { producto: "Ambrotose LIFE", stockActual: 78, stockMinimo: 30, nivel: "normal", ultimoRestock: "2026-06-22" },
    { producto: "PhytoMatrix", stockActual: 203, stockMinimo: 40, nivel: "normal", ultimoRestock: "2026-06-28" },
    { producto: "OsoLean", stockActual: 95, stockMinimo: 25, nivel: "normal", ultimoRestock: "2026-06-18" },
    { producto: "MannaCLEANSE", stockActual: 167, stockMinimo: 30, nivel: "normal", ultimoRestock: "2026-06-26" },
    { producto: "Emprizone Gel", stockActual: 234, stockMinimo: 40, nivel: "normal", ultimoRestock: "2026-06-27" },
    { producto: "Uth Cleanser", stockActual: 89, stockMinimo: 20, nivel: "normal", ultimoRestock: "2026-06-15" },
    { producto: "Omega-3 with Vitamin D3", stockActual: 156, stockMinimo: 35, nivel: "normal", ultimoRestock: "2026-06-24" },
    { producto: "MannaBOOM", stockActual: 67, stockMinimo: 20, nivel: "normal", ultimoRestock: "2026-06-20" },
  ],

  // --- Usuarios -------------------------------------------------------------
  usuarios: [
    { id: "U001", nombre: "Maria Garcia Lopez", email: "maria@email.com", tipo: "cliente", fechaRegistro: "2026-01-15", ultimaActividad: "2026-06-30", estatus: "activo", pedidos: 12, gastoTotal: 28_400, telefono: "33-1234-5678", direccion: "Av. Vallarta 1234, Guadalajara, Jal." },
    { id: "U002", nombre: "Carlos Hernandez", email: "carlos@email.com", tipo: "socio", fechaRegistro: "2025-08-22", ultimaActividad: "2026-06-30", estatus: "activo", pedidos: 45, gastoTotal: 156_200, telefono: "33-9876-5432", direccion: "Col. Providencia 567, Guadalajara, Jal.", nivel: "Oro", pv: 4_250, red: 28 },
    { id: "U003", nombre: "Ana Rodriguez Martinez", email: "ana@email.com", tipo: "cliente", fechaRegistro: "2026-03-10", ultimaActividad: "2026-06-29", estatus: "activo", pedidos: 6, gastoTotal: 15_300, telefono: "55-1122-3344", direccion: "Polanco 890, CDMX" },
    { id: "U004", nombre: "Luis Ramirez Ortiz", email: "luis@email.com", tipo: "socio", fechaRegistro: "2025-05-14", ultimaActividad: "2026-06-29", estatus: "activo", pedidos: 67, gastoTotal: 234_500, telefono: "81-5566-7788", direccion: "San Pedro 456, Monterrey, NL", nivel: "Platino", pv: 8_900, red: 52 },
    { id: "U005", nombre: "Patricia Sanchez", email: "patricia@email.com", tipo: "cliente", fechaRegistro: "2026-05-20", ultimaActividad: "2026-06-28", estatus: "activo", pedidos: 3, gastoTotal: 8_900, telefono: "33-4455-6677", direccion: "Av. Americas 123, Guadalajara, Jal." },
    { id: "U006", nombre: "Roberto Flores", email: "roberto@email.com", tipo: "socio", fechaRegistro: "2024-11-30", ultimaActividad: "2026-06-28", estatus: "activo", pedidos: 89, gastoTotal: 312_000, telefono: "33-7788-9900", direccion: "Zapopan Centro 789, Zapopan, Jal.", nivel: "Diamante", pv: 15_200, red: 128 },
    { id: "U007", nombre: "Sofia Torres Ruiz", email: "sofia@email.com", tipo: "cliente", fechaRegistro: "2026-04-05", ultimaActividad: "2026-06-27", estatus: "activo", pedidos: 4, gastoTotal: 11_200, telefono: "55-2233-4455", direccion: "Roma Norte 456, CDMX" },
    { id: "U008", nombre: "Miguel Angel Diaz", email: "miguel@email.com", tipo: "socio", fechaRegistro: "2025-09-18", ultimaActividad: "2026-06-27", estatus: "inactivo", pedidos: 23, gastoTotal: 78_500, telefono: "81-3344-5566", direccion: "Cumbres 234, Monterrey, NL", nivel: "Plata", pv: 2_100, red: 12 },
    { id: "U009", nombre: "Admin DMLABS", email: "admin@dmlabs.mx", tipo: "admin", fechaRegistro: "2024-01-01", ultimaActividad: "2026-07-01", estatus: "activo", pedidos: 0, gastoTotal: 0, telefono: "33-0000-0000", direccion: "DMLABS HQ, Guadalajara, Jal." },
    { id: "U010", nombre: "Laura Mendez", email: "laura@email.com", tipo: "cliente", fechaRegistro: "2026-06-01", ultimaActividad: "2026-06-25", estatus: "activo", pedidos: 1, gastoTotal: 1_890, telefono: "33-5566-7788", direccion: "Chapalita 321, Guadalajara, Jal." },
  ],

  // --- Red MLM --------------------------------------------------------------
  redMLM: {
    totalMiembros: 342,
    niveles: [
      { nivel: "Diamante", miembros: 8, pvTotal: 124_800 },
      { nivel: "Platino", miembros: 22, pvTotal: 198_000 },
      { nivel: "Oro", miembros: 45, pvTotal: 191_250 },
      { nivel: "Plata", miembros: 87, pvTotal: 182_700 },
      { nivel: "Bronce", miembros: 180, pvTotal: 162_000 },
    ],
    crecimientoMensual: 5.2,
    pvTotalRed: 858_750,
  },

  // --- Comisiones -----------------------------------------------------------
  comisiones: {
    pendientesPago: 234_500,
    pagadasMes: 890_200,
    detalle: [
      { id: "COM-001", socio: "Roberto Flores", monto: 45_200, tipo: "Volumen Personal", estatus: "pendiente", fecha: "2026-06-30" },
      { id: "COM-002", socio: "Luis Ramirez Ortiz", monto: 28_900, tipo: "Bono Liderazgo", estatus: "pendiente", fecha: "2026-06-30" },
      { id: "COM-003", socio: "Carlos Hernandez", monto: 15_600, tipo: "Volumen Grupal", estatus: "pagada", fecha: "2026-06-28" },
      { id: "COM-004", socio: "Roberto Flores", monto: 32_100, tipo: "Bono Generacional", estatus: "pagada", fecha: "2026-06-25" },
      { id: "COM-005", socio: "Miguel Angel Diaz", monto: 8_400, tipo: "Volumen Personal", estatus: "pendiente", fecha: "2026-06-30" },
      { id: "COM-006", socio: "Luis Ramirez Ortiz", monto: 22_300, tipo: "Bono Duplicacion", estatus: "pagada", fecha: "2026-06-20" },
      { id: "COM-007", socio: "Carlos Hernandez", monto: 11_800, tipo: "Volumen Personal", estatus: "procesando", fecha: "2026-06-29" },
    ],
  },

  // --- Marketing ------------------------------------------------------------
  marketing: {
    banners: [
      { id: "B1", titulo: "Oferta Verano 2026", clicks: 1_234, impresiones: 18_500, activo: true },
      { id: "B2", titulo: "Nuevo Ambrotose LIFE", clicks: 892, impresiones: 12_300, activo: true },
      { id: "B3", titulo: "Unete a la Red", clicks: 567, impresiones: 8_900, activo: false },
    ],
    cupones: [
      { codigo: "MANNA15", descuento: 15, tipo: "porcentaje", usos: 234, limite: 500, vigenciaInicio: "2026-06-01", vigenciaFin: "2026-07-31", activo: true },
      { codigo: "ENVIOGRATIS", descuento: 0, tipo: "envio_gratis", usos: 89, limite: 200, vigenciaInicio: "2026-06-15", vigenciaFin: "2026-07-15", activo: true },
      { codigo: "WELCOME10", descuento: 10, tipo: "porcentaje", usos: 156, limite: 1000, vigenciaInicio: "2026-01-01", vigenciaFin: "2026-12-31", activo: true },
      { codigo: "VERANO20", descuento: 20, tipo: "porcentaje", usos: 500, limite: 500, vigenciaInicio: "2026-06-01", vigenciaFin: "2026-06-30", activo: false },
    ],
    newsletter: {
      suscriptores: 4_521,
      tasaApertura: 34.2,
      ultimaCampana: "2026-06-28",
      campanasEnviadas: 24,
    },
  },

  // --- Reportes -------------------------------------------------------------
  reportes: {
    ventasPorRegion: [
      { region: "Jalisco", ventas: 485_000 },
      { region: "CDMX", ventas: 312_000 },
      { region: "Nuevo Leon", ventas: 198_000 },
      { region: "Estado de Mexico", ventas: 145_000 },
      { region: "Puebla", ventas: 89_000 },
      { region: "Otros", ventas: 55_500 },
    ],
    topProductos: [
      { nombre: "Ambrotose", unidades: 89, ventas: 168_210 },
      { nombre: "GI-ProBalance", unidades: 71, ventas: 112_180 },
      { nombre: "PhytoMatrix", unidades: 67, ventas: 83_750 },
      { nombre: "Ambrotose LIFE", unidades: 52, ventas: 121_680 },
      { nombre: "PLUS", unidades: 45, ventas: 65_250 },
    ],
    topSocios: [
      { nombre: "Roberto Flores", ventas: 312_000, clientes: 128 },
      { nombre: "Luis Ramirez Ortiz", ventas: 234_500, clientes: 52 },
      { nombre: "Carlos Hernandez", ventas: 156_200, clientes: 28 },
      { nombre: "Miguel Angel Diaz", ventas: 78_500, clientes: 12 },
    ],
  },

  // --- Configuracion --------------------------------------------------------
  configuracion: {
    empresa: {
      nombre: "Mannatech Mexico S.A. de C.V.",
      rfc: "MMA-980515-XX0",
      direccion: "Av. Insurgentes Sur 1602, Col. Credito Constructor, CDMX, CP 03940",
      telefono: "800-MANNA-MX",
      email: "contacto@mannatech.com.mx",
    },
    impuestos: { iva: 16, ieps: 0 },
    envios: [
      { zona: "Local (Jalisco)", costo: 0, tiempoEstimado: "1-2 dias habiles" },
      { zona: "Nacional Zona A", costo: 150, tiempoEstimado: "3-5 dias habiles" },
      { zona: "Nacional Zona B", costo: 200, tiempoEstimado: "5-7 dias habiles" },
      { zona: "Nacional Zona C", costo: 280, tiempoEstimado: "7-10 dias habiles" },
    ],
    metodosPago: [
      { nombre: "Tarjeta de Credito", activo: true, comision: 3.5 },
      { nombre: "Tarjeta de Debito", activo: true, comision: 2.8 },
      { nombre: "PayPal", activo: true, comision: 4.2 },
      { nombre: "Transferencia Bancaria", activo: true, comision: 0 },
      { nombre: "OXXO Pay", activo: false, comision: 3.0 },
    ],
  },

  // --- Soporte --------------------------------------------------------------
  soporte: {
    resumen: { abiertos: 7, enProgreso: 4, resueltos: 156 },
    tickets: [
      { id: "TK-001", asunto: "Producto danado en envio", cliente: "Maria Garcia Lopez", prioridad: "alta", estatus: "abierto", fecha: "2026-06-30", mensajes: [
        { autor: "Maria Garcia Lopez", contenido: "Recibi mi pedido PED-001 pero el frasco de Ambrotose llego roto. Adjunto fotos.", fecha: "2026-06-30 11:00", esCliente: true },
        { autor: "Soporte Mannatech", contenido: "Lamentamos mucho el inconveniente, Maria. Vamos a procesar el reenvio de su producto inmediatamente.", fecha: "2026-06-30 11:45", esCliente: false },
        { autor: "Maria Garcia Lopez", contenido: "Muchas gracias, quedo en espera de la confirmacion.", fecha: "2026-06-30 12:10", esCliente: true },
      ]},
      { id: "TK-002", asunto: "No puedo acceder a mi cuenta", cliente: "Carlos Hernandez", prioridad: "media", estatus: "en_progreso", fecha: "2026-06-29", mensajes: [
        { autor: "Carlos Hernandez", contenido: "Intente iniciar sesion y me dice que mi contrasena es incorrecta. Ya intente restablecerla pero no recibo el correo.", fecha: "2026-06-29 09:00", esCliente: true },
        { autor: "Soporte Mannatech", contenido: "Verificamos que su correo esta registrado correctamente. Le enviamos un enlace de restablecimiento manual. Revise su bandeja de spam.", fecha: "2026-06-29 10:30", esCliente: false },
      ]},
      { id: "TK-003", asunto: "Consulta sobre devoluciones", cliente: "Patricia Sanchez", prioridad: "baja", estatus: "resuelto", fecha: "2026-06-28", mensajes: [
        { autor: "Patricia Sanchez", contenido: "Cual es la politica de devolucion para productos sin abrir?", fecha: "2026-06-28 14:00", esCliente: true },
        { autor: "Soporte Mannatech", contenido: "Nuestra politica permite devoluciones de productos sin abrir dentro de los 30 dias posteriores a la compra. El reembolso se procesa en 5-7 dias habiles.", fecha: "2026-06-28 15:00", esCliente: false },
        { autor: "Patricia Sanchez", contenido: "Perfecto, muchas gracias por la informacion.", fecha: "2026-06-28 15:30", esCliente: true },
      ]},
      { id: "TK-004", asunto: "Error en cobro duplicado", cliente: "Roberto Flores", prioridad: "alta", estatus: "abierto", fecha: "2026-06-30", mensajes: [
        { autor: "Roberto Flores", contenido: "Me hicieron doble cargo por el pedido PED-006. Necesito que me reembolsen el cargo duplicado.", fecha: "2026-06-30 16:00", esCliente: true },
      ]},
      { id: "TK-005", asunto: "Demora en envio", cliente: "Sofia Torres Ruiz", prioridad: "media", estatus: "en_progreso", fecha: "2026-06-27", mensajes: [
        { autor: "Sofia Torres Ruiz", contenido: "Mi pedido debio llegar hace 3 dias y aun no lo recibo. El tracking no se actualiza.", fecha: "2026-06-27 10:00", esCliente: true },
        { autor: "Soporte Mannatech", contenido: "Estamos investigando con la paqueteria. Le daremos seguimiento en las proximas 24 horas.", fecha: "2026-06-27 11:30", esCliente: false },
      ]},
    ],
  },

  // --- Auditoria ------------------------------------------------------------
  auditoria: [
    { fecha: "2026-07-01 09:15", usuario: "Admin DMLABS", accion: "Inicio de sesion", detalle: "Login exitoso desde panel admin", ip: "189.203.45.12" },
    { fecha: "2026-07-01 09:20", usuario: "Admin DMLABS", accion: "Consulta reportes", detalle: "Genero reporte de ventas mensual", ip: "189.203.45.12" },
    { fecha: "2026-06-30 18:45", usuario: "Sistema", accion: "Backup automatico", detalle: "Respaldo de base de datos completado", ip: "10.0.0.1" },
    { fecha: "2026-06-30 16:30", usuario: "Admin DMLABS", accion: "Edicion producto", detalle: "Actualizo precio de Ambrotose LIFE", ip: "189.203.45.12" },
    { fecha: "2026-06-30 14:00", usuario: "Sistema", accion: "Envio pedido", detalle: "PED-001 marcado como enviado", ip: "10.0.0.1" },
    { fecha: "2026-06-30 11:45", usuario: "Soporte", accion: "Respuesta ticket", detalle: "TK-001: Respuesta enviada a Maria Garcia", ip: "189.203.45.15" },
    { fecha: "2026-06-30 09:16", usuario: "Sistema", accion: "Pago recibido", detalle: "PED-001: Pago confirmado via Tarjeta Credito", ip: "10.0.0.1" },
    { fecha: "2026-06-29 18:45", usuario: "Sistema", accion: "Pedido nuevo", detalle: "PED-003 creado por Ana Rodriguez", ip: "10.0.0.1" },
    { fecha: "2026-06-29 15:00", usuario: "Admin DMLABS", accion: "Edicion usuario", detalle: "Cambio nivel de Carlos Hernandez a Oro", ip: "189.203.45.12" },
    { fecha: "2026-06-29 10:00", usuario: "Sistema", accion: "Alerta inventario", detalle: "GI-ProBalance: Stock critico (5 unidades)", ip: "10.0.0.1" },
    { fecha: "2026-06-28 09:15", usuario: "Sistema", accion: "Pedido cancelado", detalle: "PED-005 cancelado por cliente Patricia Sanchez", ip: "10.0.0.1" },
    { fecha: "2026-06-28 08:00", usuario: "Sistema", accion: "Backup automatico", detalle: "Respaldo de base de datos completado", ip: "10.0.0.1" },
  ],

  // --- Actividad Reciente ---------------------------------------------------
  actividadReciente: [
    { tipo: "pedido", mensaje: "Nuevo pedido PED-003 por $7,830.00 MXN", tiempo: "Hace 2 horas", icono: "shopping-cart" },
    { tipo: "usuario", mensaje: "Laura Mendez se registro como nueva clienta", tiempo: "Hace 3 horas", icono: "user-plus" },
    { tipo: "pago", mensaje: "Pago confirmado para PED-002 via PayPal", tiempo: "Hace 4 horas", icono: "credit-card" },
    { tipo: "soporte", mensaje: "Nuevo ticket TK-004: Error en cobro duplicado", tiempo: "Hace 5 horas", icono: "headphones" },
    { tipo: "inventario", mensaje: "Alerta: GI-ProBalance con stock critico (5 uds)", tiempo: "Hace 6 horas", icono: "alert-triangle" },
    { tipo: "comision", mensaje: "Comision de $45,200 MXN generada para Roberto Flores", tiempo: "Hace 8 horas", icono: "dollar-sign" },
    { tipo: "pedido", mensaje: "Pedido PED-001 marcado como entregado", tiempo: "Hace 12 horas", icono: "check-circle" },
    { tipo: "marketing", mensaje: "Cupon MANNA15 utilizado 234 veces", tiempo: "Hace 1 dia", icono: "tag" },
  ],

  // --- Notificaciones -------------------------------------------------------
  notificaciones: [
    { id: "N1", titulo: "Stock critico", mensaje: "Manapol tiene 0 unidades en inventario", tipo: "alerta", leida: false, fecha: "2026-07-01" },
    { id: "N2", titulo: "Stock bajo", mensaje: "GI-ProBalance tiene solo 5 unidades", tipo: "advertencia", leida: false, fecha: "2026-07-01" },
    { id: "N3", titulo: "Nuevo ticket urgente", mensaje: "TK-004: Error en cobro duplicado", tipo: "alerta", leida: false, fecha: "2026-06-30" },
    { id: "N4", titulo: "Meta mensual alcanzada", mensaje: "Las ventas del mes superaron $1,200,000 MXN", tipo: "exito", leida: true, fecha: "2026-06-28" },
  ],
};
