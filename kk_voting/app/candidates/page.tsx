import type { Metadata } from "next";
import Link from "next/link";
// import { candidates, categories } from "@/app/lib/mockCandidates";
import { getCandidates, getCategories } from "@/app/lib/db/candidates";

export const revalidate = 60; 

export const metadata: Metadata = {
  title: "K&K — Кандидати",
  description: "Кандидати у номінаціях Королі та Королеви.",
};

function getCategoryStyle(title: string) {
  if (title.includes("Академ")) return { emoji: "🎓", badge: "bg-blue-500/10 border-blue-400/30 text-blue-200" };
  if (title.includes("військ")) return { emoji: "🫡", badge: "bg-amber-500/10 border-amber-400/30 text-amber-200" };
  if (title.includes("Соці")) return { emoji: "🤝", badge: "bg-emerald-500/10 border-emerald-400/30 text-emerald-200" };
  if (title.includes("Культур")) return { emoji: "🎭", badge: "bg-fuchsia-500/10 border-fuchsia-400/30 text-fuchsia-200" };
  return { emoji: "👑", badge: "bg-zinc-500/10 border-zinc-400/30 text-zinc-200" };
}

function CategoryBadge({ title }: { title: string }) {
  const emoji =
    title.includes("Академ") ? "🎓" :
    title.includes("військ") ? "🫡" :
    title.includes("Соці") ? "🤝" :
    title.includes("Культур") ? "🎭" : "👑";

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs font-alt uppercase tracking-wide text-zinc-200 backdrop-blur">
      <span className="text-base leading-none">{emoji}</span>
      {title}
    </span>
  );
}

