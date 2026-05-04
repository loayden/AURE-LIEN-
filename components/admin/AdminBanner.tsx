import { memo } from "react";

interface AdminBannerProps {
  message: string;
  tone?: "error" | "success";
}

function AdminBanner({ message, tone = "error" }: AdminBannerProps) {
  const isSuccess = tone === "success";

  return (
    <div
      className="mb-5 rounded-2xl px-4 py-3"
      style={{
        background: isSuccess ? "rgba(168,121,53,0.08)" : "rgba(255,60,60,0.07)",
        border: isSuccess ? "1px solid rgba(168,121,53,0.22)" : "1px solid rgba(255,80,80,0.18)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: isSuccess ? "rgba(168,121,53,0.88)" : "rgba(255,120,120,0.75)" }}
      >
        {message}
      </p>
    </div>
  );
}

export default memo(AdminBanner);
