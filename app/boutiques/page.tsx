import { BoutiqueDirectory } from "@/components/BoutiqueDirectory";
import { SubscribeCtaBar } from "@/components/SubscribeCtaBar";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بوتيكات موثّقة | BOUT",
  description:
    "تسوّق بوتيكات حقيقية موثّقة على BOUT — محلات بجد، منتجات مراجعة. عندك بوتيك؟ قدّم واتوثّق.",
};

export default async function BoutiquesPage() {
  const [applications, products] = await Promise.all([
    getBoutiqueApplications().catch(() => []),
    getPartnerProducts().catch(() => []),
  ]);
  const verified = applications.filter(
    (a) => a.status === "approved" && a.verification?.status === "verified"
  );
  const livePieces = products.filter((p) => p.status === "approved").length;
  const areas = [...new Set(verified.map((a) => String(a.area || a.city || "").trim()).filter(Boolean))].slice(0, 6);
  const piecesByBoutique = new Map<string, number>();
  for (const p of products) {
    if (p.status !== "approved") continue;
    piecesByBoutique.set(p.applicationId, (piecesByBoutique.get(p.applicationId) ?? 0) + 1);
  }
  const flagship = [...verified]
    .map((a) => ({ app: a, pieces: piecesByBoutique.get(a._id) ?? 0 }))
    .sort((x, y) => y.pieces - x.pieces)[0];

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#F5F1E8] text-[#3D3025]" style={{ fontFamily: "Tahoma, Arial, var(--font-jost), sans-serif" }}>
      {/* ── Hero ── */}
      <section id="boutiques-hero" className="px-4 pb-8 pt-20 sm:px-6 sm:pt-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[9px] tracking-[0.45em]" style={{ color: "var(--gold-text)" }}>
            بوتيكات موثّقة
          </p>
          <h1
            className="mt-2 max-w-3xl font-light leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(2.2rem,5.5vw,4rem)" }}
          >
            محلات حقيقية. <em style={{ color: "var(--gold-text)" }}>قطع موثّقة.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: "rgba(61,48,37,0.75)" }}>
            كل بوتيك هنا أثبت محله بصور حقيقية وموقع متثبت قبل ما يبيع قطعة واحدة.
            {verified.length > 0 ? (
              <> {verified.length} {verified.length === 1 ? "محل موثّق" : "محلات موثّقة"} · {livePieces} قطعة live{areas.length > 0 ? ` · ${areas.join(" · ")}` : ""}.</>
            ) : (
              <> كن أول محل موثّق على BOUT.</>
            )}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[10px] tracking-[0.25em] text-white"
              style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
            >
              تسوّق كل القطع
            </Link>
            <Link
              href="/boutiques/apply"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-[10px] tracking-[0.25em]"
              style={{ borderColor: "rgba(168,121,53,0.4)", color: "var(--gold-text)" }}
            >
              بيع معانا — 7 أيام مجانا
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3" role="list" aria-label="إحصائيات السوق">
            {[
              { value: String(verified.length), label: "محلات موثّقة" },
              { value: String(livePieces), label: "قطع live" },
              { value: "100%", label: "توثيق بالصور" },
            ].map((s) => (
              <div
                key={s.label}
                role="listitem"
                className="rounded-2xl p-3 text-center sm:p-4"
                style={{ border: "1px solid rgba(123,103,82,0.16)", background: "rgba(255,255,255,0.55)" }}
              >
                <p className="font-light" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(1.4rem,4vw,2rem)", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p className="mt-1 text-[9px] tracking-[0.2em]" style={{ color: "rgba(61,48,37,0.6)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Directory ── */}
      <BoutiqueDirectory />

      {/* ── Flagship boutique ── */}
      {flagship ? (
        <section aria-label="بوتيك مميز" className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 md:px-10">
          <Link
            href={`/boutiques/${encodeURIComponent(flagship.app.storefrontSlug || flagship.app._id)}`}
            className="group grid overflow-hidden rounded-[24px] lg:grid-cols-2"
            style={{ border: "1px solid rgba(123,103,82,0.18)", background: "#171513", color: "#FFF9EF" }}
          >
            <span className="relative block min-h-[16rem] overflow-hidden sm:min-h-[20rem]">
              {flagship.app.shopPhotos?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={flagship.app.shopPhotos[0]}
                  alt={`واجهة ${flagship.app.boutiqueName}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              ) : null}
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(23,21,19,0.55) 100%)" }} />
            </span>
            <span className="block p-6 sm:p-10">
              <span className="text-[9px] tracking-[0.45em]" style={{ color: "#D9BC77" }}>
                بوتيك مميز
              </span>
              <span className="mt-3 block font-light leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(2rem,5vw,3.4rem)" }}>
                {flagship.app.boutiqueName}
              </span>
              <span className="mt-2 block text-[11px] tracking-[0.22em]" style={{ color: "rgba(255,249,239,0.65)" }}>
                {flagship.app.area || flagship.app.city} · {flagship.pieces} {flagship.pieces === 1 ? "قطعة" : "قطعة"} · ✓ موثّق
              </span>
              <span className="mt-4 block text-sm leading-7" style={{ color: "rgba(255,249,239,0.75)" }}>
                بعناية {flagship.app.ownerName}. ادخل — كل قطعة عدّت على مراجعة BOUT.
              </span>
              <span
                className="mt-6 inline-flex min-h-[52px] items-center rounded-full px-8 text-[10px] tracking-[0.25em]"
                style={{ background: "#D9BC77", color: "#2A2118" }}
              >
                زور البوتيك ←
              </span>
            </span>
          </Link>
        </section>
      ) : null}

      {/* ── Subscription pitch ── */}
      <section id="partner-band" aria-label="اشترك كشريك" className="scroll-mt-24 px-4 pb-6 pt-8 sm:px-6 md:px-10">
        <div
          className="mx-auto max-w-7xl rounded-[24px] p-6 sm:p-10"
          style={{ background: "linear-gradient(135deg, #2A2118, #4C3A26)", color: "#FFF9EF" }}
        >
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[9px] tracking-[0.45em]" style={{ color: "#D9BC77" }}>
                لأصحاب البوتيكات
              </p>
              <h2
                className="mt-2 font-light leading-[1.15]"
                style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "clamp(1.7rem,4.5vw,2.8rem)" }}
              >
                محلك يستاهل أكتر من زباين الشارع.
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  ["شارة التوثيق", "العملاء بيثقوا في المحلات الموثّقة — شارتك بتظهر على كل منتج وصفحة."],
                  ["بدون تكلفة مقدمة", "7 أيام مجانا. لو مكسبتش حاجة، مش هتدفع حاجة."],
                  ["تحتفظ بـ 90%", "10% عمولة بس على اللي بيتباع فعلا. مفيش رسوم عرض."],
                  ["موافقة خلال ~24 ساعة", "مراجعة الصور غالبا في نفس اليوم. بيع من أول أسبوع."],
                ].map(([title, copy]) => (
                  <li key={title} className="flex gap-3">
                    <span aria-hidden className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: "rgba(217,188,119,0.2)", color: "#D9BC77" }}>
                      ✓
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{title}</span>
                      <span className="block text-sm" style={{ color: "rgba(255,249,239,0.65)" }}>{copy}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/boutiques/apply"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[10px] tracking-[0.25em]"
                  style={{ background: "#D9BC77", color: "#2A2118" }}
                >
                  ابدأ الفترة المجانية
                </Link>
                <Link
                  href="/partners/subscription"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-[10px] tracking-[0.25em]"
                  style={{ borderColor: "rgba(217,188,119,0.4)", color: "#FFF9EF" }}
                >
                  قارن الخطط
                </Link>
              </div>
            </div>
            <div
              className="rounded-[20px] p-6 text-center lg:sticky lg:top-24"
              style={{ background: "rgba(255,249,239,0.07)", border: "1px solid rgba(217,188,119,0.25)" }}
            >
              <p className="text-[9px] tracking-[0.3em]" style={{ color: "#D9BC77" }}>
                باقة البداية
              </p>
              <p className="mt-2 font-light" style={{ fontFamily: "'Cormorant Garamond', Tahoma, serif", fontSize: "2.2rem", lineHeight: 1 }}>
                7 أيام مجانا
              </p>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,249,239,0.7)" }}>
                بعدين 1500 جنيه/شهر · عمولة 10%
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,249,239,0.5)" }}>
                إلغاء في أي وقت · احتفظ بـ 90% من كل بيعة
              </p>
              <Link
                href="/boutiques/apply"
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 text-[10px] tracking-[0.25em]"
                style={{ background: "#D9BC77", color: "#2A2118" }}
              >
                احجز أسبوعك المجاني
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 grid gap-3 border-t pt-6 md:grid-cols-2" style={{ borderColor: "rgba(217,188,119,0.2)" }}>
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl p-4"
                style={{ background: "rgba(255,249,239,0.05)", border: "1px solid rgba(217,188,119,0.15)" }}
              >
                <summary className="cursor-pointer list-none text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="mr-2" style={{ color: "#D9BC77" }}>+</span>
                </summary>
                <p className="mt-2 text-sm leading-6" style={{ color: "rgba(255,249,239,0.7)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-10" />
      <SubscribeCtaBar />
    </main>
  );
}

const FAQS = [
  {
    q: "الموافقة بتاخد قد إيه؟",
    a: "الطلبات بتتراجع خلال 24 ساعة. توثيق الصور غالبا بيخلص في نفس يوم التقديم لو الصور واضحة.",
  },
  {
    q: "التوثيق محتاج إيه؟",
    a: "3 صور حقيقية للمحل (اليافطة + الداخل)، دبوس على الخريطة، وبيانات مطابقة للمحل.",
  },
  {
    q: "بعد الـ 7 أيام المجانية؟",
    a: "باقة البداية بتكمل بـ 1500 جنيه/شهر وعمولة 10%. لو مجددتش، إدارة المنتجات بتتوقف — وقسمك بيفضل ظاهر لكنه مش بيستقبل طلبات.",
  },
  {
    q: "أقدر ألغي في أي وقت؟",
    a: "أيوه. الإلغاء بيوقف الفوترة آخر فترة 30 يوم. ومنتجاتك بتتشال من المتجر عند الطلب.",
  },
];
