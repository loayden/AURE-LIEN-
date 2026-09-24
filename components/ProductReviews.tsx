"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Review = { userName: string; rating: number; title: string; body: string; createdAt?: string };

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? []);
        setAverage(d.average ?? 0);
        setCount(d.count ?? 0);
      })
      .catch(() => undefined);
  }, [productId]);

  async function submit() {
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error ?? "Failed to save review");
        return;
      }
      setMessage("Thank you — your review was saved.");
      setTitle("");
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Reviews" className="mt-10">
      <h2 className="text-lg font-medium" style={{ color: "#3D3025" }}>
        Reviews {count > 0 && <span style={{ color: "var(--gold-text)" }}>· {average} / 5 ({count})</span>}
      </h2>
      {reviews.length === 0 ? (
        <p className="mt-2 text-sm" style={{ color: "rgba(61,48,37,0.72)" }}>No reviews yet — be the first.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.slice(0, 5).map((r, i) => (
            <li key={i} className="rounded-xl p-4" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}>
              <p className="text-sm font-medium">{r.userName} · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              {r.title && <p className="mt-1 text-sm font-medium">{r.title}</p>}
              {r.body && <p className="mt-1 text-sm" style={{ color: "rgba(61,48,37,0.8)" }}>{r.body}</p>}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 rounded-xl p-4" style={{ border: "1px solid rgba(123,103,82,0.18)" }}>
        <label className="text-sm font-medium" htmlFor={`rating-${productId}`}>Your rating</label>
        <select
          id={`rating-${productId}`}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-3 rounded-lg border px-3 py-1.5 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          aria-label="Review title"
          className="mt-3 w-full rounded-xl px-4 py-2 text-sm"
          style={{ border: "1px solid rgba(123,103,82,0.22)" }}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share fit, fabric, sizing…"
          aria-label="Review body"
          rows={3}
          className="mt-2 w-full rounded-xl px-4 py-2 text-sm"
          style={{ border: "1px solid rgba(123,103,82,0.22)" }}
        />
        <Button onClick={submit} disabled={submitting} className="mt-3">
          {submitting ? "Saving…" : "Submit review"}
        </Button>
        {message && <p className="mt-2 text-sm" role="status">{message}</p>}
      </div>
    </section>
  );
}
