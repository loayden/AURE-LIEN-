type LegalSection = {
  heading: string;
  body: string[];
};

interface LegalDocumentPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalDocumentPage({
  eyebrow,
  title,
  intro,
  sections,
}: LegalDocumentPageProps) {
  return (
    <main className="min-h-screen bg-[#080808] px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-24 sm:pt-24 md:px-10 md:pb-28">
      <section className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-[2rem] border border-white/8 bg-white/[0.03] px-5 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-10">
          <p
            className="mb-4 text-[9px] uppercase tracking-[0.42em] text-white/28"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {eyebrow}
          </p>
          <h1
            className="mb-5 font-light leading-none text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.3rem, 6vw, 4.6rem)", letterSpacing: "0.05em" }}
          >
            {title}
          </h1>
          <p
            className="max-w-2xl text-[12px] leading-relaxed text-white/42 sm:text-sm"
            style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.05em" }}
          >
            {intro}
          </p>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-[1.8rem] border border-white/8 bg-white/[0.025] px-5 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.24)] sm:px-7 sm:py-7"
            >
              <h2
                className="mb-4 font-light text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.35rem, 3vw, 1.8rem)", letterSpacing: "0.04em" }}
              >
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[12px] leading-relaxed text-white/44 sm:text-sm"
                    style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.04em" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
