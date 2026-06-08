"use client";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { formatPrice } from "@/lib/commerce";
import type { BoutiqueApplication } from "@/lib/boutiqueApplications";
import { Building2, ExternalLink, Landmark, MapPin, Percent, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function getPayoutProfileCompleteness(profile?: BoutiqueApplication["payoutProfile"]): "missing" | "incomplete" | "complete" {
  if (!profile?.method) return "missing";
  if (!profile.accountHolderName) return "incomplete";
  if (profile.method === "bank_account") return profile.bankName && profile.iban ? "complete" : "incomplete";
  if (profile.method === "mobile_wallet") return profile.mobileWalletPhone ? "complete" : "incomplete";
  if (profile.method === "paymob_merchant") return profile.paymobMerchantId ? "complete" : "incomplete";
  return "incomplete";
}

function maskPayoutValue(value?: string): string {
  const compact = String(value ?? "").trim().replace(/\s+/g, "");
  if (!compact) return "Not provided";
  if (compact.length <= 4) return compact;
  return `${"*".repeat(Math.min(6, Math.max(3, compact.length - 4)))}${compact.slice(-4)}`;
}

export default function AdminBoutiquesPage() {
  const [applications, setApplications] = useState<BoutiqueApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const controller = new AbortController();

    async function loadApplications() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admin/boutiques", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.message || data?.error || "Failed to load boutique applications");
        setApplications(Array.isArray(data.applications) ? data.applications : []);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Failed to load boutique applications");
        setApplications([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadApplications();
    return () => controller.abort();
  }, []);

  const totals = useMemo(() => {
    const pending = applications.filter((application) => application.status === "pending").length;
    const estimatedMonthly = applications.reduce((sum, application) => sum + Number(application.monthlyFee || 0), 0);
    return { pending, estimatedMonthly };
  }, [applications]);

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      if (sort === "status") {
        const order = { draft: 0, pending: 1, contacted: 2, approved: 3, declined: 4 };
        return order[a.status] - order[b.status];
      }
      if (sort === "fee-high") return Number(b.monthlyFee ?? 0) - Number(a.monthlyFee ?? 0);
      if (sort === "city") return String(a.city ?? "").localeCompare(String(b.city ?? ""));
      if (sort === "name") return String(a.boutiqueName ?? "").localeCompare(String(b.boutiqueName ?? ""));
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [applications, sort]);

  function payoutCopy(application: BoutiqueApplication) {
    const profile = application.payoutProfile;
    if (!profile?.method) return "Not provided";
    if (profile.method === "bank_account") {
      return `${profile.bankName || "Bank"} · ${maskPayoutValue(profile.iban)}`;
    }
    if (profile.method === "mobile_wallet") {
      return `Mobile wallet · ${maskPayoutValue(profile.mobileWalletPhone)}`;
    }
    return `Paymob merchant · ${maskPayoutValue(profile.paymobMerchantId)}`;
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <AdminPageHeader
        title="Boutique Applications"
        description="Review partner boutiques that want to sell through BOUT, including location, starter access, commission, and monthly plan."
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Applications", value: applications.length },
          { label: "Pending", value: totals.pending },
          { label: "Monthly Pipeline", value: `EGP ${formatPrice(totals.estimatedMonthly)}` },
        ].map((item) => (
          <AdminPanel key={item.label} className="p-3 sm:p-5">
            <p className="eyebrow mb-2 sm:mb-4">{item.label}</p>
            <p className="title-display break-words text-[1.05rem] leading-none sm:text-[2.35rem]">{item.value}</p>
          </AdminPanel>
        ))}
      </div>

      {error ? (
        <AdminPanel className="p-4 text-sm text-red-700 sm:p-5">
          {error}
        </AdminPanel>
      ) : null}

      {!loading && applications.length > 0 ? (
        <div className="flex justify-end">
          <label className="sr-only" htmlFor="boutique-sort">
            Sort boutique applications
          </label>
          <select
            id="boutique-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="luxury-select w-full sm:max-w-xs"
          >
            <option value="newest">Newest first</option>
            <option value="status">Pending first</option>
            <option value="fee-high">Highest monthly fee</option>
            <option value="city">City A-Z</option>
            <option value="name">Boutique A-Z</option>
          </select>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <AdminEmptyState
          title="No Boutique Requests"
          description="When a boutique submits the partner form, the request will appear here."
          icon={Building2}
        />
      ) : (
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
          {sortedApplications.map((application) => (
            <AdminPanel key={application._id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="eyebrow mb-3">{application.status}</p>
                  <h2 className="title-display text-[1.65rem] leading-none sm:text-[2.1rem]">
                    {application.boutiqueName}
                  </h2>
                  <p className="body-copy mt-2 sm:mt-3">
                    {application.ownerName} · {application.phone}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#A87935] sm:py-2 sm:text-[10px] sm:tracking-[0.2em]">
                    {application.status === "draft"
                      ? "Draft"
                      : application.trialDays > 0
                        ? `${application.trialDays} day starter`
                        : "Paid plan"}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                <div className="liquid-row-link">
                  <MapPin className="h-4 w-4 text-[#A87935]" />
                  <span>
                    {application.area}, {application.city}
                  </span>
                </div>
                <div className="liquid-row-link">
                  <Percent className="h-4 w-4 text-[#A87935]" />
                  <span>{application.commissionRate}% commission</span>
                </div>
                <div className="liquid-row-link">
                  <Building2 className="h-4 w-4 text-[#A87935]" />
                  <span>EGP {formatPrice(application.monthlyFee)} / month</span>
                </div>
                <div className="liquid-row-link">
                  <Landmark className="h-4 w-4 text-[#A87935]" />
                  <span>{getPayoutProfileCompleteness(application.payoutProfile)} payout</span>
                </div>
                <a className="liquid-row-link" href={`tel:${application.phone}`}>
                  <Phone className="h-4 w-4 text-[#A87935]" />
                  <span>Call boutique</span>
                </a>
              </div>

              <div className="mt-4 rounded-[16px] border border-[rgba(123,103,82,0.14)] bg-white/44 p-3 sm:mt-5 sm:rounded-[22px] sm:p-4">
                <p className="eyebrow mb-3">Location</p>
                <p className="body-copy">
                  {application.noPhysicalShop ? "No physical shop yet" : application.streetAddress}
                </p>
                {application.googleMapsUrl ? (
                  <a
                    href={application.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#A87935] sm:mt-3"
                  >
                    Open map
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.3} />
                  </a>
                ) : null}
              </div>

              <div className="mt-4 rounded-[16px] border border-[rgba(123,103,82,0.14)] bg-white/44 p-3 sm:mt-5 sm:rounded-[22px] sm:p-4">
                <p className="eyebrow mb-3">Payout Profile</p>
                <p className="body-copy">
                  {payoutCopy(application)}
                </p>
                {application.payoutProfile?.accountHolderName ? (
                  <p className="mt-2 text-xs leading-6 text-[#6F6254]">
                    Holder: {application.payoutProfile.accountHolderName}
                  </p>
                ) : null}
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#8A6A32]">
                  No card numbers stored
                </p>
              </div>

              <div className="mt-4 grid gap-2 text-xs leading-6 text-[#6F6254] sm:mt-5 sm:gap-3 sm:text-sm sm:leading-7">
                <p>
                  <span className="text-[#3D3025]">Plan:</span> {application.planName}
                </p>
                <p>
                  <span className="text-[#3D3025]">Products:</span> {application.productCount || 0} expected · {application.categories.join(", ") || "No categories"}
                </p>
                {application.sampleProducts ? (
                  <p>
                    <span className="text-[#3D3025]">Samples:</span> {application.sampleProducts}
                  </p>
                ) : null}
                {application.notes ? (
                  <p>
                    <span className="text-[#3D3025]">Notes:</span> {application.notes}
                  </p>
                ) : null}
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}
