import Image from "next/image";
import { LEADERS } from "@/constants/content";

export function AboutLeadership() {
  return (
    <section className="bg-brand py-section text-brand-foreground">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
        <div className="max-w-md lg:pt-2">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Our Leadership
          </p>
          <h2 className="text-h2 mb-5 text-white">
            Experienced leaders.
            <span className="mt-1 block bg-gradient-to-r from-sky-300 to-[#00A3FF] bg-clip-text text-transparent">
              Personalized approach.
            </span>
          </h2>
          <p className="text-base leading-relaxed text-white/75">
            With decades of expertise and a passion for logistics, our
            leadership drives innovation, builds relationships, and delivers
            results.
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {LEADERS.map((leader) => (
            <li key={leader.name}>
              <article className="h-full overflow-hidden rounded-xl border border-white/20 bg-white/[0.03]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#041526]">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 28rem"
                    className={leader.imageClass}
                  />
                </div>
                <div className="px-5 py-5">
                  <h3 className="text-lg font-semibold text-accent">
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-white">
                    {leader.title}
                  </p>
                  <div className="mt-3 h-0.5 w-10 bg-accent" aria-hidden />
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {leader.bio}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
