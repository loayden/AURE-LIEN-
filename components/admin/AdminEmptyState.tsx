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
    <div className="flex flex-col items-center py-20 text-center">
      <div className="empty-icon-panel mb-6 h-16 w-16">
        <Icon strokeWidth={1} className="h-7 w-7 text-white/20" />
      </div>
      <h2
        className="font-light text-white"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}
      >
        {words.join(" ")}
        {accent ? (
          <>
            {" "}
            <em className="gold-italic">{accent}</em>
          </>
        ) : null}
      </h2>
      <p className="body-copy mt-4 max-w-md">{description}</p>
    </div>
  );
}

export default memo(AdminEmptyState);
