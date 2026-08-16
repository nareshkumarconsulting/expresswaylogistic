export function DirectAnswerBlock({
  text,
  heading = "Direct answer",
}: {
  text: string;
  heading?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-[#071e38] p-6 text-white md:p-8">
      <div
        className="pointer-events-none absolute -right-10 -bottom-12 size-40 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <p className="relative mb-3 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
        {heading}
      </p>
      <p className="relative text-base leading-relaxed text-white/85">{text}</p>
    </div>
  );
}
