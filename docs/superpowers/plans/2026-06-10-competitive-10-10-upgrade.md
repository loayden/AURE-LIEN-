# Competitive 10/10 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a measurable quality phase that rates BOUT and competitors, then improves BOUT across UI/UX, frontend, backend, database, admin, trust, and conversion until every release gate targets 10/10.

**Architecture:** Add a data-backed competitive scorecard and a homepage trust/differentiation surface using curated Pexels imagery. Keep product/marketing data in typed modules, render with focused React components, and avoid touching checkout/payment logic until separate approval. Use existing App Router, Tailwind utility style, `next/image`, and current public asset/versioning patterns.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS, Framer Motion, lucide-react, local JSON data APIs, existing admin/partner/user profile routes.

---

## Evidence And Market Context

**Sources used for this phase:**
- ResearchAndMarkets lists Egypt fashion/apparel e-commerce competitors including Jumia Egypt, Amazon/Souq, Ounass, Namshi, Zara Egypt, H&M Egypt, Mango Egypt, Shein Egypt, Adidas Egypt, Nike Egypt, LC Waikiki, Pull & Bear Egypt, and Bershka Egypt.
- ECDB identifies Amazon, Noon, and Shein as major Egyptian fashion e-commerce retailers by online revenue/positioning.
- IMARC reports Egypt menswear reached USD 2,286.7 million in 2025 and projects growth to USD 3,449.1 million by 2034, driven by urbanization, fashion awareness, youth demand, casualwear, premium, and sustainable apparel.
- Pexels License allows free commercial/noncommercial use, no attribution required, and modifications are allowed.
- Pexels candidate images:
  - `https://images.pexels.com/photos/31318445/pexels-photo-31318445.jpeg?cs=srgb&dl=pexels-bertoli-31318445.jpg&fm=jpg`
  - `https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?cs=srgb&dl=pexels-solliefoto-298864.jpg&fm=jpg`

## Competitor Rating Baseline

Scores are practical product benchmarks, not financial valuations. Rate 1-10 against the BOUT target experience.

| Competitor | Market Strength | UI/UX | Catalog | Trust | Personalization | Local Fit | Admin/Ops Visibility | BOUT Opportunity |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Amazon Egypt | 10 | 7 | 10 | 9 | 7 | 9 | 9 | Beat with premium curation, boutique story, styling guidance |
| Noon | 9 | 7 | 9 | 8 | 6 | 9 | 8 | Beat with menswear specialization and higher visual taste |
| Shein | 9 | 8 | 10 | 6 | 8 | 7 | 8 | Beat with quality, trust, fit confidence, boutique authenticity |
| Jumia Egypt | 8 | 6 | 8 | 7 | 5 | 9 | 7 | Beat with polished UX, stronger discovery, product confidence |
| Zara | 8 | 9 | 7 | 9 | 5 | 7 | 8 | Beat with Egypt boutique partner access and richer assistance |
| H&M | 8 | 8 | 8 | 8 | 5 | 7 | 8 | Beat with premium menswear and local partner marketplace |
| Mango | 7 | 8 | 7 | 8 | 4 | 7 | 7 | Beat with better partner/product story and local fulfillment clarity |
| LC Waikiki | 8 | 7 | 8 | 8 | 4 | 8 | 7 | Beat with luxury positioning and stronger editorial content |
| Pull & Bear/Bershka | 7 | 8 | 7 | 8 | 5 | 7 | 7 | Beat with mature menswear, fit tools, and premium service |
| Ounass/Namshi | 8 | 9 | 8 | 9 | 6 | 6 | 8 | Beat with Egypt-local boutique onboarding and accessible premium |

## BOUT Target Rating Gate

