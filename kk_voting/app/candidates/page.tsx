import type { Metadata } from "next";
import { getCandidates, getCategories } from "@/app/lib/db/candidates";
import CandidateGrid from "@/components/CandidateGrid";
import { getSettings } from "@/app/lib/db/settings";

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

export default async function CandidatesPage() {
  const [categories, candidates] = await Promise.all([
    getCategories(),
    getCandidates(),
  ]);

  const [settings] = await Promise.all([
    getSettings()
  ]);

  const endDate = settings.voting_end ? new Date(settings.voting_end) : null;

  // @ts-ignore
  return (
      <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">

        {/* 1. UNIFIED HERO SECTION (Not Sticky)
        This contains both the Title info and the Partner Banner
      */}
        <section className="relative bg-zinc-900 border-b border-zinc-800">

          {/* Background Gradients/Texture */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-zinc-800/20 blur-[100px] rounded-full mix-blend-screen" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 md:px-10 pt-24">
            {/* Top Part: Title & Info */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-alt mb-3">
                  Королі та Королеви {endDate?.getFullYear()} · УКУ
                </p>
                <h1 className="text-4xl md:text-6xl font-alt text-white mb-6">
                  Кандидати
                </h1>
                <p className="text-zinc-300 text-base leading-relaxed font-main max-w-xl">
                  Ознайомся з кандидатами у кожній номінації. <br className="hidden md:block"/>
                  На картці — короткий опис, у профілі — повна інформація.
                </p>
              </div>

              {/* Optional Decorative Element (Hidden on mobile) */}
              <div className="hidden md:block opacity-20">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
              </div>
            </div>

            {/* 2. PARTNER BANNER (Integrated)
            Shape: Rounded Top (3xl), Sharp Bottom (rounded-b-none),
            sitting on the bottom edge of the section.
          */}
            <div className="
            w-full
            rounded-t-3xl rounded-b-none
            border-t border-x border-zinc-700/50
            border-b-0
            bg-zinc-800/30
            backdrop-blur-sm
            px-8 py-6
            flex flex-col md:flex-row
            items-center justify-between
            gap-6
          ">
              <div className="flex items-center gap-4">
                <div className="h-10 w-1 bg-amber-500/50 rounded-full" />
                <div>
                 <span className="text-xs uppercase tracking-[0.2em] font-alt text-zinc-400 block mb-1">
                   Генеральний партнер
                 </span>
                  <span className="text-sm text-zinc-200 font-main">
                   Підтримуємо талановиту молодь разом
                 </span>
                </div>
              </div>

              <a href="https://www.work.ua/" target="_blank" rel="noopener noreferrer" className="group">
                <img
                    src="/logos/workua_white.png"
                    alt="Work.ua"
                    className="
                  h-14
                  object-contain
                  opacity-70
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  filter grayscale group-hover:grayscale-0
                "
                />
              </a>
            </div>
          </div>
        </section>

        {/* 3. CANDIDATES GRID CONTENT */}
        <section className="px-6 py-16 md:px-10">
          <div className="mx-auto max-w-6xl space-y-24">
            {categories.map((cat) => {
              const list = candidates.filter((c) => c.category_id === cat.id);
              if (!list.length) return null;

              // Sorting
              const sortedList = list.sort((a, b) => {
                if (a.is_wide && !b.is_wide) return -1;
                if (!a.is_wide && b.is_wide) return 1;
                return a.full_name.localeCompare(b.full_name, "uk");
              });

              const style = getCategoryStyle(cat.title);

              return (
                  <div key={cat.id} className="scroll-mt-32" id={cat.id}>
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

                    {/* Grid */}
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