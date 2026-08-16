import type { FaqItem } from "@/constants/faqs";

interface DirectAnswersProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  items: readonly FaqItem[];
}

export function DirectAnswers({
  eyebrow = "Direct answers",
  title = "What shippers ask before they book",
  description,
  items,
}: DirectAnswersProps) {
  return (
    <section className="bg-surface py-section">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            {eyebrow}
          </p>
          <h2 className="text-h2 text-foreground">{title}</h2>
          {description ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <article
              key={item.question}
              className="border border-border bg-card p-6 md:p-8"
            >
              <p className="mb-3 font-heading text-sm font-bold text-[#00A3FF]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-lg font-semibold text-foreground md:text-xl">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
