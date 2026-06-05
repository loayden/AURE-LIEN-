import { memo, type ReactNode } from "react";

interface AdminPageHeaderProps {
  action?: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
}

function AdminPageHeader({
  action,
  description,
  eyebrow = "Maison Control",
  title,
}: AdminPageHeaderProps) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const accent = words.length > 1 ? words.pop() : null;

  return (
    <div className="mb-5 sm:mb-10">
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="eyebrow mb-3 sm:mb-4">{eyebrow}</p>
          <h1
            className="title-display"
            style={{ fontSize: "clamp(2rem, 9vw, 4rem)" }}
          >
            {words.join(" ")}
            {accent ? (
              <>
                {" "}
                <em className="gold-italic">{accent}</em>
              </>
            ) : null}
          </h1>
          {description ? (
            <p className="body-copy mt-3 max-w-2xl sm:mt-4">{description}</p>
          ) : null}
        </div>

        {action}
      </div>

      <div className="page-header-divider mt-4 sm:mt-6" />
    </div>
  );
}

export default memo(AdminPageHeader);
