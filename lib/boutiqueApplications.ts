import { promises as fs } from "fs";
import { paths } from "@/lib/dataPaths";
import {
  getRedisBoutiqueApplications,
  isRedisStorageAvailable,
  setRedisBoutiqueApplications,
} from "@/lib/redisStorage";
import {
  hasVercelBlobJsonSnapshotStorage,
  readBlobTextWithLegacyPublicFallback,
  writeBlobText,
} from "@/lib/blobStorage";

const BLOB_BOUTIQUE_APPLICATIONS_PATH = "boutiqueApplications.json";

export type BoutiqueApplicationStatus = "draft" | "pending" | "contacted" | "approved" | "declined";

export type BoutiquePlanId = "starter" | "growth" | "signature";

export type BoutiquePayoutMethod = "bank_account" | "mobile_wallet" | "paymob_merchant";

export type BoutiquePayoutStatus = "missing" | "pending_review" | "verified";

export type BoutiqueSubscriptionFlow = "trial" | "paid";

export type BoutiqueSubscriptionStatus =
  | "trial_draft"
  | "trial_submitted"
  | "checkout_draft"
  | "checkout_started"
  | "subscribed";

export type BoutiquePayoutProfile = {
  method?: BoutiquePayoutMethod;
  accountHolderName?: string;
  bankName?: string;
  iban?: string;
  mobileWalletPhone?: string;
  paymobMerchantId?: string;
  taxId?: string;
  status: BoutiquePayoutStatus;
  updatedAt?: string;
};