| Area | Current Risk | 10/10 Gate |
|---|---|---|
| UI/UX | Strong visual direction but fragmented feature messaging | First viewport explains why BOUT is better, no vague copy, excellent mobile hierarchy |
| Frontend | Good components, but competitive differentiation is not explicit enough | Pexels editorial assets, competitor-beating section, responsive proof cards, no overflow |
| Backend | APIs exist but quality scoring is not formalized | Typed quality/competitor data module with no runtime network dependency |
| Database/Data | JSON data powers products/orders/users | Structured scorecard data ready to migrate to DB later |
| Admin | Admin profile exists but no quality command center yet | Admin can see quality KPIs and gap categories in a later phase |
| Product/Growth | AI stylist exists, profiles split, partner flows exist | Add trust, personalization, fit confidence, marketplace differentiation |
| Security | Protected profile routes exist | No third-party API keys embedded; Pexels assets served by allowed remote host or downloaded with provenance |

## File Structure

- Create: `lib/competitiveScorecard.ts`
  - Owns competitor scores, BOUT target gates, feature recommendations, and Pexels editorial asset metadata.
- Create: `components/CompetitiveAdvantageSection.tsx`
  - Renders competitor-aware proof cards, Pexels editorial visuals, and BOUT differentiators for homepage.
- Modify: `components/HomePageClient.tsx`
  - Imports and places the new section after primary shopping/discovery content and before partner/newsletter conversion.
- Modify: `next.config.js`
  - Adds `images.pexels.com` as an allowed remote image host if using remote Pexels URLs.
- Create: `tests/competitiveScorecard.test.ts`
  - Validates score ranges, required competitors, image metadata, and target gates.
- Optional later: `app/admin/quality/page.tsx`
  - Admin-facing quality dashboard after the customer-facing section proves stable.

---

### Task 1: Competitive Scorecard Data

**Files:**
- Create: `lib/competitiveScorecard.ts`
- Create: `tests/competitiveScorecard.test.ts`

- [x] **Step 1: Add the typed scorecard module**

```ts
// lib/competitiveScorecard.ts
import { withPublicAssetVersion } from "@/lib/publicAsset";

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
  target: string;
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
  { competitor: "Amazon Egypt", marketStrength: 10, uiUx: 7, catalog: 10, trust: 9, personalization: 7, localFit: 9, adminOpsVisibility: 9, boutOpportunity: "Beat with premium curation, boutique story, and styling guidance." },
  { competitor: "Noon", marketStrength: 9, uiUx: 7, catalog: 9, trust: 8, personalization: 6, localFit: 9, adminOpsVisibility: 8, boutOpportunity: "Beat with menswear specialization and higher visual taste." },
  { competitor: "Shein", marketStrength: 9, uiUx: 8, catalog: 10, trust: 6, personalization: 8, localFit: 7, adminOpsVisibility: 8, boutOpportunity: "Beat with quality, trust, fit confidence, and boutique authenticity." },
  { competitor: "Jumia Egypt", marketStrength: 8, uiUx: 6, catalog: 8, trust: 7, personalization: 5, localFit: 9, adminOpsVisibility: 7, boutOpportunity: "Beat with polished UX, stronger discovery, and product confidence." },
  { competitor: "Zara", marketStrength: 8, uiUx: 9, catalog: 7, trust: 9, personalization: 5, localFit: 7, adminOpsVisibility: 8, boutOpportunity: "Beat with Egypt boutique partner access and richer assistance." },
  { competitor: "H&M", marketStrength: 8, uiUx: 8, catalog: 8, trust: 8, personalization: 5, localFit: 7, adminOpsVisibility: 8, boutOpportunity: "Beat with premium menswear and local partner marketplace." },
  { competitor: "Mango", marketStrength: 7, uiUx: 8, catalog: 7, trust: 8, personalization: 4, localFit: 7, adminOpsVisibility: 7, boutOpportunity: "Beat with better partner/product story and local fulfillment clarity." },
  { competitor: "LC Waikiki", marketStrength: 8, uiUx: 7, catalog: 8, trust: 8, personalization: 4, localFit: 8, adminOpsVisibility: 7, boutOpportunity: "Beat with luxury positioning and stronger editorial content." },
  { competitor: "Pull&Bear/Bershka", marketStrength: 7, uiUx: 8, catalog: 7, trust: 8, personalization: 5, localFit: 7, adminOpsVisibility: 7, boutOpportunity: "Beat with mature menswear, fit tools, and premium service." },
  { competitor: "Ounass/Namshi", marketStrength: 8, uiUx: 9, catalog: 8, trust: 9, personalization: 6, localFit: 6, adminOpsVisibility: 8, boutOpportunity: "Beat with Egypt-local boutique onboarding and accessible premium." },
];

export const qualityGates: QualityGate[] = [
  { area: "UI/UX", target: "10/10", proof: "Clear first-viewport value, mobile hierarchy, no vague copy, premium visual polish." },
  { area: "Frontend", target: "10/10", proof: "Pexels editorial imagery, responsive proof cards, accessible links, stable layouts." },
  { area: "Backend", target: "10/10", proof: "Typed scorecard data, no client-side secrets, no runtime dependency on competitor sites." },
  { area: "Database", target: "10/10", proof: "Structured data model ready for JSON now and database migration later." },
  { area: "Admin", target: "10/10", proof: "Admin route can later show quality gaps, conversion signals, and review queues." },
  { area: "Product", target: "10/10", proof: "Differentiates BOUT through local boutique supply, styling help, and trust." },
  { area: "Security", target: "10/10", proof: "No credentials exposed; third-party media source documented and isolated." },
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
  {
    title: "BOUT storefront",
    alt: "Illustrated boutique storefront logo used for BOUT email and brand material.",
    src: withPublicAssetVersion("/uploads/boutique-storefront-home.webp"),
    source: "local",
    credit: "BOUT brand asset",
  },
];
```

