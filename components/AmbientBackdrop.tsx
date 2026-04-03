export default function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="orb orb-gold"
        style={{
          width: "min(700px, 74vw)",
          height: "min(700px, 74vw)",
          top: "-16%",
          right: "-10%",
        }}
      />
      <div
        className="orb orb-violet"
        style={{
          width: "min(560px, 62vw)",
          height: "min(560px, 62vw)",
          bottom: "4%",
          left: "-8%",
        }}
      />
      <div
        className="orb orb-gold"
        style={{
          width: "min(460px, 46vw)",
          height: "min(460px, 46vw)",
          top: "46%",
          left: "36%",
          opacity: 0.5,
          filter: "blur(110px)",
          animation: "orbDrift2 34s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(201,168,106,0.06) 0%, transparent 55%), linear-gradient(180deg, rgba(8,8,8,0.02) 0%, rgba(8,8,8,0.14) 100%)",
        }}
      />
      <div className="grain-overlay" />
    </div>
  )
}
