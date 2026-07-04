"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  MessageSquare,
  User,
  Package,
} from "lucide-react";

interface Review {
  id: string;
  productId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const TABS = [
  { key: "all", label: "Todas", icon: MessageSquare },
  { key: "pending", label: "Pendientes", icon: Clock },
  { key: "approved", label: "Aprobadas", icon: CheckCircle2 },
  { key: "rejected", label: "Rechazadas", icon: XCircle },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?all=true");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error("Error updating review:", err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered =
    activeTab === "all"
      ? reviews
      : reviews.filter((r) => r.status === activeTab);

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Moderacion de Resenas
          </h1>
          <p className="text-gray-400 mt-1">
            Administra las opiniones de los clientes
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Actualizar
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = counts[tab.key as keyof typeof counts];
          return (
            <div
              key={tab.key}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Icon size={14} />
                {tab.label}
              </div>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            <span className="ml-1 text-xs opacity-70">
              ({counts[tab.key as keyof typeof counts]})
            </span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          <MessageSquare size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">No hay resenas en esta categoria.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((review, index) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Review content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">{review.email}</p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[review.status]}`}
                      >
                        {STATUS_LABELS[review.status]}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-700 text-gray-700"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(review.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package size={12} />
                        Producto: {review.productId.slice(0, 12)}...
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 shrink-0">
                    {review.status !== "approved" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateStatus(review.id, "approved")}
                        disabled={updating === review.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium hover:bg-green-600/30 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        Aprobar
                      </motion.button>
                    )}
                    {review.status !== "rejected" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateStatus(review.id, "rejected")}
                        disabled={updating === review.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium hover:bg-red-600/30 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Rechazar
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
