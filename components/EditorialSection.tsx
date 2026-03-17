import Image from "next/image";

export default function EditorialSection() {
  return (
    <section className="section-padding luxury-container grid md:grid-cols-2 gap-20 items-center bg-[#111111] text-[#EFEFEF] tracking-wide">

      <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-lg border border-[#EFEFEF]/10">
        <Image
          src="https://images.unsplash.com/photo-1520975928316-7b3e5b7c1c06?q=80&w=1600"
          alt="Craftsmanship"
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div>
        <h2 className="text-4xl mb-8 font-light tracking-[0.15em]">
          Craftsmanship <span className="text-[#C6A962]">Beyond Time</span>
        </h2>

        <p className="text-[#EFEFEF]/70 leading-relaxed max-w-xl">
          Every silhouette is precision. Every stitch is intention.
          Designed for presence. Built for permanence.
        </p>
      </div>
    </section>
  );
}
