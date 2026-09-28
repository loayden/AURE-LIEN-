"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function BackInStockButton({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function subscribe() {
    setError("");
    const res = await fetch("/api/back-in-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    setDone(true);
  }

  if (done) return <p className="text-sm" role="status" style={{ color: "var(--gold-text)" }}>You’re on the list — we’ll email you.</p>;

  return (
    <div className="mt-3 flex flex-col sm:flex-row gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email for restock alert"
        aria-label="Email for restock alert"
      />
      <Button onClick={subscribe} variant="secondary">Notify me</Button>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}
