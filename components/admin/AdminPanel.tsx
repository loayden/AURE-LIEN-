import { memo, type ReactNode } from "react";

interface AdminPanelProps {
  children: ReactNode;
  className?: string;
}

function AdminPanel({ children, className = "" }: AdminPanelProps) {
  return (
    <section className={`glass-panel relative overflow-hidden ${className}`.trim()}>
      <div
        className="absolute inset-x-5 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.20), transparent)" }}
      />
      {children}
    </section>
  );
}

export default memo(AdminPanel);