export type BoutiqueApplication = {
  _id: string;
  partnerUserId?: string;
  draftOwnerId?: string;
  boutiqueName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  streetAddress: string;
  noPhysicalShop?: boolean;
  googleMapsUrl?: string;
  instagram?: string;
  categories: string[];
  productCount: number;
  averagePrice?: number;
  planId: BoutiquePlanId;
  planName: string;
  monthlyFee: number;
  commissionRate: number;
  trialDays: 0 | 7;
  subscriptionFlow: BoutiqueSubscriptionFlow;
  subscriptionStatus: BoutiqueSubscriptionStatus;
  subscriptionIntentionId?: string;
  paidUntil?: string;
  lastRenewalAt?: string;
  categoryCommissions?: Record<string, number>;
  shopPhotos?: string[];
  mapPin?: { lat: number; lng: number };
  storefrontSlug?: string;
  verification?: {
    status: "pending" | "verified" | "rejected";
    verifiedAt?: string;
    verifiedBy?: string;
    checklist?: { photosMatchMap: boolean; signageVisible: boolean; detailsConfirmed: boolean };
  };
  payoutProfile?: BoutiquePayoutProfile;
  sampleProducts?: string;
  notes?: string;
  status: BoutiqueApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type BoutiquePartnerAccessReason =
  | "subscribed"
  | "trial_active"
  | "trial_expired"
  | "checkout_pending"
  | "checkout_required"
  | "draft"
  | "declined";

export type BoutiquePartnerAccess = {
  canManageProducts: boolean;
  reason: BoutiquePartnerAccessReason;
  message: string;
  trialEndsAt?: string;
  daysRemaining: number;
  subscriptionUrl: string;
};

export const BOUTIQUE_PARTNER_PLANS = [
  {
    id: "starter",
    name: "Starter Boutique",
    monthlyFee: 1500,
    commissionRate: 10,
    trialDays: 7,
    copy: "Required starting plan. Free for 7 days, then EGP 1,500 monthly.",
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    trialDays: 0,
    copy: "Paid upgrade for boutiques with regular stock and weekly uploads.",
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    trialDays: 0,
    copy: "Paid upgrade for premium stores that need priority product placement.",
  },
] as const;

export function getBoutiquePartnerPlan(planId: unknown = "starter") {
  return normalizePlan(planId);
}

export const SUBSCRIPTION_PERIOD_DAYS = 30;
export const SUBSCRIPTION_GRACE_DAYS = 3;

export function getBoutiquePartnerAccess(
  application: Pick<
    BoutiqueApplication,
    "_id" | "status" | "createdAt" | "trialDays" | "subscriptionStatus" | "paidUntil"
  >,
  now = new Date()
): BoutiquePartnerAccess {
  const subscriptionUrl = `/partners/subscription?applicationId=${encodeURIComponent(application._id)}`;

  if (application.status === "draft") {
    return {
      canManageProducts: false,
      reason: "draft",
      message: "Finish the boutique application before uploading products.",
      daysRemaining: 0,
      subscriptionUrl,
    };
  }

  if (application.status === "declined") {
    return {
      canManageProducts: false,
      reason: "declined",
      message: "This boutique application was declined. Contact admin before uploading products.",
      daysRemaining: 0,
      subscriptionUrl,
    };
  }

  if (application.subscriptionStatus === "subscribed") {
    const paidUntilTime = application.paidUntil ? new Date(application.paidUntil).getTime() : NaN;
    if (Number.isFinite(paidUntilTime)) {
      const msOverdue = now.getTime() - paidUntilTime;
      const graceMs = SUBSCRIPTION_GRACE_DAYS * 24 * 60 * 60 * 1000;
      if (msOverdue > graceMs) {
        return {
          canManageProducts: false,
          reason: "checkout_required",
          message: "Your subscription has lapsed. Renew to continue managing products.",
          daysRemaining: 0,
          subscriptionUrl,
        };
      }
      if (msOverdue > 0) {
        const daysLeft = Math.max(0, Math.ceil((graceMs - msOverdue) / (24 * 60 * 60 * 1000)));
        return {
          canManageProducts: true,
          reason: "subscribed",
          message: `Subscription in ${SUBSCRIPTION_GRACE_DAYS}-day grace period. ${daysLeft} day${daysLeft === 1 ? "" : "s"} left to renew.`,
          daysRemaining: daysLeft,
          subscriptionUrl,
        };
      }
      const daysLeft = Math.max(0, Math.ceil((paidUntilTime - now.getTime()) / (24 * 60 * 60 * 1000)));
      return {
        canManageProducts: true,
        reason: "subscribed",
        message: `Subscription active. Renews in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
        daysRemaining: daysLeft,
        subscriptionUrl,
      };
    }
    return {
      canManageProducts: true,
      reason: "subscribed",
      message: "Subscription active.",
      daysRemaining: 0,
      subscriptionUrl,
    };
  }

  const createdAtTime = new Date(application.createdAt).getTime();
  const trialMs = Math.max(0, Number(application.trialDays || 0)) * 24 * 60 * 60 * 1000;
  const trialEndsAtTime = Number.isFinite(createdAtTime) ? createdAtTime + trialMs : 0;
  const trialEndsAt = trialEndsAtTime ? new Date(trialEndsAtTime).toISOString() : undefined;
  const msRemaining = trialEndsAtTime - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));

  if (trialMs > 0 && msRemaining > 0) {
    return {
      canManageProducts: true,
      reason: "trial_active",
      message: `Starter trial active. ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining.`,
      trialEndsAt,
      daysRemaining,
      subscriptionUrl,
    };
  }

  if (application.subscriptionStatus === "checkout_started") {
    return {
      canManageProducts: false,
      reason: "checkout_pending",
      message: "Subscription payment is pending confirmation. Complete Paymob checkout or contact admin if you already paid.",
      trialEndsAt,
      daysRemaining: 0,
      subscriptionUrl,
    };
  }

  return {
    canManageProducts: false,
    reason: trialMs > 0 ? "trial_expired" : "checkout_required",
    message: trialMs > 0
      ? "Your 7-day Starter trial has finished. Subscribe to continue uploading products."
      : "Subscribe before uploading products.",
    trialEndsAt,
    daysRemaining: 0,
    subscriptionUrl,
  };
}

function useCloudStorage(): boolean {
  return hasVercelBlobJsonSnapshotStorage();
}

function safeIsoDate(value: unknown, fallback = new Date().toISOString()): string {
  const date = value instanceof Date
    ? value
    : typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : null;
  if (date && Number.isFinite(date.getTime())) return date.toISOString();
  return fallback;
}

function safeDateTime(value: unknown): number {
  const date = value instanceof Date
    ? value
    : typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : null;
  return date && Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

function normalizePlan(planId: unknown) {
  const requested = String(planId ?? "").trim();
  return BOUTIQUE_PARTNER_PLANS.find((plan) => plan.id === requested) ?? BOUTIQUE_PARTNER_PLANS[0];
}

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeCategoryCommissions(value: unknown): Record<string, number> | undefined {  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const slug = String(key).trim().toLowerCase().replace(/\s+/g, "-");
    const rate = Number(raw);
    if (slug && Number.isFinite(rate)) out[slug] = Math.min(30, Math.max(0, rate));
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function normalizeShopPhotos(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v ?? "").trim())
    .filter((v) => {
      if (v.startsWith("/uploads/")) return true;
      if (!v.startsWith("https://")) return false;
      try {
        // Only our own storage hosts — never arbitrary hotlinks.
        return new URL(v).hostname.endsWith(".public.blob.vercel-storage.com");
      } catch {
        return false;
      }
    })
    .slice(0, 8);
}

function normalizeMapPin(value: unknown): { lat: number; lng: number } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const lat = Number((value as Record<string, unknown>).lat);
  const lng = Number((value as Record<string, unknown>).lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return undefined;
  return { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 };
}

function normalizeVerification(value: unknown): BoutiqueApplication["verification"] | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  const status = String(row.status ?? "");
  if (status !== "pending" && status !== "verified" && status !== "rejected") return undefined;
  const checklist = row.checklist as Record<string, unknown> | undefined;
  return {
    status,
    verifiedAt: row.verifiedAt ? safeIsoDate(row.verifiedAt) : undefined,
    verifiedBy: String(row.verifiedBy ?? "").slice(0, 200) || undefined,
    checklist: checklist
      ? {
          photosMatchMap: Boolean(checklist.photosMatchMap),
          signageVisible: Boolean(checklist.signageVisible),
          detailsConfirmed: Boolean(checklist.detailsConfirmed),
        }
      : undefined,
  };
}

export function slugifyBoutiqueName(name: string): string {
  return String(name ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeStatus(value: unknown): BoutiqueApplicationStatus {
  const status = cleanString(value);
  return (["draft", "pending", "contacted", "approved", "declined"].includes(status)
    ? status
    : "pending") as BoutiqueApplicationStatus;
}

function normalizeSubscriptionFlow(value: unknown, planId: BoutiquePlanId): BoutiqueSubscriptionFlow {
  const flow = cleanString(value);
  if (flow === "paid" || flow === "trial") return flow;
  return planId === "starter" ? "trial" : "paid";
}

function normalizeSubscriptionStatus(
  value: unknown,
  status: BoutiqueApplicationStatus,
  flow: BoutiqueSubscriptionFlow
): BoutiqueSubscriptionStatus {
  const subscriptionStatus = cleanString(value);
  if (["trial_draft", "trial_submitted", "checkout_draft", "checkout_started", "subscribed"].includes(subscriptionStatus)) {
    return subscriptionStatus as BoutiqueSubscriptionStatus;
  }
  if (status === "draft") return flow === "trial" ? "trial_draft" : "checkout_draft";
  return flow === "trial" ? "trial_submitted" : "checkout_started";
}

export function normalizePayoutMethod(value: unknown): BoutiquePayoutMethod | undefined {
  const method = cleanString(value);
  if (["bank_account", "mobile_wallet", "paymob_merchant"].includes(method)) {
    return method as BoutiquePayoutMethod;
  }
  return undefined;
}

export function normalizePayoutProfile(value: any): BoutiquePayoutProfile | undefined {
  const method = normalizePayoutMethod(value?.method ?? value?.payoutMethod);
  const accountHolderName = cleanString(value?.accountHolderName ?? value?.payoutAccountName);
  const bankName = cleanString(value?.bankName ?? value?.payoutBankName);
  const iban = cleanString(value?.iban ?? value?.payoutIban).replace(/\s+/g, " ").slice(0, 64);
  const mobileWalletPhone = cleanString(value?.mobileWalletPhone ?? value?.payoutWalletPhone);
  const paymobMerchantId = cleanString(value?.paymobMerchantId);
  const taxId = cleanString(value?.taxId);
  const status = cleanString(value?.status);
  const hasAnyPayoutValue = Boolean(
    method ||
      accountHolderName ||
      bankName ||
      iban ||
      mobileWalletPhone ||
      paymobMerchantId ||
      taxId
  );

  if (!hasAnyPayoutValue) return undefined;

  return {
    method,
    accountHolderName: accountHolderName || undefined,
    bankName: bankName || undefined,
    iban: iban || undefined,
    mobileWalletPhone: mobileWalletPhone || undefined,
    paymobMerchantId: paymobMerchantId || undefined,
    taxId: taxId || undefined,
    status: (["missing", "pending_review", "verified"].includes(status)
      ? status
      : method
        ? "pending_review"
        : "missing") as BoutiquePayoutStatus,
    updatedAt: value?.updatedAt ? safeIsoDate(value.updatedAt) : undefined,
  };
}

export function getPayoutProfileCompleteness(profile?: BoutiquePayoutProfile): "missing" | "incomplete" | "complete" {
  if (!profile?.method) return "missing";
  if (!profile.accountHolderName) return "incomplete";
  if (profile.method === "bank_account") {
    return profile.bankName && profile.iban ? "complete" : "incomplete";
  }
  if (profile.method === "mobile_wallet") {
    return profile.mobileWalletPhone ? "complete" : "incomplete";
  }
  if (profile.method === "paymob_merchant") {
    return profile.paymobMerchantId ? "complete" : "incomplete";
  }
  return "incomplete";
}

export function maskPayoutValue(value?: string, visible = 4): string {
  const text = cleanString(value);
  if (!text) return "Not provided";
  const compact = text.replace(/\s+/g, "");
  if (compact.length <= visible) return compact;
  return `${"*".repeat(Math.min(6, Math.max(3, compact.length - visible)))}${compact.slice(-visible)}`;
}

function normalizeApplication(application: any): BoutiqueApplication | null {
  const id = String(application?._id ?? application?.id ?? "").trim();
  const boutiqueName = String(application?.boutiqueName ?? "").trim();
  const ownerName = String(application?.ownerName ?? "").trim();
  const phone = String(application?.phone ?? "").trim();
  const city = String(application?.city ?? "").trim();
  const area = String(application?.area ?? "").trim();
  const streetAddress = String(application?.streetAddress ?? "").trim();
  const status = normalizeStatus(application?.status);
  const noPhysicalShop = Boolean(application?.noPhysicalShop);

  if (!id) {
    return null;
  }

  if (
    status !== "draft" &&
    (!boutiqueName || !ownerName || !phone || !city || !area || (!streetAddress && !noPhysicalShop))
  ) {
    return null;
  }

  const plan = normalizePlan(application?.planId);
  const subscriptionFlow = normalizeSubscriptionFlow(application?.subscriptionFlow, plan.id);
  const createdAt = safeIsoDate(application?.createdAt);

  return {
    _id: id,
    partnerUserId: String(application?.partnerUserId ?? "").trim() || undefined,
    draftOwnerId: String(application?.draftOwnerId ?? "").trim() || undefined,
    boutiqueName,
    ownerName,
    phone,
    email: String(application?.email ?? "").trim(),
    city,
    area,
    streetAddress,
    noPhysicalShop,
    googleMapsUrl: String(application?.googleMapsUrl ?? "").trim() || undefined,
    instagram: String(application?.instagram ?? "").trim() || undefined,
    categories: parseList(application?.categories),
    productCount: Math.max(0, Math.floor(Number(application?.productCount ?? 0))),
    averagePrice: Number.isFinite(Number(application?.averagePrice))
      ? Math.max(0, Math.floor(Number(application.averagePrice)))
      : undefined,
    planId: plan.id,
    planName: plan.name,
    monthlyFee: Number(application?.monthlyFee ?? plan.monthlyFee),
    commissionRate: Number(application?.commissionRate ?? plan.commissionRate),
    trialDays: plan.trialDays,
    subscriptionFlow,
    subscriptionStatus: normalizeSubscriptionStatus(application?.subscriptionStatus, status, subscriptionFlow),
    subscriptionIntentionId: String(application?.subscriptionIntentionId ?? "").trim() || undefined,
    paidUntil: String(application?.paidUntil ?? "").trim() || undefined,
    lastRenewalAt: String(application?.lastRenewalAt ?? "").trim() || undefined,
    categoryCommissions: normalizeCategoryCommissions(application?.categoryCommissions),
    shopPhotos: normalizeShopPhotos(application?.shopPhotos),
    mapPin: normalizeMapPin(application?.mapPin),
    storefrontSlug: String(application?.storefrontSlug ?? "").trim().slice(0, 80) || undefined,
    verification: normalizeVerification(application?.verification),
    payoutProfile: normalizePayoutProfile(application?.payoutProfile ?? application),
    sampleProducts: String(application?.sampleProducts ?? "").trim() || undefined,
    notes: String(application?.notes ?? "").trim() || undefined,
    status,
    createdAt,
    updatedAt: application?.updatedAt
      ? safeIsoDate(application.updatedAt, createdAt)
      : createdAt,
  };
}

function normalizeApplications(applications: unknown): BoutiqueApplication[] {
  if (!Array.isArray(applications)) return [];

  return applications
    .map(normalizeApplication)
    .filter((application): application is BoutiqueApplication => Boolean(application))
    .sort((a, b) => safeDateTime(b.createdAt) - safeDateTime(a.createdAt));
}

async function readLocalApplications(): Promise<BoutiqueApplication[]> {
  try {
    const data = await fs.readFile(paths.boutiqueApplications, "utf-8");
    return normalizeApplications(JSON.parse(data));
  } catch {
    return [];
  }
}

async function writeLocalApplications(applications: BoutiqueApplication[]): Promise<void> {
  await fs.writeFile(paths.boutiqueApplications, JSON.stringify(applications, null, 2));
}

async function readBlobApplications(): Promise<BoutiqueApplication[] | null> {
  const text = await readBlobTextWithLegacyPublicFallback(BLOB_BOUTIQUE_APPLICATIONS_PATH, {
    access: "private",
  });
  if (!text) return null;

  try {
    return normalizeApplications(JSON.parse(text));
  } catch {
    return [];
  }
}

async function writeBlobApplications(applications: BoutiqueApplication[]): Promise<void> {
  await writeBlobText(BLOB_BOUTIQUE_APPLICATIONS_PATH, JSON.stringify(applications, null, 2), {
    access: "private",
    contentType: "application/json",
  });
}

function mergeApplications(primary: BoutiqueApplication[], secondary: BoutiqueApplication[]): BoutiqueApplication[] {
  const byId = new Map<string, BoutiqueApplication>();

  for (const application of secondary) {
    byId.set(application._id, application);
  }

  for (const application of primary) {
    byId.set(application._id, application);
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBoutiqueApplications(): Promise<BoutiqueApplication[]> {
  const localApplications = await readLocalApplications();

  if (useCloudStorage()) {
    try {
      const blobApplications = await readBlobApplications();
      if (blobApplications) {
        return mergeApplications(blobApplications, localApplications);
      }
    } catch (error) {
      console.error(
        "Boutique Blob read failed, falling back to local applications:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (isRedisStorageAvailable()) {
    try {
      const redisApplications = await getRedisBoutiqueApplications();
      if (redisApplications) {
        return mergeApplications(normalizeApplications(redisApplications), localApplications);
      }
    } catch (error) {
      console.error(
        "Boutique Redis read failed, falling back to local applications:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return localApplications;
}

async function setBoutiqueApplications(applications: BoutiqueApplication[]): Promise<void> {
  const normalized = normalizeApplications(applications);

  if (useCloudStorage()) {
    try {
      await writeBlobApplications(normalized);
      return;
    } catch (error) {
      console.error(
        "Boutique Blob write failed, falling back to Redis/local applications:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (isRedisStorageAvailable()) {
    try {
      await setRedisBoutiqueApplications(normalized);
      return;
    } catch (error) {
      console.error(
        "Boutique Redis write failed, falling back to local applications:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  await writeLocalApplications(normalized);
}

export async function createBoutiqueApplication(
  payload: BoutiqueApplicationWritePayload
): Promise<BoutiqueApplication> {
  return submitBoutiqueApplication(payload);
}

type BoutiqueApplicationWritePayload = Partial<Omit<BoutiqueApplication, "createdAt" | "updatedAt">> & {
  _id?: string;
};

function getDraftMatchIndex(applications: BoutiqueApplication[], payload: BoutiqueApplicationWritePayload, planId: BoutiquePlanId) {
  const explicitId = cleanString(payload._id);
  if (explicitId) {
    const explicitIndex = applications.findIndex((application) => application._id === explicitId);
    if (explicitIndex !== -1) return explicitIndex;
  }

  const partnerUserId = cleanString(payload.partnerUserId);
  if (partnerUserId) {
    const partnerIndex = applications.findIndex(
      (application) => application.status === "draft" && application.partnerUserId === partnerUserId && application.planId === planId
    );
    if (partnerIndex !== -1) return partnerIndex;
  }

  const draftOwnerId = cleanString(payload.draftOwnerId);
  if (draftOwnerId) {
    const ownerIndex = applications.findIndex(
      (application) => application.status === "draft" && application.draftOwnerId === draftOwnerId && application.planId === planId
    );
    if (ownerIndex !== -1) return ownerIndex;
  }

  const email = cleanString(payload.email).toLowerCase();
  if (email) {
    const emailIndex = applications.findIndex(
      (application) => application.status === "draft" && application.email.toLowerCase() === email && application.planId === planId
    );
    if (emailIndex !== -1) return emailIndex;
  }

  return -1;
}

async function saveBoutiqueApplicationRecord(
  payload: BoutiqueApplicationWritePayload,
  status: BoutiqueApplicationStatus,
  subscriptionStatus?: BoutiqueSubscriptionStatus
): Promise<BoutiqueApplication> {
  const applications = await getBoutiqueApplications();
  const plan = normalizePlan(payload.planId);
  const index = status === "draft"
    ? getDraftMatchIndex(applications, payload, plan.id)
    : cleanString(payload._id)
      ? applications.findIndex((application) => application._id === cleanString(payload._id))
      : -1;
  const existing = index === -1 ? null : applications[index];
  const now = new Date().toISOString();
  const startsSubmittedLifecycle = Boolean(existing?.status === "draft" && status !== "draft");
  const next = normalizeApplication({
    ...existing,
    ...payload,
    _id: existing?._id || cleanString(payload._id) || `boutique-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    planId: plan.id,
    planName: plan.name,
    monthlyFee: payload.monthlyFee ?? existing?.monthlyFee ?? plan.monthlyFee,
    commissionRate: payload.commissionRate ?? existing?.commissionRate ?? plan.commissionRate,
    trialDays: plan.trialDays,
    subscriptionFlow: payload.subscriptionFlow ?? existing?.subscriptionFlow ?? (plan.id === "starter" ? "trial" : "paid"),
    subscriptionStatus: subscriptionStatus ?? payload.subscriptionStatus ?? existing?.subscriptionStatus,
    status,
    createdAt: startsSubmittedLifecycle ? now : existing?.createdAt || now,
    updatedAt: now,
  });

  if (!next) {
    throw new Error("Invalid boutique application");
  }

  const nextApplications = [...applications];
  if (index === -1) {
    nextApplications.unshift(next);
  } else {
    nextApplications[index] = next;
  }

  await setBoutiqueApplications(nextApplications);
  return next;
}

export async function upsertBoutiqueApplicationDraft(
  payload: BoutiqueApplicationWritePayload
): Promise<BoutiqueApplication> {
  return saveBoutiqueApplicationRecord(payload, "draft");
}

export async function submitBoutiqueApplication(
  payload: BoutiqueApplicationWritePayload
): Promise<BoutiqueApplication> {
  const plan = normalizePlan(payload.planId);
  return saveBoutiqueApplicationRecord(
    payload,
    "pending",
    plan.id === "starter" ? "trial_submitted" : "checkout_started"
  );
}

export async function markBoutiqueSubscriptionCheckoutStarted(
  applicationId: string,
  planId?: BoutiquePlanId,
  payload: BoutiqueApplicationWritePayload = {},
  intentionId?: string
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);
  if (!application) return null;
  const plan = normalizePlan(planId ?? application.planId);
  const noPhysicalShop = typeof payload.noPhysicalShop === "boolean"
    ? payload.noPhysicalShop
    : Boolean(application.noPhysicalShop);
  const planChanged = plan.id !== application.planId;

  return saveBoutiqueApplicationRecord(
    {
      ...application,
      ...payload,
      _id: application._id,
      planId: plan.id,
      planName: plan.name,
      monthlyFee: planChanged ? plan.monthlyFee : (payload.monthlyFee ?? (application as { monthlyFee?: number }).monthlyFee ?? plan.monthlyFee),
      commissionRate: planChanged ? plan.commissionRate : (payload.commissionRate ?? (application as { commissionRate?: number }).commissionRate ?? plan.commissionRate),
      trialDays: plan.trialDays,
      subscriptionFlow: "paid",
      subscriptionStatus: "checkout_started",
      subscriptionIntentionId: cleanString(intentionId) || application.subscriptionIntentionId,
      noPhysicalShop,
      streetAddress: noPhysicalShop ? "" : cleanString(payload.streetAddress ?? application.streetAddress),
    },
    application.status,
    "checkout_started"
  );
}

/**
 * Mark a boutique subscription paid (Paymob webhook).
 * Idempotent: only transitions from checkout_started; returns null otherwise.
 */
export async function markBoutiqueSubscriptionPaid(
  applicationId: string,
  intentionId?: string
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);
  if (!application) return null;
  if (application.subscriptionStatus === "subscribed") return application;
  if (application.subscriptionStatus !== "checkout_started") return null;
  const expected = cleanString(application.subscriptionIntentionId);
  const received = cleanString(intentionId);
  if (expected && received && expected !== received) return null;
  const now = new Date();
  const base = Math.max(now.getTime(), new Date(application.paidUntil ?? 0).getTime() || 0);
  const paidUntil = new Date(base + SUBSCRIPTION_PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString();
  return saveBoutiqueApplicationRecord(
    {
      ...application,
      subscriptionFlow: "paid",
      subscriptionStatus: "subscribed",
      subscriptionIntentionId: received || application.subscriptionIntentionId,
      paidUntil,
      lastRenewalAt: now.toISOString(),
    },
    application.status === "draft" ? "pending" : application.status,
    "subscribed"
  );
}

/**
 * Admin review of a boutique application.
 * Allowed: pending/contacted → approved/declined, approved → declined
 * (suspend), declined → pending (reopen). Drafts stay untouched.
 */
export async function reviewBoutiqueApplication(
  applicationId: string,
  review: { status: "approved" | "declined" | "pending"; reviewNote?: string }
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);
  if (!application) return null;
  const from = application.status;
  const to = review.status;
  const allowed =
    ((from === "pending" || from === "contacted") && (to === "approved" || to === "declined")) ||
    (from === "approved" && to === "declined") ||
    (from === "declined" && to === "pending");
  if (!allowed) return null;
  return saveBoutiqueApplicationRecord(
    {
      ...application,
      notes: review.reviewNote ? `${application.notes ? `${application.notes}\n` : ""}[Admin review] ${review.reviewNote}` : application.notes,
    },
    review.status,
    application.subscriptionStatus
  );
}

