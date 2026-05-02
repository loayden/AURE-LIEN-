"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { showToast } from "@/components/ToastProvider";

export default function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      showToast({ tone: "error", title: "Newsletter", message: "Enter a valid email address." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to subscribe");
      setEmail("");
      showToast({ tone: "success", title: "Newsletter", message: "You are on the private access list." });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Newsletter",
        message: error instanceof Error ? error.message : "Unable to subscribe.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        className="glass-input min-h-[52px] flex-1"
        autoComplete="email"
      />
      <button type="submit" disabled={submitting} className="btn-gold min-h-[52px] justify-center disabled:opacity-50">
        {submitting ? "Joining" : "Join Private Access"}
        <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
      </button>
    </form>
  );
}