- [x] **Step 2: Add data tests**

```ts
// tests/competitiveScorecard.test.ts
import { competitiveScores, editorialAssets, qualityGates } from "@/lib/competitiveScorecard";

describe("competitive scorecard", () => {
  it("keeps all scores in a 1-10 range", () => {
    for (const score of competitiveScores) {
      expect(score.marketStrength).toBeGreaterThanOrEqual(1);
      expect(score.marketStrength).toBeLessThanOrEqual(10);
      expect(score.uiUx).toBeGreaterThanOrEqual(1);
      expect(score.uiUx).toBeLessThanOrEqual(10);
      expect(score.catalog).toBeGreaterThanOrEqual(1);
      expect(score.catalog).toBeLessThanOrEqual(10);
      expect(score.trust).toBeGreaterThanOrEqual(1);
      expect(score.trust).toBeLessThanOrEqual(10);
      expect(score.personalization).toBeGreaterThanOrEqual(1);
      expect(score.personalization).toBeLessThanOrEqual(10);
      expect(score.localFit).toBeGreaterThanOrEqual(1);
      expect(score.localFit).toBeLessThanOrEqual(10);
      expect(score.adminOpsVisibility).toBeGreaterThanOrEqual(1);
      expect(score.adminOpsVisibility).toBeLessThanOrEqual(10);
    }
  });

  it("includes the main Egypt fashion competitors", () => {
    const names = competitiveScores.map((score) => score.competitor);
    expect(names).toEqual(expect.arrayContaining(["Amazon Egypt", "Noon", "Shein", "Jumia Egypt", "Zara"]));
  });

  it("uses documented editorial assets", () => {
    expect(editorialAssets.length).toBeGreaterThanOrEqual(3);
    expect(editorialAssets.some((asset) => asset.source === "pexels")).toBe(true);
    expect(editorialAssets.every((asset) => asset.alt.length > 20)).toBe(true);
  });

  it("defines a 10/10 target gate for every critical area", () => {
    expect(qualityGates.map((gate) => gate.area)).toEqual(
      expect.arrayContaining(["UI/UX", "Frontend", "Backend", "Database", "Admin", "Product", "Security"])
    );
    expect(qualityGates.every((gate) => gate.target === "10/10")).toBe(true);
  });
});
```

- [x] **Step 3: Run the targeted test**

Run: `npx jest tests/competitiveScorecard.test.ts`

Expected: If Jest is not configured in this repo, this fails with a missing Jest command. In that case, convert this to an existing test runner or add a lightweight TypeScript assertion script in a separate approved test setup task.

### Task 2: Pexels Remote Image Support