/**
 * Admin-adjustable commercial terms. Additive; plan pricing stays the source
 * of truth unless explicitly overridden here.
 */
export async function updateBoutiqueTerms(
  applicationId: string,
  terms: { commissionRate?: number; monthlyFee?: number; categoryCommissions?: Record<string, number> }
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);
  if (!application) return null;
  const patch: BoutiqueApplicationWritePayload = {};
  if (terms.commissionRate !== undefined && Number.isFinite(Number(terms.commissionRate))) {
    patch.commissionRate = Math.min(30, Math.max(0, Number(terms.commissionRate)));
  }
  if (terms.monthlyFee !== undefined && Number.isFinite(Number(terms.monthlyFee))) {
    patch.monthlyFee = Math.max(0, Math.floor(Number(terms.monthlyFee)));
  }
  if (terms.categoryCommissions !== undefined) {
    patch.categoryCommissions = normalizeCategoryCommissions(terms.categoryCommissions) ?? {};
  }
  if (Object.keys(patch).length === 0) return application;
  return saveBoutiqueApplicationRecord(
    { ...application, ...patch },
    application.status,
    application.subscriptionStatus
  );
}

/**
 * Partner edits their own application details while still in
 * draft/pending/contacted. Plan, pricing, and subscription state are untouched.
 */