function CandidateCard({
  id,
  name,
  city,
  shortDescription,
  photoUrl,
  featured = false,
  categoryTitle,
}: {
  id: string;
  name: string;
  city: string;
  shortDescription: string;
  photoUrl: string | null;
  featured?: boolean;
  categoryTitle: string;
}) {
  const cat = getCategoryStyle(categoryTitle);

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 shadow-lg transition",
        !featured ? "hover:shadow-xl hover:-translate-y-0.5" : "",
        featured ? "lg:col-span-2" : "",
      ].join(" ")}
    >
      {/* glow */}
      {/* <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_60%)]" /> */}

      <div className={featured ? "grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]" : ""}>
        {/* PHOTO */}
        <div className={["relative overflow-hidden", featured ? "aspect-[4/3] md:aspect-auto md:min-h-[360px]" : "aspect-[3/4]"].join(" ")}>
          {photoUrl && (
            <>
              {/* BLURRED BACKGROUND LAYER (only for featured) */}
              {featured && (
                <img
                  src={photoUrl}
                  alt=""
                  aria-hidden
                  className="
                    absolute inset-0
                    h-full w-full
                    object-cover
                    scale-110
                    blur-2xl
                    opacity-40
                    z-[-1]
                  "
                />
              )}

              {/* MAIN IMAGE */}
              <img
                src={photoUrl}
                alt={name}
                className={[
                  "relative z-0 h-full w-full transition-transform duration-300",
                  featured
                    ? "object-contain"
                    : "object-cover group-hover:scale-[1.05]",
                ].join(" ")}
              />
            </>
          )}

          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* category badge */}
          <div className="sm:hidden absolute left-4 top-4">
            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                bg-black/60
                backdrop-blur-md
                border border-white/20
                px-3 py-1
                text-xs font-alt uppercase tracking-wide
                text-white
                shadow-lg
              "
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              {categoryTitle}
            </span>
          </div>


          {/* bottom text */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs uppercase tracking-wide text-white/70">
              {city}
            </p>
            <h3 className={["font-alt font-semibold text-white", featured ? "text-2xl md:text-3xl" : "text-xl"].join(" ")}>
              {name}
            </h3>
          </div>
        </div>

        {/* TEXT */}
        <div className={["p-6", featured ? "md:p-8 flex flex-col justify-between" : ""].join(" ")}>
          <div>
            <p className="text-xs font-alt uppercase tracking-[0.35em] text-zinc-400">
              Претендент на відзнаку
            </p>

            <p className="mt-3 text-base leading-relaxed text-zinc-300 font-main">
              {shortDescription}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-zinc-500"></span>
            <Link
              href={`/candidates/${id}`}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 px-4 py-2 text-xs font-alt uppercase tracking-wide hover:bg-white transition"
            >
              Детальніше
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function CandidatesPage() {
  const [categories, candidates] = await Promise.all([
    getCategories(),
    getCandidates(),
    console.log("Categories:" + await getCategories()),
    console.log("Candidates:" + await getCandidates()),
  ]);

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-50">
      {/* HEADER */}
      <section className="relative overflow-hidden px-6 py-14 md:px-10">
        {/* texture */}
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.05)_0,_transparent_55%)]" />

        {/* watermark chess */}
        <div className="pointer-events-none absolute -right-10 top-8 hidden md:block opacity-[0.08]">
          <img src="/chess/king_white.png" alt="" className="h-[360px] w-auto" />
        </div>

        <div className="mt-10 sm:mt-0 relative mx-auto max-w-6xl">
          <p
            className="uppercase text-xs text-zinc-400 font-alt"
            style={{ letterSpacing: "0.35em" }}
          >
            Королі та Королеви · УКУ
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-alt">
            Кандидати
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-300 text-base leading-relaxed font-main">
            Ознайомся з кандидатами у кожній номінації. На картці — короткий опис,
            у профілі — повна інформація.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="ml-0 md:ml-3 text-xs text-zinc-500 font-main">
              * Голосування розпочнеться 22 січня о 8:00
            </span>
          </div>
        </div>
        {/* PARTNER BANNER */}
        <div className="relative mt-12">
          <div className="
            mx-auto max-w-6xl
            rounded-2xl
            border border-zinc-700/60
            bg-zinc-900/60
            backdrop-blur
            px-6 py-5
            flex flex-col
            items-center justify-center
            gap-2
            shadow-lg
          ">
            <span className="
              text-xs text-center uppercase tracking-[0.35em]
              font-alt text-zinc-400
            ">
              Генеральний партнер події
            </span>

            <a href="https://www.work.ua/">
              <img
                src="/logos/workua_white.png"
                alt="Work.ua"
                className="
                  h-20
                  object-contain
                  opacity-90
                  hover:opacity-100
                  transition
                "
              />
            </a>
          </div>
        </div>

      </section>

      {/* CONTENT */}
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-6xl space-y-16 mt-5">
          {categories.map((cat) => {
            const list = candidates.filter((c) => c.category_id === cat.id);
            if (!list.length) return null;

            const [first, ...rest] = list;

            return (
              <div key={cat.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {(() => {
                    const s = getCategoryStyle(cat.title);
                    return (
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-2xl font-alt flex items-center gap-3">
                          <span className="text-2xl">{s.emoji}</span>
                          {cat.title}
                        </h2>
                        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-zinc-700/0 via-zinc-700/70 to-zinc-700/0" />
                      </div>
                    );
                  })()}
                  {/* <CategoryBadge title={cat.title} /> */}
                </div>

                <div className="mt-7 grid items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <CandidateCard
                    id={first.id}
                    name={first.full_name}
                    city={first.city}
                    featured={first.is_wide}
                    shortDescription={first.short_description}
                    photoUrl={first.photo_url}
                    categoryTitle={cat.title}
                  />

                  {rest.map((c) => (
                    <CandidateCard
                      key={c.id}
                      id={c.id}
                      name={c.full_name}
                      featured={c.is_wide}
                      city={c.city}
                      shortDescription={c.short_description}
                      photoUrl={c.photo_url}
                      categoryTitle={cat.title}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
