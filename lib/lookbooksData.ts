export type LookbookSection = {
  title: string;
  image: string;
  slug: string;
  chapter?: string;
  hotspots: { productId: string; x: number; y: number }[];
};

export type LookbookRecord = {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  sections: LookbookSection[];
};

const now = "2026-03-22T00:00:00.000Z";

export const fallbackLookbooks: LookbookRecord[] = [
  {
    _id: "lookbook-editorial-01",
    title: "Maison Aurelia Editorial",
    slug: "maison-aurelia-editorial",
    published: true,
    createdAt: now,
    updatedAt: now,
    sections: [
      {
        title: "Autumn Tailoring",
        image: "/uploads/Jackets & Coats.jpg",
        slug: "autumn-tailoring",
        chapter: "I",
        hotspots: [],
      },
      {
        title: "Summer Riviera",
        image: "/uploads/Suits.jpg",
        slug: "summer-riviera",
        chapter: "II",
        hotspots: [],
      },
      {
        title: "Modern Essentials",
        image: "/uploads/Sneakers.jpg",
        slug: "modern-essentials",
        chapter: "III",
        hotspots: [],
      },
    ],
  },
];

export function getFallbackLookbookById(id: string): LookbookRecord | null {
  return fallbackLookbooks.find((lookbook) => lookbook._id === id || lookbook.slug === id) ?? null;
}
