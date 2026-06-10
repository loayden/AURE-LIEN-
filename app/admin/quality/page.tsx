import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { competitiveScores, qualityGates } from "@/lib/competitiveScorecard";
import { AlertTriangle, BarChart3, CheckCircle2, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";

const verificationCommands = [
  "npx ts-node -P tsconfig.scripts.json -r tsconfig-paths/register tests/competitiveScorecard.test.ts",
  "npx ts-node -P tsconfig.scripts.json -r tsconfig-paths/register tests/productConfidence.test.ts",
  "npm run lint",
  "npx tsc --noEmit",
  "npm run build",
] as const;

const featureChecklist = [
  { label: "Competitor-aware homepage section", status: "Live" },
  { label: "Pexels editorial imagery support", status: "Live" },
  { label: "Outfit intent catalog filters", status: "Live" },
  { label: "Product trust badges", status: "Live" },
  { label: "Fit confidence product cards", status: "Live" },
  { label: "Admin quality command center", status: "Live" },
  { label: "Product comparison drawer", status: "Next" },
  { label: "Recently viewed products", status: "Next" },
] as const;

function averageScore(score: (typeof competitiveScores)[number]) {
  const values = [
    score.marketStrength,
    score.uiUx,
    score.catalog,
    score.trust,
    score.personalization,
    score.localFit,
    score.adminOpsVisibility,
  ];
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function AdminQualityPage() {
  const topCompetitors = [...competitiveScores]
    .sort((a, b) => averageScore(b) - averageScore(a))
    .slice(0, 6);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Quality Control"
        title="10/10 Quality"
        description="A command center for market benchmarks, release gates, product gaps, and verification discipline. This page is read-only and does not modify backend data."
      />

      <div className="mb-6 grid gap-4 sm:mb-8 md:mb-10 lg:grid-cols-4">
        {[
          { label: "Target Gates", value: qualityGates.length, icon: CheckCircle2 },
          { label: "Competitors Rated", value: competitiveScores.length, icon: BarChart3 },
          { label: "Live Upgrades", value: featureChecklist.filter((item) => item.status === "Live").length, icon: Sparkles },
          { label: "Next Features", value: featureChecklist.filter((item) => item.status === "Next").length, icon: AlertTriangle },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="admin-stat-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="eyebrow">{item.label}</p>
                <Icon className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <p className="font-light text-[#A87935]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.15rem" }}>
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 grid gap-4 sm:mb-8 md:mb-10 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminPanel className="p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
            <div>
              <p className="eyebrow mb-1">Release Gates</p>
              <h2 className="title-display text-[2rem]">Every Area <em className="gold-italic">10/10</em></h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {qualityGates.map((gate) => (
              <div key={gate.area} className="rounded-[18px] border border-[rgba(255,248,236,0.10)] bg-white/[0.04] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="eyebrow text-[#A87935]">{gate.area}</p>
                  <span className="rounded-full border border-[#A87935]/25 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#A87935]">
                    {gate.target}
                  </span>
                </div>
                <p className="body-copy">{gate.proof}</p>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel className="p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
            <div>
              <p className="eyebrow mb-1">Feature Status</p>
              <h2 className="title-display text-[2rem]">Market Gap <em className="gold-italic">Tracker</em></h2>
            </div>
          </div>
          <div className="space-y-3">
            {featureChecklist.map((item) => (
              <div key={item.label} className="liquid-row-link">
                <span className="body-copy body-copy-strong">{item.label}</span>
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                    item.status === "Live"
                      ? "border-[#A87935]/25 text-[#A87935]"
                      : "border-[#FFF8EC]/15 text-[#FFF8EC]/62"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="mb-6 sm:mb-8 md:mb-10">
        <AdminPanel className="p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
            <div>
              <p className="eyebrow mb-1">Competitor Matrix</p>
              <h2 className="title-display text-[2rem]">Beat Scale With <em className="gold-italic">Curation</em></h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[58rem] w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.18em] text-[#FFF8EC]/48">
                  <th className="px-3 py-2 font-light">Competitor</th>
                  <th className="px-3 py-2 font-light">Avg</th>
                  <th className="px-3 py-2 font-light">UI/UX</th>
                  <th className="px-3 py-2 font-light">Trust</th>
                  <th className="px-3 py-2 font-light">Local</th>
                  <th className="px-3 py-2 font-light">BOUT Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {topCompetitors.map((score) => (
                  <tr key={score.competitor} className="rounded-[16px] bg-white/[0.04] text-sm text-[#FFF8EC]/76">
                    <td className="rounded-l-[16px] px-3 py-4 text-[#FFF8EC]">{score.competitor}</td>
                    <td className="px-3 py-4 text-[#A87935]">{averageScore(score).toFixed(1)}</td>
                    <td className="px-3 py-4">{score.uiUx}/10</td>
                    <td className="px-3 py-4">{score.trust}/10</td>
                    <td className="px-3 py-4">{score.localFit}/10</td>
                    <td className="rounded-r-[16px] px-3 py-4">{score.boutOpportunity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel className="p-4 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#A87935]" strokeWidth={1.35} />
          <div>
            <p className="eyebrow mb-1">Verification</p>
            <h2 className="title-display text-[2rem]">Release <em className="gold-italic">Checklist</em></h2>
          </div>
        </div>
        <div className="grid gap-3">
          {verificationCommands.map((command) => (
            <code
              key={command}
              className="block overflow-x-auto rounded-[16px] border border-[rgba(255,248,236,0.10)] bg-[#1D1815]/42 px-4 py-3 text-[0.76rem] leading-6 text-[#FFF8EC]/74"
            >
              {command}
            </code>
          ))}
        </div>
      </AdminPanel>
    </div>
  );
}
