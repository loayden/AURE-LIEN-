"use client";

import ImageOverlayCard from "@/components/ui/ImageOverlayCard";
import SectionHeader from "@/components/ui/SectionHeader";
import type { CategoryCard } from "@/lib/types";

interface CollectionGridProps {
  title?: string;
  subtitle?: string;
  items: CategoryCard[];
  cols?: 3 | 4;
}

export default function CollectionGrid({
  title,
  subtitle,
  items,
  cols = 4,
}: CollectionGridProps) {
  return (
    <section className="luxury-container section-padding max-w-7xl">
      {title && <SectionHeader title={title} subtitle={subtitle} />}
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 ${cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} ${title ? "mt-8 sm:mt-12 md:mt-16" : ""}`}>
        {items.map((item, index) => (
          <ImageOverlayCard
            key={item.link}
            title={item.title}
            image={item.image}
            link={item.link}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
