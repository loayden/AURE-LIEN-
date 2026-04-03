import Image from "next/image";

export default function EditorialSection() {
  return (
    <section className="section-padding luxury-container grid items-center gap-8 bg-[#14110F] tracking-wide text-[#FFF8EC] md:grid-cols-2 lg:gap-16">

      <div className="relative h-[320px] overflow-hidden rounded-3xl border border-[#FFF8EC]/10 shadow-lg sm:h-[440px] lg:h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1520975928316-7b3e5b7c1c06?q=80&w=1600"
          alt="Craftsmanship"
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div>
        <h2 className="mb-6 text-3xl font-light tracking-[0.12em] sm:mb-8 sm:text-4xl">
          Craftsmanship <span className="text-[#C9A86A]">Beyond Time</span>
        </h2>

        <p className="max-w-xl text-base leading-relaxed text-[#FFF8EC]/70 sm:text-lg">
          Every silhouette is precision. Every stitch is intention.
          Designed for presence. Built for permanence.
        </p>
      </div>
    </section>
  );
}
