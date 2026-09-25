import Link from "next/link";

type Boutique = {
  id: string;
  boutiqueName: string;
  city: string;
  area: string;
  categories: string[];
  liveProducts: number;
};

async function getBoutiques(): Promise<Boutique[]> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const host = h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    const res = await fetch(`${proto}://${host}/api/boutiques`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data.boutiques) ? data.boutiques : [];
  } catch {
    return [];
  }
}

export async function BoutiqueDirectory() {
  const boutiques = await getBoutiques();
  if (boutiques.length === 0) return null;
  return (
    <section aria-label="Our boutiques" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:px-10">
      <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
        Our Boutiques
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {boutiques.map((b) => (
          <Link
            key={b.id}
            href={`/boutiques/${b.id}`}
            className="rounded-2xl p-5 transition-shadow"
            style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}
          >
            <h3 className="font-light text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {b.boutiqueName}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em]" style={{ color: "rgba(61,48,37,0.65)" }}>
              {b.city}{b.area ? ` · ${b.area}` : ""} · {b.liveProducts} {b.liveProducts === 1 ? "piece" : "pieces"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
