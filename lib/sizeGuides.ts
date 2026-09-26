export type SizeRow = { size: string; chest?: string; waist?: string; length?: string; foot?: string; note: string };

const TOPS: SizeRow[] = [
  { size: "XS", chest: "86–91 cm", length: "66 cm", note: "Slim frame" },
  { size: "S", chest: "91–97 cm", length: "68 cm", note: "Close fit" },
  { size: "M", chest: "97–102 cm", length: "70 cm", note: "Regular frame" },
  { size: "L", chest: "102–109 cm", length: "72 cm", note: "Standard fit" },
  { size: "XL", chest: "109–117 cm", length: "74 cm", note: "Relaxed fit" },
  { size: "XXL", chest: "117–124 cm", length: "76 cm", note: "Broader frame" },
];

const OUTERWEAR: SizeRow[] = [
  { size: "S", chest: "97–102 cm", length: "68 cm", note: "Layer over a shirt" },
  { size: "M", chest: "102–108 cm", length: "70 cm", note: "Layer over knitwear" },
  { size: "L", chest: "108–114 cm", length: "72 cm", note: "Regular outerwear fit" },
  { size: "XL", chest: "114–121 cm", length: "74 cm", note: "Roomy, relaxed" },
  { size: "XXL", chest: "121–128 cm", length: "76 cm", note: "Oversized layering" },
];

const BOTTOMS: SizeRow[] = [
  { size: "30", waist: "76 cm", length: "102 cm", note: "Slim" },
  { size: "32", waist: "81 cm", length: "104 cm", note: "Regular" },
  { size: "34", waist: "86 cm", length: "106 cm", note: "Standard fit" },
  { size: "36", waist: "91 cm", length: "108 cm", note: "Relaxed" },
  { size: "38", waist: "97 cm", length: "110 cm", note: "Loose" },
];

const FOOTWEAR: SizeRow[] = [
  { size: "40", foot: "25.0 cm", note: "EU 40" },
  { size: "41", foot: "25.7 cm", note: "EU 41" },
  { size: "42", foot: "26.0 cm", note: "EU 42" },
  { size: "43", foot: "26.7 cm", note: "EU 43" },
  { size: "44", foot: "27.0 cm", note: "EU 44" },
  { size: "45", foot: "27.7 cm", note: "EU 45" },
  { size: "46", foot: "28.0 cm", note: "EU 46" },
];

const FALLBACK: SizeRow[] = [
  { size: "One Size", note: "Designed to fit most frames" },
  { size: "S / M", note: "Regular frame" },
  { size: "L / XL", note: "Broader frame" },
];

export function getSizeGuide(category?: string): { title: string; rows: SizeRow[]; columns: string[] } {
  const c = String(category ?? "").toLowerCase();
  if (/shoe|sneaker|boot|loafer|lace|footwear|sandal/.test(c)) {
    return { title: "Footwear — EU sizing", rows: FOOTWEAR, columns: ["Size", "Foot", "Fit"] };
  }
  if (/jean|denim|pant|trouser|short|chino/.test(c)) {
    return { title: "Bottoms — waist sizing", rows: BOTTOMS, columns: ["Size", "Waist", "Length", "Fit"] };
  }
  if (/jacket|coat|blazer|suit|outer|vest|hoodie|sweater|knit/.test(c)) {
    return { title: "Outerwear & Knits", rows: OUTERWEAR, columns: ["Size", "Chest", "Length", "Fit"] };
  }
  if (/shirt|tee|t-shirt|polo|top|korean/.test(c)) {
    return { title: "Tops & Shirts", rows: TOPS, columns: ["Size", "Chest", "Length", "Fit"] };
  }
  return { title: "General fit guide", rows: FALLBACK, columns: ["Size", "Fit"] };
}