**Files:**
- Modify: `next.config.js`

- [x] **Step 1: Add Pexels remote image host**

```js
{
  protocol: 'https',
  hostname: 'images.pexels.com',
},
```

Add this entry under `images.remotePatterns` after the existing `images.unsplash.com` entry.

- [x] **Step 2: Run build validation**

Run: `npm run build`

Expected: Build passes and remote image config is accepted.

### Task 3: Competitive Advantage Homepage Section

**Files:**
- Create: `components/CompetitiveAdvantageSection.tsx`
- Modify: `components/HomePageClient.tsx`

- [x] **Step 1: Create the component**

```tsx
"use client";

import { competitiveScores, editorialAssets, qualityGates } from "@/lib/competitiveScorecard";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const strongestCompetitors = competitiveScores.slice(0, 5);
const customerGates = qualityGates.filter((gate) => ["UI/UX", "Frontend", "Product", "Security"].includes(gate.area));

export default function CompetitiveAdvantageSection() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="page-wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:items-start">
          <div>
            <p className="eyebrow mb-4">Competitive Standard</p>
            <h2 className="title-display max-w-4xl text-[2.6rem] sm:text-[4.5rem]">
              Built to beat generic marketplaces, not copy them.
            </h2>
            <p className="body-copy mt-5 max-w-2xl">
              BOUT competes against scale players with sharper curation: boutique supply, premium menswear visuals, local checkout confidence, partner review, and style guidance that helps customers decide faster.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop Curated Menswear
                <ArrowRight className="h-4 w-4" strokeWidth={1.2} />
              </Link>
              <Link href="/outfit-generator" className="btn-secondary justify-center">
                Try Outfit Help
                <Sparkles className="h-4 w-4" strokeWidth={1.2} />
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {editorialAssets.map((asset, index) => (
              <motion.div
                key={asset.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="relative min-h-[13rem] overflow-hidden rounded-[24px] border border-[#7B6752]/12 bg-white/60 shadow-[0_18px_48px_rgba(61,48,37,0.08)]"
              >
                <Image src={asset.src} alt={asset.alt} fill sizes="(max-width: 1024px) 92vw, 38vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1815]/64 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#F8F1E5]">{asset.title}</p>
                  <p className="mt-1 text-[0.72rem] text-[#F8F1E5]/76">{asset.credit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {customerGates.map((gate) => (
            <div key={gate.area} className="rounded-[20px] border border-[#7B6752]/12 bg-white/64 p-5 shadow-[0_12px_32px_rgba(61,48,37,0.05)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">{gate.area}</p>
                <CheckCircle2 className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <p className="font-serif text-[1.65rem] font-light text-[#3D3025]">{gate.target}</p>
              <p className="mt-3 text-[0.76rem] leading-6 text-[#6F6254]">{gate.proof}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
            <div>
              <p className="eyebrow mb-1">Competitor Read</p>
              <p className="body-copy body-copy-strong">Where BOUT wins: premium focus, local boutiques, styling confidence, and trust.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {strongestCompetitors.map((score) => (
              <div key={score.competitor} className="rounded-[16px] border border-[#7B6752]/12 bg-white/62 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A581F]">{score.competitor}</p>
                  <ShieldCheck className="h-4 w-4 text-[#A87935]" strokeWidth={1.25} />
                </div>
                <p className="text-[0.74rem] leading-5 text-[#6F6254]">{score.boutOpportunity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [x] **Step 2: Import and place the section in the homepage**

In `components/HomePageClient.tsx`, add:

```tsx
import CompetitiveAdvantageSection from "@/components/CompetitiveAdvantageSection";
```

Place `<CompetitiveAdvantageSection />` after the main discovery/shop-the-look sections and before newsletter or partner conversion sections.

- [x] **Step 3: Run lint and browser verification**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass. Then open `http://localhost:3000` and verify desktop/mobile no text overlap, all Pexels images render, and CTA links work.

### Task 4: Product Features To Beat Competitors

