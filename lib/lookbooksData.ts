import { withPublicAssetVersion } from "./publicAsset";

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
        title: "Tailored Arrival",
        image: withPublicAssetVersion("/uploads/lookbook-tailoring-pexels.jpg"),
        slug: "tailored-arrival",
        chapter: "I",
        hotspots: [],
      },
      {
        title: "Boutique Fitting",
        image: withPublicAssetVersion("/uploads/lookbook-boutique-pexels.jpg"),
        slug: "boutique-fitting",
        chapter: "II",
        hotspots: [],
      },
      {
        title: "Check Coat Edit",
        image: withPublicAssetVersion("/uploads/lookbook-checkered-coat-pexels.jpg"),
        slug: "check-coat-edit",
        chapter: "III",
        hotspots: [],
      },
    ],
  },
];

export function getFallbackLookbookById(id: string): LookbookRecord | null {
  return fallbackLookbooks.find((lookbook) => lookbook._id === id || lookbook.slug === id) ?? null;
}
