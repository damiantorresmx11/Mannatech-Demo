"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  currency: string;
  image: string | null;
  category: string | null;
}

const RECENT_SEARCHES_KEY = "mannatech-recent-searches";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const recent = getRecentSearches().filter((s) => s !== term);
  recent.unshift(term);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}

function formatPrice(amount: number | null, currency: string): string {
  if (amount === null) return "";
  const value = amount / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value);
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Open/close
  const open = useCallback(() => {
    setIsOpen(true);
    setRecentSearches(getRecentSearches());
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=10`
        );
        const data = await res.json();
        setResults(data.products || []);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        navigateToProduct(results[selectedIndex]);
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const navigateToProduct = (product: SearchResult) => {
    saveRecentSearch(query);
    close();
    router.push(`/productos/${product.slug}`);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={open}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        aria-label="Buscar productos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-200 rounded">
          Ctrl K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#00a862] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar productos..."
                  className="flex-1 text-lg text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                />
                {isLoading && (
                  <div className="h-5 w-5 border-2 border-[#00a862] border-t-transparent rounded-full animate-spin" />
                )}
                <button
                  onClick={close}
                  className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono hover:bg-gray-200 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results area */}
              <div
                ref={resultsRef}
                className="max-h-[60vh] overflow-y-auto overscroll-contain"
              >
                {/* Recent searches (when no query) */}
                {!query.trim() && recentSearches.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Busquedas recientes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRecentClick(term)}
                          className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-[#00a862]/10 hover:text-[#00a862] transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {query.trim() && !isLoading && results.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">
                      No se encontraron productos para &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}

                {/* Results list */}
                {results.length > 0 && (
                  <motion.ul className="py-2" role="listbox">
                    {results.map((product, index) => (
                      <motion.li
                        key={product.id}
                        data-index={index}
                        role="option"
                        aria-selected={index === selectedIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => navigateToProduct(product)}
                        className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors ${
                          index === selectedIndex
                            ? "bg-[#00a862]/5 border-l-2 border-[#00a862]"
                            : "hover:bg-gray-50 border-l-2 border-transparent"
                        }`}
                      >
                        {/* Product image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-6 h-6 text-gray-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          {product.category && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {product.category}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        {product.price !== null && (
                          <span className="text-sm font-semibold text-[#00a862] shrink-0">
                            {formatPrice(product.price, product.currency)}
                          </span>
                        )}

                        {/* Arrow indicator for selected */}
                        {index === selectedIndex && (
                          <svg
                            className="w-4 h-4 text-[#00a862] shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px]">
                        &uarr;&darr;
                      </kbd>
                      navegar
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px]">
                        Enter
                      </kbd>
                      seleccionar
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px]">
                        Esc
                      </kbd>
                      cerrar
                    </span>
                  </div>
                  <span>{results.length} resultados</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
