import Link from "next/link";

type Boutique = {
  id: string;
  slug: string;
  boutiqueName: string;
  city: string;
  area: string;
  categories: string[];
  coverPhoto: string;
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
  const boutiques = (await getBoutiques()).sort((a, b) => b.liveProducts - a.liveProducts);
  if (boutiques.length === 0) return null;
  return (
    <section aria-label="بوتيكاتنا" className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 md:px-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-light" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(1.5rem,4vw,2.2rem)" }}>
          بوتيكاتنا
        </h2>
        <p className="text-[11px]" style={{ color: "rgba(61,48,37,0.6)" }}>
          {boutiques.length} {boutiques.length === 1 ? "محل موثّق" : "محلات موثّقة"}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {boutiques.map((b) => (
          <Link
            key={b.id}
            href={`/boutiques/${encodeURIComponent(b.slug || b.id)}`}
            className="overflow-hidden rounded-2xl transition-shadow hover:shadow-[0_18px_50px_rgba(23,21,19,0.12)]"
            style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}
          >
            {b.coverPhoto ? (
              <span className="relative block aspect-[16/9] w-full overflow-hidden bg-[#EAE1D3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.coverPhoto} alt={`واجهة ${b.boutiqueName}`} className="h-full w-full object-cover" loading="lazy" />
              </span>
            ) : null}
            <span className="block p-5">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] tracking-[0.18em]" style={{ background: "rgba(80,160,100,0.12)", color: "#3C7A4D" }}>
                ✓ محل موثّق
              </span>
              <span className="block font-light text-xl" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif" }}>
                {b.boutiqueName}
              </span>
              <span className="mt-1 block text-[11px] tracking-[0.16em]" style={{ color: "rgba(61,48,37,0.65)" }}>
                {b.city}{b.area ? ` · ${b.area}` : ""} · {b.liveProducts} {b.liveProducts === 1 ? "قطعة" : "قطعة"}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
