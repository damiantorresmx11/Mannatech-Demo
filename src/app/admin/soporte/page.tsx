"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Inbox,
  UserX,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Types ─────────────────────────── */

interface Contact {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  thumbnail?: string;
}

interface Conversation {
  id: number;
  status: string;
  unread_count: number;
  messages: { id: number; content: string; created_at: number }[];
  meta: { sender: Contact };
  created_at: number;
  assignee?: { name: string } | null;
}

interface Message {
  id: number;
  content: string;
  message_type: number; // 0 = incoming, 1 = outgoing
  created_at: number;
  sender?: { name?: string; type?: string };
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function timeAgo(epoch: number): string {
  const diff = Math.floor(Date.now() / 1000) - epoch;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function truncate(str: string | undefined, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "..." : str;
}

/* ─────────────────────────── Animation variants ─────────────────────────── */

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, ease: "easeOut" as const },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
} as const;

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" as const } },
} as const;

/* ─────────────────────────── Tabs ─────────────────────────── */

type TabKey = "open" | "unassigned" | "resolved";

const TABS: { key: TabKey; label: string; icon: typeof Inbox }[] = [
  { key: "open", label: "Abiertas", icon: Inbox },
  { key: "unassigned", label: "Sin Asignar", icon: UserX },
  { key: "resolved", label: "Resueltas", icon: Archive },
];

/* ─────────────────────────── Main Component ─────────────────────────── */