export async function updateBoutiqueApplicationDetails(
  applicationId: string,
  patch: Partial<Pick<BoutiqueApplication, "boutiqueName" | "ownerName" | "phone" | "email" | "city" | "area" | "streetAddress" | "noPhysicalShop" | "googleMapsUrl" | "instagram" | "categories" | "productCount" | "averagePrice" | "sampleProducts" | "notes" | "shopPhotos" | "mapPin">>
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);
  if (!application) return null;
  if (application.status !== "draft" && application.status !== "pending" && application.status !== "contacted") {
    return null;
  }
  const cleanPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  ) as Partial<BoutiqueApplication>;
  return saveBoutiqueApplicationRecord(
    { ...application, ...cleanPatch },
    application.status,
    application.subscriptionStatus
  );
}

/**
 * Admin verification of the physical shop. Verified boutiques get a public
 * section; unverified ones stay invisible. Fully idempotent.
 */
export async function verifyBoutiqueShop(
  applicationId: string,
  review: {
    verified: boolean;
    checklist: { photosMatchMap: boolean; signageVisible: boolean; detailsConfirmed: boolean };
    verifiedBy?: string;
  }
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);
  if (!application) return null;
  if (review.verified) {
    if (!review.checklist.photosMatchMap || !review.checklist.signageVisible || !review.checklist.detailsConfirmed) {
      return null;
    }
  }
  const slug = review.verified
    ? application.storefrontSlug || (await ensureUniqueSlug(application.boutiqueName, application._id))
    : application.storefrontSlug;
  return saveBoutiqueApplicationRecord(
    {
      ...application,
      storefrontSlug: slug,
      verification: {
        status: review.verified ? "verified" : "rejected",
        verifiedAt: new Date().toISOString(),
        verifiedBy: cleanString(review.verifiedBy).slice(0, 200) || undefined,
        checklist: { ...review.checklist },
      },
    },
    application.status,
    application.subscriptionStatus
  );
}