**Files:**
- Modify: `components/commerce/ProductBrowser.tsx`
- Modify: `components/ProductCard.tsx`
- Modify: `lib/searchProducts.ts`
- Test: existing relevant product/search tests or new focused tests after runner is confirmed

- [x] **Step 1: Add customer-facing feature shortlist**

Implement these in priority order:

1. Fit confidence panel: size, color, stock, return reassurance visible before add-to-cart.
2. Outfit intent filters: "Work", "Weekend", "Night", "Travel", "Gift".
3. Trust badges: "Admin-reviewed", "Boutique partner", "Secure checkout", "Egypt delivery".
4. Product comparison drawer for 2-3 products.
5. Recently viewed products persisted in local storage.

- [x] **Step 2: Backend/data validation**

Before writing UI, verify product records expose enough data for:

```ts
type ProductConfidence = {
  stockState: "in" | "low" | "out";
  hasImages: boolean;
  hasSizes: boolean;
  hasColors: boolean;
  hasMaterial: boolean;
};
```

If not, add a non-breaking helper in `lib/commerce.ts` rather than changing product schema immediately.

### Task 5: Admin Quality Dashboard Later Phase

**Files:**
- Create: `app/admin/quality/page.tsx`
- Reuse: `lib/competitiveScorecard.ts`

- [x] **Step 1: Add admin quality view**

Create an admin-only route that shows:
- UI/UX target gates
- backend/database/admin/security target gates
- competitor matrix
- current missing feature checklist
- last verification commands

- [x] **Step 2: Protect and verify**

The route is automatically under `/admin`, so middleware protects it. Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
curl -I http://localhost:3000/admin/quality
```

Expected unauthenticated result: `307` redirect to `/login?redirect=%2Fadmin%2Fquality`.

---

## Risks And Tradeoffs

- Pexels remote images require `images.pexels.com` in `next.config.js`; remote availability can affect perceived quality. If this becomes production-critical, download selected images into `public/uploads/` with source notes.
- Competitor ratings should be treated as a product benchmark and updated monthly, not a legal/financial claim.
- Adding too many features at once can hurt performance. Prioritize decision confidence features before heavy personalization.
- Payment, auth, database migration, and admin destructive tools require explicit approval before implementation.

## Validation Checklist

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Desktop screenshot of homepage
- Mobile screenshot of homepage
- Confirm Pexels images render
- Confirm no layout overflow
- Confirm CTAs route to `/shop`, `/outfit-generator`, `/partners/profile`, `/admin/profile` where applicable
- Confirm protected admin routes still redirect unauthenticated users

## Execution Recommendation

Start with Tasks 1-3. They create visible market differentiation without touching checkout, payments, auth, or database writes. Then run a review pass before Tasks 4-5 because those affect product discovery and admin surfaces more deeply.

---

## Completion Log

Completed phases:
- Competitive scorecard data, tests, and homepage competitive advantage section.
- Pexels remote image support in Next image configuration.
- Product confidence, intent filtering, trust badges, comparison drawer, and recently viewed discovery features.
- Admin quality dashboard under `/admin/quality`.
- Account next-best-actions and customer quality score.
- Wishlist stylist score, intent filters, shortlist guidance, and compact wishlist cards.
- Homepage shop-the-look mobile comfort fixes, width fix, and mobile dot-strip removal.
- Public Lookbook removal from customer navigation, sitemap, homepage, and collection CTAs; `/lookbook` now redirects to `/shop`.
- Collection route gateway with Work, Weekend, Night, Travel, and Gift routes.
- Orders list and order detail pages updated for lighter mobile-readable trust UI.

Backend safety kept:
- No auth/session/cookie changes.
- No database schema changes.
- No checkout/payment changes.
- No destructive admin operations.
- Existing lookbook admin/API code left in place to avoid backend data-management risk.

Final validation target:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- TypeScript node tests for scorecard, product confidence, wishlist insights, products JSON, and checkout cancellation.
- Protected-route redirect checks for `/account`, `/orders`, `/orders/[id]`, `/wishlist`, and `/admin/quality`.
- Mobile overflow checks for `/`, `/shop`, `/collection`, and unauthenticated protected redirects.
