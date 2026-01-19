import type { Metadata } from "next";
import { getCandidates, getCategories } from "@/app/lib/db/candidates";
import CandidateGrid from "@/components/CandidateGrid"; // Import our new Grid

export const revalidate = 60;

export const metadata: Metadata = {
  title: "K&K — Кандидати",
  description: "Кандидати у номінаціях Королі та Королеви.",
};

// Helper for the Category Header Style
function getCategoryStyle(title: string) {
  if (title.includes("Академ")) return { emoji: "🎓", badge: "bg-blue-500/10 border-blue-400/30 text-blue-200" };
  if (title.includes("військ")) return { emoji: "🫡", badge: "bg-amber-500/10 border-amber-400/30 text-amber-200" };
  if (title.includes("Соці")) return { emoji: "🤝", badge: "bg-emerald-500/10 border-emerald-400/30 text-emerald-200" };
  if (title.includes("Культур")) return { emoji: "🎭", badge: "bg-fuchsia-500/10 border-fuchsia-400/30 text-fuchsia-200" };
  return { emoji: "👑", badge: "bg-zinc-500/10 border-zinc-400/30 text-zinc-200" };
}

export default async function CandidatesPage() {
  const [categories, candidates] = await Promise.all([
    getCategories(),
    getCandidates(),
  ]);

  return (
      <main className="min-h-screen bg-zinc-900 text-zinc-50">
        {/* HEADER */}
        <section className="relative overflow-hidden px-6 py-14 md:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.05)_0,_transparent_55%)]" />
          <div className="pointer-events-none absolute -right-10 top-8 hidden md:block opacity-[0.08]">
            <img src="/chess/king_white.png" alt="" className="h-[360px] w-auto" />
          </div>

          <div className="mt-10 sm:mt-0 relative mx-auto max-w-6xl">
            <p className="uppercase text-xs text-zinc-400 font-alt" style={{ letterSpacing: "0.35em" }}>
              Королі та Королеви · УКУ
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-alt">Кандидати</h1>
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
            <div className="mx-auto max-w-6xl rounded-2xl border border-zinc-700/60 bg-zinc-900/60 backdrop-blur px-6 py-5 flex flex-col items-center justify-center gap-2 shadow-lg">
            <span className="text-xs text-center uppercase tracking-[0.35em] font-alt text-zinc-400">
              Генеральний партнер події
            </span>
              <a href="https://www.work.ua/">
                <img src="/logos/workua_white.png" alt="Work.ua" className="h-20 object-contain opacity-90 hover:opacity-100 transition" />
              </a>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="px-6 pb-16 md:px-10">
          <div className="mx-auto max-w-7xl mt-5 space-y-24">
            {categories.map((cat) => {
              const list = candidates.filter((c) => c.category_id === cat.id);
              if (!list.length) return null;

              // Sorting: Wide cards first helps Packery fill the top nicely,
              // but Packery is smart enough to handle random order too.
              // Let's stick to simple alphabetical, or Wide then Alphabetical.
              const sortedList = list.sort((a, b) => {
                if (a.is_wide && !b.is_wide) return -1;
                if (!a.is_wide && b.is_wide) return 1;
                return a.full_name.localeCompare(b.full_name, "uk");
              });

              const style = getCategoryStyle(cat.title);

              return (
                  <div key={cat.id}>
                    {/* Category Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
                      <div className="flex items-center justify-between gap-3 w-full">
                        <h2 className="text-3xl font-alt flex items-center gap-3 text-zinc-100">
                          <span>{style.emoji}</span>
                          {cat.title}
                        </h2>
                        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-zinc-700/0 via-zinc-700/70 to-zinc-700/0" />
                      </div>
                    </div>

                    {/* THE PACKERY GRID */}
                    <CandidateGrid
                        candidates={sortedList}
                        categoryTitle={cat.title}
                    />
                  </div>
              );
            })}
          </div>
        </section>
      </main>
  );
}