async function ensureUniqueSlug(boutiqueName: string, applicationId: string): Promise<string> {
  const applications = await getBoutiqueApplications();
  const taken = new Set(
    applications.filter((a) => a._id !== applicationId).map((a) => String(a.storefrontSlug ?? ""))
  );
  const base = slugifyBoutiqueName(boutiqueName) || `boutique-${applicationId.slice(-6)}`;
  if (!taken.has(base)) return base;
  for (let i = 2; i < 100; i++) {
    if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  }
  return `${base}-${applicationId.slice(-6)}`;
}

export async function findBoutiqueApplicationDraft(options: {
  partnerUserId?: string;
  draftOwnerId?: string;
  email?: string;
  planId?: BoutiquePlanId;
}): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const planId = options.planId;
  const email = cleanString(options.email).toLowerCase();
  const draft = applications.find((application) => {
    if (application.status !== "draft") return false;
    if (planId && application.planId !== planId) return false;
    if (options.partnerUserId && application.partnerUserId === options.partnerUserId) return true;
    if (options.draftOwnerId && application.draftOwnerId === options.draftOwnerId) return true;
    if (email && application.email.toLowerCase() === email) return true;
    return false;
  });

  return draft ?? null;
}

export async function updateBoutiquePayoutProfile(
  applicationId: string,
  payoutProfile: BoutiquePayoutProfile
): Promise<BoutiqueApplication | null> {
  const applications = await getBoutiqueApplications();
  const index = applications.findIndex((application) => application._id === applicationId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const normalizedProfile = normalizePayoutProfile({
    ...payoutProfile,
    status: payoutProfile.status || "pending_review",
    updatedAt: now,
  });

  const nextApplication: BoutiqueApplication = {
    ...applications[index],
    payoutProfile: normalizedProfile,
    updatedAt: now,
  };

  const nextApplications = [...applications];
  nextApplications[index] = nextApplication;
  await setBoutiqueApplications(nextApplications);
  return nextApplication;
}
