"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, User, Calendar, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  productId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productName?: string;
}

function StarRating({
  rating,
  interactive = false,
  onRate,
  size = 20,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            size={size}
            className={`${
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...formData }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", rating: 0, comment: "" });
        setTimeout(() => {
          setShowForm(false);
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 py-8">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-100 rounded w-32" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Opiniones de clientes
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(avgRating)} size={22} />
              <span className="text-lg font-semibold text-gray-800">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({reviews.length} {reviews.length === 1 ? "opinion" : "opiniones"})
              </span>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-md"
        >
          <MessageSquare size={18} />
          Escribir una opinion
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-2">&#10003;</div>
                <h3 className="text-lg font-semibold text-green-800">
                  Gracias por tu opinion
                </h3>
                <p className="text-green-600 text-sm mt-1">
                  Tu resena sera publicada una vez aprobada por nuestro equipo.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Tu opinion sobre {productName || "este producto"}
                </h3>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calificacion *
                  </label>
                  <StarRating
                    rating={formData.rating}
                    interactive
                    onRate={(r) => setFormData({ ...formData, rating: r })}
                    size={28}
                  />
                  {formData.rating === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Selecciona una calificacion
                    </p>
                  )}
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentario *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Comparte tu experiencia con este producto..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting || formData.rating === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  {submitting ? "Enviando..." : "Enviar opinion"}
                </motion.button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">Aun no hay opiniones para este producto.</p>
          <p className="text-sm mt-1">Se el primero en compartir tu experiencia.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={12} />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size={16} />
                </div>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
