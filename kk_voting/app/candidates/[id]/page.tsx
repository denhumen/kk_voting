import Link from "next/link";
import { candidates, categories } from "@/app/lib/mockCandidates";
import { notFound } from "next/navigation";

function formatCategoryEmoji(title: string) {
  if (title.includes("Академ")) return "🎓";
  if (title.includes("військ")) return "🫡";
  if (title.includes("Соці")) return "🤝";
  if (title.includes("Культур")) return "🎭";
  return "👑";
}

export default async function CandidateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) return notFound();

  const categoryTitle =
    categories.find((x) => x.id === candidate.categoryId)?.title ?? "Номінація";

  const emoji = formatCategoryEmoji(categoryTitle);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-10 pb-12 md:px-10">
        {/* glow */}
        <div className="pointer-events-none absolute -inset-24 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_60%)]" />
        {/* watermark chess */}
        <div className="pointer-events-none absolute -right-10 -top-6 hidden md:block opacity-[0.08] blur-[0.3px]">
          <img src="/chess/quene_black.png" alt="" className="h-[420px] w-auto" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* breadcrumb row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/candidates"
              className="rounded-full border border-zinc-700 bg-zinc-900/40 px-5 py-2 text-sm font-alt uppercase hover:border-zinc-400 transition"
            >
              ← До кандидатів
            </Link>

            <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-300 font-alt uppercase tracking-[0.35em]">
              <span className="text-base">{emoji}</span>
              <span className="opacity-80">{categoryTitle}</span>
            </div>
          </div>

          <h1 className="mt-8 text-4xl md:text-6xl font-alt leading-tight">
            {candidate.name}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-200/90 text-base md:text-lg leading-relaxed font-main">
            {candidate.shortDescription}
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="px-6 pb-16 md:px-10 mt-5">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">
          {/* LEFT: PHOTO CARD */}
          <aside className="relative">
            <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/30 shadow-xl">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    Місто
                  </p>
                  <p className="text-xl font-alt text-white">{candidate.city}</p>
                </div>
              </div>
            </div>

            {/* small info chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 font-main">
                {emoji} {categoryTitle}
              </span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 font-main">
                Профіль кандидата
              </span>
            </div>
          </aside>

          {/* RIGHT: DETAILS */}
          <div>
            {/* Full info block */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 md:p-8 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg md:text-xl font-alt">Історія кандидата</h2>
              </div>

              <div className="mt-4 max-w-prose text-zinc-100/90 text-base leading-relaxed font-main whitespace-pre-line">
                {candidate.longDescription}
              </div>
            </div>

            {/* Voting callout */}
            <div className="mt-8 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 p-6 md:p-8">
              <h3 className="text-lg font-alt">Голосування скоро</h3>
              <p className="mt-2 text-sm md:text-base text-zinc-200/80 font-main leading-relaxed">
                Щоб проголосувати, потрібен вхід через Google. Доступ буде лише для
                акаунтів <span className="font-semibold">@ucu.edu.ua</span>.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-zinc-200/80 font-main">
                <li className="flex gap-2">
                  <span className="text-zinc-300">•</span> Один студент — один голос у кожній номінації
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-300">•</span> Результати зʼявляться на окремій сторінці
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-300">•</span> Старт оголосимо в соцмережах та розсилці
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  disabled
                  className="rounded-full bg-zinc-100 text-zinc-900 px-5 py-2 text-sm font-alt font-semibold uppercase opacity-60 cursor-not-allowed"
                >
                  Проголосувати (скоро)
                </button>

                <button
                  disabled
                  className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-alt uppercase text-zinc-100 opacity-60 cursor-not-allowed"
                >
                  Результати (скоро)
                </button>

                <Link
                  href="/details"
                  className="rounded-full border border-zinc-700 bg-zinc-900/30 px-5 py-2 text-sm font-alt uppercase hover:border-zinc-400 transition"
                >
                  Подивитись таймлайн
                </Link>
              </div>
            </div>

            {/* bottom nav */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link
                href="/candidates"
                className="text-zinc-300 hover:text-white transition font-main"
              >
                ← Повернутись до списку кандидатів
              </Link>
              <Link
                href="/"
                className="text-zinc-300 hover:text-white transition font-main"
              >
                На головну →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
