export default function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,249,239,0.96) 0%, rgba(245,241,232,0.92) 46%, rgba(232,220,205,0.88) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(168,121,53,0.045) 0%, transparent 32%, rgba(255,255,255,0.42) 62%, rgba(123,103,82,0.045) 100%)",
        }}
      />
      <div className="grain-overlay" />
    </div>
  );
}
