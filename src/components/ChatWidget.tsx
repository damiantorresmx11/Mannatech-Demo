"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

const botMessages = [
  {
    text: "¡Hola! 👋 Soy tu asistente de Mannatech. ¿En qué puedo ayudarte?",
    delay: 0,
  },
  {
    text: "Puedo ayudarte con información sobre productos, precios, o cómo convertirte en distribuidor.",
    delay: 800,
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; from: "bot" | "user" }[]
  >([]);
  const [input, setInput] = useState("");
  const [showMessages, setShowMessages] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ text: botMessages[0].text, from: "bot" }]);
        setShowMessages(true);
      }, 300);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: botMessages[1].text, from: "bot" },
        ]);
      }, 1200);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, from: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Gracias por tu mensaje. Un asesor se pondrá en contacto contigo pronto. También puedes escribirnos por WhatsApp para una respuesta más rápida.",
          from: "bot",
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Float button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#00A88F] text-white shadow-lg shadow-[#00A88F]/30 flex items-center justify-center hover:bg-[#009980] transition-colors"
            aria-label="Abrir chat"
          >
            <MessageCircle size={24} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#00A88F] animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="bg-[#00A88F] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Mannatech</p>
                  <p className="text-[11px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                    En línea
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-[#00A88F] text-white rounded-br-md"
                          : "bg-white border border-border text-foreground rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-border rounded-full text-sm outline-none focus:border-[#00A88F] transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-[#00A88F] text-white flex items-center justify-center hover:bg-[#009980] transition-colors flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
