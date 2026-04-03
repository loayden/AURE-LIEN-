type ProductColorInput = {
  _id?: string;
  name?: string;
  description?: string;
  images?: string[];
  colors?: string[];
};

export const PRODUCT_COLOR_HEX_MAP: Record<string, string> = {
  black: "#0A0908",
  white: "#FAFAFA",
  cream: "#FFF8E7",
  ivory: "#FFFFF0",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  camel: "#C19A6B",
  brown: "#8B4513",
  mocha: "#6F4E37",
  chocolate: "#3E2723",
  navy: "#1A237E",
  midnight: "#263238",
  blue: "#2F6DB5",
  indigo: "#4B0082",
  sky: "#87CEEB",
  gray: "#808080",
  grey: "#808080",
  charcoal: "#36454F",
  stone: "#78909C",
  green: "#2E7D32",
  olive: "#556B2F",
  sage: "#9CAF88",
  sand: "#C2B280",
  khaki: "#BDB76B",
  violet: "#8F7CC3",
  purple: "#8F7CC3",
  gold: "#C9A86A",
  silver: "#9E9E9E",
  tortoise: "#5D4037",
};

const COLOR_ALIASES: Array<{ label: string; pattern: RegExp }> = [
  { label: "black", pattern: /\b(black|noir)\b/g },
  { label: "white", pattern: /\bwhite\b/g },
  { label: "cream", pattern: /\bcream\b/g },
  { label: "ivory", pattern: /\bivory\b/g },
  { label: "beige", pattern: /\b(beige|peig)\b/g },
  { label: "tan", pattern: /\btan\b/g },
  { label: "camel", pattern: /\bcamel\b/g },
  { label: "brown", pattern: /\bbrown\b/g },
  { label: "mocha", pattern: /\bmocha\b/g },
  { label: "navy", pattern: /\bnavy\b/g },
  { label: "blue", pattern: /\bblue\b/g },
  { label: "indigo", pattern: /\bindigo\b/g },
  { label: "gray", pattern: /\b(gray|grey)\b/g },
  { label: "charcoal", pattern: /\bcharcoal\b/g },
  { label: "green", pattern: /\b(green|gre)\b/g },
  { label: "olive", pattern: /\bolive\b/g },
  { label: "sage", pattern: /\bsage\b/g },
  { label: "sand", pattern: /\bsand\b/g },
  { label: "khaki", pattern: /\bkhaki\b/g },
  { label: "violet", pattern: /\b(violet|purple|purble)\b/g },
  { label: "gold", pattern: /\bgold\b/g },
  { label: "silver", pattern: /\bsilver\b/g },
  { label: "tortoise", pattern: /\btortoise\b/g },
];

const MANUAL_COLOR_OVERRIDES: Record<string, string[]> = {
  "p-jc-004": ["black"],
  "p-jc-005": ["navy"],
  "p-jc-007": ["navy", "camel"],
  "p-jc-018": ["cream"],
};

function basename(path: string): string {
  return path.split("/").pop() ?? path;
}

function sanitizeColors(values: string[] = []): string[] {
  const unique = new Set<string>();

  for (const value of values) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) continue;
    const canonical = normalized === "grey" ? "gray" : normalized;
    unique.add(canonical);
  }

  return Array.from(unique);
}

function inferColorsFromText(text: string): string[] {
  const matches: Array<{ label: string; index: number }> = [];

  for (const { label, pattern } of COLOR_ALIASES) {
    for (const match of text.matchAll(pattern)) {
      matches.push({ label, index: match.index ?? Number.MAX_SAFE_INTEGER });
    }
  }

  if (/\b(light|medium)\s+wash\b/.test(text) && /\b(denim|jeans)\b/.test(text)) {
    matches.push({ label: "blue", index: text.indexOf("wash") });
  }

  matches.sort((a, b) => a.index - b.index);

  return sanitizeColors(matches.map((match) => match.label));
}

export function getProductColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();
  return PRODUCT_COLOR_HEX_MAP[normalized] || "#000000";
}

export function resolveProductColors(product: ProductColorInput): string[] {
  if (product._id && MANUAL_COLOR_OVERRIDES[product._id]) {
    return MANUAL_COLOR_OVERRIDES[product._id];
  }

  const searchable = [
    product.name ?? "",
    product.description ?? "",
    ...(product.images ?? []).map((image) => basename(String(image))),
  ]
    .join(" ")
    .toLowerCase();

  const inferred = inferColorsFromText(searchable);
  if (inferred.length > 0) return inferred;

  return sanitizeColors(product.colors ?? []);
}
