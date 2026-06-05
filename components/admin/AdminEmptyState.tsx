import { memo } from "react";
import type { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  description: string;
  title: string;
  icon: LucideIcon;
}

function AdminEmptyState({
  description,
  title,
  icon: Icon,
}: AdminEmptyStateProps) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const accent = words.length > 1 ? words.pop() : null;

  return (
    <div className="flex flex-col items-center py-12 text-center sm:py-20">
      <div className="empty-icon-panel mb-4 h-12 w-12 sm:mb-6 sm:h-16 sm:w-16">
        <Icon strokeWidth={1} className="h-5 w-5 text-white/20 sm:h-7 sm:w-7" />
      </div>
      <h2
        className="font-light text-white"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.45rem, 7vw, 1.8rem)", letterSpacing: "0.02em" }}
      >
        {words.join(" ")}
        {accent ? (
          <>
            {" "}
            <em className="gold-italic">{accent}</em>
          </>
        ) : null}
      </h2>
      <p className="body-copy mt-3 max-w-md sm:mt-4">{description}</p>
    </div>
  );
}

export default memo(AdminEmptyState);
