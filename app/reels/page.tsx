import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reels — BOUT",
  description: "Shoppable video edits with linked products.",
};

type Reel = {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  products: Array<{ _id: string; name: string; price: number; image: string }>;
};

async function getReels(): Promise<Reel[]> {
  try {
    const h = await headers();
    const host = h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    const res = await fetch(`${proto}://${host}/api/reels`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data.reels) ? data.reels : [];
  } catch {
    return [];
  }
}

export default async function ReelsPage() {
  const reels = await getReels();
  return (
    <main className="min-h-screen bg-[#F5F1E8] px-4 py-16 text-[#3D3025] sm:px-6" style={{ fontFamily: "'Jost', sans-serif" }}>
      <div className="mx-auto max-w-5xl">
        <p className="text-[9px] uppercase tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>Video</p>
        <h1 className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,5vw,3.5rem)" }}>
          Shoppable Reels
        </h1>
        {reels.length === 0 ? (
          <p className="mt-6 text-sm" style={{ color: "rgba(61,48,37,0.7)" }}>
            No reels published yet — new edits appear here with linked products.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {reels.map((reel) => (
              <article key={reel.id} className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(123,103,82,0.18)", background: "rgba(255,255,255,0.6)" }}>
                <video src={reel.videoUrl} poster={reel.posterUrl || undefined} controls playsInline preload="metadata" className="aspect-[9/16] max-h-[560px] w-full bg-black object-contain" />
                <div className="p-4">
                  {reel.title && <h2 className="text-base font-medium">{reel.title}</h2>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reel.products.map((p) => (
                      <Link key={p._id} href={`/product/${p._id}`} className="flex items-center gap-2 rounded-xl p-2" style={{ border: "1px solid rgba(168,121,53,0.25)" }}>
                        {p.image && (
                          <span className="relative block h-10 w-10 overflow-hidden rounded">
                            <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                          </span>
                        )}
                        <span className="text-xs">{p.name} · EGP {p.price}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
