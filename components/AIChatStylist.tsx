"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import productsData from "@/lib/productsData";

interface Message {
  role: "user" | "assistant";
  content: string;
  productIds?: string[];
}

export default function AIChatStylist() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello. I'm your Maison Aurelia stylist. Ask me for outfit ideas, styling tips, or product recommendations—e.g. “I need a formal outfit” or “What shoes go with this suit?”",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "I couldn't help with that. Try asking for outfit ideas or product recommendations.";
      const ids: string[] = [];
      const idMatches = reply.matchAll(/id:([a-zA-Z0-9-_]+)/g);
      for (const m of idMatches) ids.push(m[1]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, productIds: ids.length ? ids : undefined }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [input, loading, messages, scrollToBottom]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-brass text-black flex items-center justify-center shadow-lg hover:shadow-brass-glow transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open stylist chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 2 13.574 2 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-50 w-[380px] max-w-[calc(100vw-4rem)] max-h-[70vh] flex flex-col rounded-2xl border border-brass/30 bg-black/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-brass/20 flex justify-between items-center">
              <span className="font-serif tracking-wide text-ivory">Stylist</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-silver hover:text-ivory"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      m.role === "user"
                        ? "bg-brass/20 text-ivory"
                        : "bg-charcoal text-ivory border border-brass/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    {m.productIds && m.productIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.productIds.slice(0, 4).map((id) => {
                          const p = productsData.find((x) => x._id === id);
                          if (!p) return null;
                          return (
                            <Link
                              key={p._id}
                              href={`/product/${p._id}`}
                              className="flex items-center gap-2 rounded-lg border border-brass/30 p-2 hover:bg-brass/10 transition-colors"
                            >
                              {p.images?.[0] && (
                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                  <Image src={p.images[0]} alt="" fill className="object-cover" />
                                </div>
                              )}
                              <span className="text-xs text-ivory truncate max-w-[100px]">{p.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-charcoal border border-brass/10">
                    <span className="text-silver text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-brass/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask for outfit ideas..."
                className="flex-1 bg-transparent border border-brass/40 text-ivory px-4 py-2 text-sm focus:outline-none focus:border-brass placeholder:text-silver"
              />
              <motion.button
                type="button"
                onClick={send}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border border-brass text-brass text-sm uppercase tracking-wider hover:bg-brass hover:text-black disabled:opacity-50"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
