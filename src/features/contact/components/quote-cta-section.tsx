import { Typography } from "@/components/atoms/typography";
import { QuoteForm } from "@/features/contact/components/quote-form";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";

export function QuoteCtaSection() {
  return (
    <section id="contact" className="bg-background py-section">
      <div className="container-page">
        <div className="relative mx-auto flex max-w-5xl flex-col overflow-hidden shadow-2xl md:flex-row">
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-accent opacity-20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-sky-400 opacity-20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-center bg-primary p-10 text-white md:w-5/12 md:p-12">
            <Typography as="h2" variant="h3" className="mb-4 text-white">
              Ready to Ship?
            </Typography>
            <p className="mb-8 font-normal leading-relaxed text-slate-300">
              Share your cargo details. {QUOTE_RESPONSE_STATEMENT}
            </p>
            <ol className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded bg-white/10 font-bold text-accent">
                  1
                </span>
                <div>
                  <h3 className="font-bold">Provide Details</h3>
                  <p className="text-sm text-slate-400">
                    Origin, destination, and cargo type.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded bg-white/10 font-bold text-accent">
                  2
                </span>
                <div>
                  <h3 className="font-bold">Get a Quote</h3>
                  <p className="text-sm text-slate-400">
                    Competitive pricing tailored for you.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="relative z-10 w-full bg-white p-10 md:w-7/12 md:p-12">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
