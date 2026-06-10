export type CompetitiveScore = {
  competitor: string;
  marketStrength: number;
  uiUx: number;
  catalog: number;
  trust: number;
  personalization: number;
  localFit: number;
  adminOpsVisibility: number;
  boutOpportunity: string;
};

export type QualityGate = {
  area: "UI/UX" | "Frontend" | "Backend" | "Database" | "Admin" | "Product" | "Security";
  target: "10/10";
  proof: string;
};

export type EditorialAsset = {
  title: string;
  alt: string;
  src: string;
  source: "pexels" | "local";
  credit: string;
};

export const competitiveScores: CompetitiveScore[] = [
  {
    competitor: "Amazon Egypt",
    marketStrength: 10,
    uiUx: 7,
    catalog: 10,
    trust: 9,
    personalization: 7,
    localFit: 9,
    adminOpsVisibility: 9,
    boutOpportunity: "Beat with premium curation, boutique story, and styling guidance.",
  },
  {
    competitor: "Noon",
    marketStrength: 9,
    uiUx: 7,
    catalog: 9,
    trust: 8,
    personalization: 6,
    localFit: 9,
    adminOpsVisibility: 8,
    boutOpportunity: "Beat with menswear specialization and higher visual taste.",
  },
  {
    competitor: "Shein",
    marketStrength: 9,
    uiUx: 8,
    catalog: 10,
    trust: 6,
    personalization: 8,
    localFit: 7,
    adminOpsVisibility: 8,
    boutOpportunity: "Beat with quality, trust, fit confidence, and boutique authenticity.",
  },
  {
    competitor: "Jumia Egypt",
    marketStrength: 8,
    uiUx: 6,
    catalog: 8,
    trust: 7,
    personalization: 5,
    localFit: 9,
    adminOpsVisibility: 7,
    boutOpportunity: "Beat with polished UX, stronger discovery, and product confidence.",
  },
  {
    competitor: "Zara",
    marketStrength: 8,
    uiUx: 9,
    catalog: 7,
    trust: 9,
    personalization: 5,
    localFit: 7,
    adminOpsVisibility: 8,
    boutOpportunity: "Beat with Egypt boutique partner access and richer assistance.",
  },
  {
    competitor: "H&M",
    marketStrength: 8,
    uiUx: 8,
    catalog: 8,
    trust: 8,
    personalization: 5,
    localFit: 7,
    adminOpsVisibility: 8,
    boutOpportunity: "Beat with premium menswear and local partner marketplace.",
  },
  {
    competitor: "Mango",
    marketStrength: 7,
    uiUx: 8,
    catalog: 7,
    trust: 8,
    personalization: 4,
    localFit: 7,
    adminOpsVisibility: 7,
    boutOpportunity: "Beat with better partner/product story and local fulfillment clarity.",
  },
  {
    competitor: "LC Waikiki",
    marketStrength: 8,
    uiUx: 7,
    catalog: 8,
    trust: 8,
    personalization: 4,
    localFit: 8,
    adminOpsVisibility: 7,
    boutOpportunity: "Beat with luxury positioning and stronger editorial content.",
  },
  {
    competitor: "Pull&Bear/Bershka",
    marketStrength: 7,
    uiUx: 8,
    catalog: 7,
    trust: 8,
    personalization: 5,
    localFit: 7,
    adminOpsVisibility: 7,
    boutOpportunity: "Beat with mature menswear, fit tools, and premium service.",
  },
  {
    competitor: "Ounass/Namshi",
    marketStrength: 8,
    uiUx: 9,
    catalog: 8,
    trust: 9,
    personalization: 6,
    localFit: 6,
    adminOpsVisibility: 8,
    boutOpportunity: "Beat with Egypt-local boutique onboarding and accessible premium.",
  },
];

export const qualityGates: QualityGate[] = [
  {
    area: "UI/UX",
    target: "10/10",
    proof: "Clear value, clean mobile hierarchy, specific copy, and premium visual polish.",
  },
  {
    area: "Frontend",
    target: "10/10",
    proof: "Editorial imagery, responsive proof cards, accessible links, and stable layouts.",
  },
  {
    area: "Backend",
    target: "10/10",
    proof: "Typed scorecard data with no runtime dependency on competitor sites.",
  },
  {
    area: "Database",
    target: "10/10",
    proof: "Structured quality data that can migrate from JSON into a database later.",
  },
  {
    area: "Admin",
    target: "10/10",
    proof: "Quality gaps and conversion signals are ready for an admin command center.",
  },
  {
    area: "Product",
    target: "10/10",
    proof: "BOUT differentiates through local boutique supply, styling help, and trust.",
  },
  {
    area: "Security",
    target: "10/10",
    proof: "No credentials exposed; third-party media source is documented and isolated.",
  },
];

export const editorialAssets: EditorialAsset[] = [
  {
    title: "Boutique floor",
    alt: "Premium clothing store interior with menswear racks and folded garments.",
    src: "https://images.pexels.com/photos/31318445/pexels-photo-31318445.jpeg?auto=compress&cs=tinysrgb&w=1200",
    source: "pexels",
    credit: "Pexels / Bertoli",
  },
  {
    title: "Finishing detail",
    alt: "Brown leather dress shoes styled with folded knitwear in a boutique.",
    src: "https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=1200",
    source: "pexels",
    credit: "Pexels / Solliefoto",
  },
];

export const scoreFields = [
  "marketStrength",
  "uiUx",
  "catalog",
  "trust",
  "personalization",
  "localFit",
  "adminOpsVisibility",
] satisfies readonly (keyof CompetitiveScore)[];
