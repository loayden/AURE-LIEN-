"use client";

import { showToast } from "@/components/ToastProvider";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function NewsletterForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: compact ? "footer" : "homepage" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to join right now.");
      setStatus("success");
      setMessage(data?.message || "You are on the list.");
      setEmail("");
      showToast("Newsletter signup saved.", "success");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Unable to join right now.";
      setStatus("error");
      setMessage(nextMessage);
      showToast(nextMessage, "error");
    }
  }

  if (status === "success" && compact) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[rgba(80,200,120,0.22)] bg-[rgba(80,200,120,0.08)] px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-[rgba(48,128,78,0.86)]" strokeWidth={1.4} />
        <span className="text-[9px] uppercase tracking-[0.28em] text-[#5B4E42]">{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-2" : "mx-auto max-w-2xl"}>
      <div
        className={`flex flex-col overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] sm:flex-row ${compact ? "" : "p-1.5"}`}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.68), rgba(255,249,239,0.48))",
          borderColor: "rgba(123,103,82,0.18)",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          required
          aria-label="Email address"
          className="min-h-[52px] flex-1 border-0 bg-transparent px-4 text-base text-[#3D3025] outline-none placeholder:text-[#5B4E42] focus:shadow-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-[52px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-[rgba(168,121,53,0.30)] bg-[rgba(168,121,53,0.08)] px-5 text-[10px] uppercase tracking-[0.28em] text-[#A87935] transition-colors hover:bg-[rgba(168,121,53,0.13)] disabled:opacity-50"
        >
          {status === "loading" ? "Joining" : "Join"}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.3} />
        </button>
      </div>
      {message && !compact ? (
        <p className={status === "error" ? "mt-3 text-center text-xs tracking-[0.08em] text-red-700/80" : "mt-3 text-center text-xs tracking-[0.08em] text-[#6F6254]"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
