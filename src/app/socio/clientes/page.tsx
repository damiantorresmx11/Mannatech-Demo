"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, UserCheck, UserX } from "lucide-react";
import { StatsCard, DataTable, StatusBadge, type DataTableColumn } from "@/components/dashboard";
import { mockSocio } from "@/lib/mock-data";
import { formatPrecio } from "@/lib/format";

export default function ClientesPage() {
  const { clientes } = mockSocio;

  const activos = clientes.filter((c) => c.estatus === "activo").length;
  const inactivos = clientes.filter((c) => c.estatus === "inactivo").length;

  const columns: DataTableColumn[] = [
    {
      key: "nombre",
      label: "Nombre",
      render: (value: string, row: (typeof clientes)[0]) => (
        <Link
          href={`/socio/clientes/${row.id}`}
          className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-[#00A88F] dark:hover:text-[#00C9A7] transition-colors"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "ultimaCompra",
      label: "Ultima Compra",
      render: (value: string) => {
        const date = new Date(value + "T00:00:00");
        return date.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      key: "totalCompras",
      label: "Total Compras",
      render: (value: number) => (
        <span className="font-semibold">{formatPrecio(value)}</span>
      ),
    },
    {
      key: "estatus",
      label: "Estatus",
      render: (value: string) => (
        <StatusBadge status={value.charAt(0).toUpperCase() + value.slice(1)} />
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[#262626] dark:text-foreground">
          Mis Clientes
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Gestiona y da seguimiento a tus clientes
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard title="Total Clientes" value={clientes.length} icon={Users} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatsCard title="Activos" value={activos} icon={UserCheck} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard title="Inactivos" value={inactivos} icon={UserX} />
        </motion.div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <DataTable
          columns={columns}
          data={clientes}
          searchable
          searchPlaceholder="Buscar por nombre o email..."
          pageSize={10}
        />
      </motion.div>
    </div>
  );
}