export default function SoportePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("open");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [counts, setCounts] = useState({ open: 0, unassigned: 0, resolved: 0 });
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Fetch conversations ── */
  const fetchConversations = useCallback(async (tab: TabKey) => {
    try {
      setLoading(true);
      const status = tab === "unassigned" ? "open" : tab === "resolved" ? "resolved" : "open";
      const res = await fetch(`/api/tools/chat?status=${status}`);
      const data = await res.json();

      let list: Conversation[] = data.data?.payload ?? data.payload ?? [];

      if (tab === "unassigned") {
        list = list.filter((c) => !c.assignee);
      }

      setConversations(list);

      // Update counts
      const openRes = await fetch("/api/tools/chat?status=open");
      const openData = await openRes.json();
      const openList: Conversation[] = openData.data?.payload ?? openData.payload ?? [];

      const resolvedRes = await fetch("/api/tools/chat?status=resolved");
      const resolvedData = await resolvedRes.json();
      const resolvedList: Conversation[] = resolvedData.data?.payload ?? resolvedData.payload ?? [];

      setCounts({
        open: openList.length,
        unassigned: openList.filter((c) => !c.assignee).length,
        resolved: resolvedList.length,
      });
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Fetch messages for selected conversation ── */
  const fetchMessages = useCallback(async (convId: number) => {
    try {
      const res = await fetch(`/api/tools/chat?conversation_id=${convId}`);
      const data = await res.json();
      setMessages(data.payload ?? data ?? []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  }, []);

  /* ── Auto refresh ── */
  useEffect(() => {
    fetchConversations(activeTab);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      fetchConversations(activeTab);
      if (selectedId) fetchMessages(selectedId);
    }, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTab, fetchConversations, fetchMessages, selectedId]);

  /* ── Select conversation ── */
  const handleSelect = (conv: Conversation) => {
    setSelectedId(conv.id);
    fetchMessages(conv.id);
    setMobileShowChat(true);
  };

  /* ── Send message ── */
  const handleSend = async () => {
    if (!messageInput.trim() || !selectedId) return;
    setSending(true);
    try {
      await fetch("/api/tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          conversation_id: selectedId,
          content: messageInput.trim(),
        }),
      });
      setMessageInput("");
      await fetchMessages(selectedId);
    } catch (e) {
      console.error("Error sending message:", e);
    } finally {
      setSending(false);
    }
  };

  /* ── Resolve conversation ── */
  const handleResolve = async () => {
    if (!selectedId) return;
    try {
      await fetch("/api/tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_status", conversation_id: selectedId }),
      });
      setSelectedId(null);
      setMessages([]);
      setMobileShowChat(false);
      fetchConversations(activeTab);
    } catch (e) {
      console.error("Error resolving conversation:", e);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedId);

  /* ─────────────────────────── Render ─────────────────────────── */

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden">
      {/* Header with counts */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <h1 className="text-2xl font-bold text-zinc-50">Soporte / Chat</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {counts.open} abiertas
          </span>
          <span className="text-amber-400">{counts.unassigned} sin asignar</span>
          <span className="text-zinc-400">{counts.resolved} resueltas</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-900 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSelectedId(null);
              setMessages([]);
              setMobileShowChat(false);
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-zinc-700 text-zinc-50"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main panels */}
      <div className="flex flex-1 gap-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        {/* Left: conversation list */}
        <div
          className={cn(
            "flex w-full flex-col border-r border-zinc-800 md:w-80 lg:w-96",
            mobileShowChat && "hidden md:flex"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <span className="text-sm font-medium text-zinc-300">
              Conversaciones ({conversations.length})
            </span>
            <button
              onClick={() => fetchConversations(activeTab)}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>

          <motion.div
            className="flex-1 overflow-y-auto"
            variants={listVariants}
            initial="hidden"
            animate="show"
            key={activeTab}
          >
            <AnimatePresence mode="popLayout">
              {conversations.length === 0 && !loading && (
                <motion.div
                  {...fadeIn}
                  className="flex flex-col items-center justify-center py-12 text-zinc-500"
                >
                  <MessageCircle className="mb-2 h-8 w-8" />
                  <span className="text-sm">Sin conversaciones</span>
                </motion.div>
              )}
              {conversations.map((conv) => {
                const sender = conv.meta?.sender;
                const lastMsg = conv.messages?.[0]?.content;
                const lastTime = conv.messages?.[0]?.created_at ?? conv.created_at;

                return (
                  <motion.button
                    key={conv.id}
                    variants={itemVariants}
                    layout
                    onClick={() => handleSelect(conv)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-zinc-800/50 px-4 py-3 text-left transition-colors hover:bg-zinc-800/60",
                      selectedId === conv.id && "bg-zinc-800/80"
                    )}
                  >
                    {/* Avatar */}
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-medium text-zinc-200">
                      {(sender?.name?.[0] ?? "?").toUpperCase()}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium text-zinc-100">
                          {sender?.name ?? "Desconocido"}
                        </span>
                        <span className="ml-2 flex-shrink-0 text-xs text-zinc-500">
                          {timeAgo(lastTime)}
                        </span>
                      </div>
                      {sender?.email && (
                        <span className="text-xs text-zinc-500">{sender.email}</span>
                      )}
                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        {truncate(lastMsg, 60)}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {conv.unread_count > 0 && (
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        {conv.unread_count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right: messages */}
        <div
          className={cn(
            "flex flex-1 flex-col",
            !mobileShowChat && "hidden md:flex"
          )}
        >
          {!selectedId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-zinc-500">
              <MessageCircle className="mb-3 h-12 w-12 opacity-40" />
              <p className="text-sm">Selecciona una conversacion</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileShowChat(false);
                      setSelectedId(null);
                    }}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-800 md:hidden"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {selectedConv?.meta?.sender?.name ?? "Conversacion"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      #{selectedId}
                      {selectedConv?.meta?.sender?.email &&
                        ` - ${selectedConv.meta.sender.email}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResolve}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Resolver
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isOutgoing = msg.message_type === 1;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" as const }}
                        className={cn(
                          "flex",
                          isOutgoing ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                            isOutgoing
                              ? "rounded-br-md bg-blue-600 text-white"
                              : "rounded-bl-md bg-zinc-800 text-zinc-200"
                          )}
                        >
                          {msg.content && (
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          )}
                          <p
                            className={cn(
                              "mt-1 text-[10px]",
                              isOutgoing ? "text-blue-200" : "text-zinc-500"
                            )}
                          >
                            {timeAgo(msg.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !messageInput.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className={cn("h-4 w-4", sending && "animate-pulse")} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
