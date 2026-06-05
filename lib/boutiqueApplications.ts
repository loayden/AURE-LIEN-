import { promises as fs } from "fs";
import { paths } from "@/lib/dataPaths";
import {
  appendRedisBoutiqueApplication,
  getRedisBoutiqueApplications,
  isRedisStorageAvailable,
  setRedisBoutiqueApplications,
} from "@/lib/redisStorage";
import {
  hasVercelBlobStorage,
  readBlobTextWithLegacyPublicFallback,
  writeBlobText,
} from "@/lib/blobStorage";

const BLOB_BOUTIQUE_APPLICATIONS_PATH = "boutiqueApplications.json";

export type BoutiqueApplicationStatus = "pending" | "contacted" | "approved" | "declined";

export type BoutiquePlanId = "starter" | "growth" | "signature";

export type BoutiquePayoutMethod = "bank_account" | "mobile_wallet" | "paymob_merchant";

export type BoutiquePayoutStatus = "missing" | "pending_review" | "verified";

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
  boutiqueName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  streetAddress: string;
  googleMapsUrl?: string;
  instagram?: string;
  categories: string[];
  productCount: number;
  averagePrice?: number;
  planId: BoutiquePlanId;
  planName: string;
  monthlyFee: number;
  commissionRate: number;
  trialDays: 7 | 14;
  payoutProfile?: BoutiquePayoutProfile;
  sampleProducts?: string;
  notes?: string;
  status: BoutiqueApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export const BOUTIQUE_PARTNER_PLANS = [
  {
    id: "starter",
    name: "Starter Boutique",
    monthlyFee: 1500,
    commissionRate: 10,
    trialDays: 7,
    copy: "For small shops testing their first online drop.",
  },
  {
    id: "growth",
    name: "Growth Boutique",
    monthlyFee: 2500,
    commissionRate: 7,
    trialDays: 14,
    copy: "For boutiques with regular stock and weekly uploads.",
  },
  {
    id: "signature",
    name: "Signature Boutique",
    monthlyFee: 4500,
    commissionRate: 5,
    trialDays: 14,
    copy: "For premium stores that need priority product placement.",
  },
] as const;

function useCloudStorage(): boolean {
  return hasVercelBlobStorage();
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
  return BOUTIQUE_PARTNER_PLANS.find((plan) => plan.id === requested) ?? BOUTIQUE_PARTNER_PLANS[1];
}

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
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
    updatedAt: value?.updatedAt ? new Date(value.updatedAt).toISOString() : undefined,
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

  if (!id || !boutiqueName || !ownerName || !phone || !city || !area || !streetAddress) {
    return null;
  }

  const plan = normalizePlan(application?.planId);
  const createdAt = application?.createdAt
    ? new Date(application.createdAt).toISOString()
    : new Date().toISOString();

  return {
    _id: id,
    partnerUserId: String(application?.partnerUserId ?? "").trim() || undefined,
    boutiqueName,
    ownerName,
    phone,
    email: String(application?.email ?? "").trim(),
    city,
    area,
    streetAddress,
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
    trialDays: Number(application?.trialDays) === 7 ? 7 : 14,
    payoutProfile: normalizePayoutProfile(application?.payoutProfile ?? application),
    sampleProducts: String(application?.sampleProducts ?? "").trim() || undefined,
    notes: String(application?.notes ?? "").trim() || undefined,
    status: (["pending", "contacted", "approved", "declined"].includes(String(application?.status))
      ? application.status
      : "pending") as BoutiqueApplicationStatus,
    createdAt,
    updatedAt: application?.updatedAt
      ? new Date(application.updatedAt).toISOString()
      : createdAt,
  };
}

function normalizeApplications(applications: unknown): BoutiqueApplication[] {
  if (!Array.isArray(applications)) return [];

  return applications
    .map(normalizeApplication)
    .filter((application): application is BoutiqueApplication => Boolean(application))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    const redisApplications = await getRedisBoutiqueApplications();
    if (redisApplications) {
      return mergeApplications(normalizeApplications(redisApplications), localApplications);
    }
  }

  return localApplications;
}

async function setBoutiqueApplications(applications: BoutiqueApplication[]): Promise<void> {
  const normalized = normalizeApplications(applications);

  if (useCloudStorage()) {
    await writeBlobApplications(normalized);
    return;
  }

  if (isRedisStorageAvailable()) {
    await setRedisBoutiqueApplications(normalized);
    return;
  }

  await writeLocalApplications(normalized);
}

export async function createBoutiqueApplication(
  payload: Omit<BoutiqueApplication, "_id" | "createdAt" | "updatedAt" | "status">
): Promise<BoutiqueApplication> {
  const now = new Date().toISOString();
  const application = normalizeApplication({
    ...payload,
    _id: `boutique-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  if (!application) {
    throw new Error("Invalid boutique application");
  }

  if (useCloudStorage()) {
    const existing = await getBoutiqueApplications();
    await setBoutiqueApplications([application, ...existing]);
    return application;
  }

  if (isRedisStorageAvailable()) {
    await appendRedisBoutiqueApplication(application);
    return application;
  }

  const existing = await readLocalApplications();
  await writeLocalApplications([application, ...existing]);
  return application;
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
