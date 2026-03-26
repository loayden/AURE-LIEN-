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
  const words = title.trim().split(/\s+/).filter(Boolean);
  const accent = words.length > 1 ? words.pop() : null;

  return (
    <main className="liquid-page px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-24 sm:pt-24 md:px-10 md:pb-28">
      <section className="page-wrap max-w-4xl">
        <div className="glass-panel mb-10 px-5 py-8 sm:px-8 sm:py-10">
          <p className="eyebrow mb-4">
            {eyebrow}
          </p>
          <h1
            className="mb-5 font-light leading-none text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.3rem, 6vw, 4.6rem)", letterSpacing: "0.05em" }}
          >
            {words.join(" ")}
            {accent ? (
              <>
                {" "}
                <em className="gold-italic">{accent}</em>
              </>
            ) : null}
          </h1>
          <p className="body-copy max-w-2xl">
            {intro}
          </p>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <article
              key={section.heading}
              className="glass-panel px-5 py-6 sm:px-7 sm:py-7"
            >
              <h2
                className="mb-4 font-light text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.35rem, 3vw, 1.8rem)", letterSpacing: "0.04em" }}
              >
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="body-copy">
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
