import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getCategories } from "@/app/lib/db/candidates";
import { getSettings } from "@/app/lib/db/settings";
import { getResults } from "@/app/lib/db/results";

export const revalidate = 0;

function isUcuEmail(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase().endsWith("@ucu.edu.ua");
}

export default async function ResultsPage() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Auth Check
  if (!isUcuEmail(user.email)) {
    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center space-y-4">
            <h1 className="text-3xl font-alt text-zinc-200">Доступ обмежено</h1>
            <p className="text-zinc-400">Результати лише для @ucu.edu.ua</p>
            <form action="/auth/logout" method="post">
              <button className="text-sm underline text-zinc-500 hover:text-zinc-300">
                Вийти
              </button>
            </form>
          </div>
        </main>
    );
  }

  // 2. Fetch Data
  const [settings, categories, results] = await Promise.all([
    getSettings(),
    getCategories(),
    getResults(),
  ]);

  // 3. Check if Results are Public
  // If false, show "Coming Soon" even if logged in
  if (!settings.results_public) {
    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 px-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-4xl">
              🔒
            </div>
            <h1 className="text-4xl font-alt text-white">Результати ще закриті</h1>
            <p className="text-zinc-400 font-main leading-relaxed">
              Голосування ще триває або йде підрахунок голосів.
              <br />
              Завітайте сюди трішки пізніше!
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                  href="/"
                  className="rounded-full bg-zinc-100 text-zinc-900 px-6 py-3 text-sm font-alt uppercase hover:bg-white transition"
              >
                На головну
              </Link>
            </div>
          </div>
        </main>
    );
  }

  // 4. Render Results
  return (
      <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
        {/* Header */}
        <header className="pt-20 pb-10 px-6 md:px-10 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur top-0 z-40">
          <div className="mx-auto max-w-5xl flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-alt mb-2">
                K&K Voting 2025
              </p>
              <h1 className="text-3xl md:text-5xl font-alt text-white">
                Результати
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Ви увійшли як:</p>
              <p className="text-sm font-semibold text-amber-500">{user.email}</p>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 mt-12 mx-auto max-w-5xl space-y-24">
          {categories.map((cat) => {
            // Filter and Sort Candidates by Votes DESC
            const catResults = results
                .filter((r) => r.categoryId === cat.id)
                .sort((a, b) => b.votes - a.votes);

            if (catResults.length === 0) return null;

            const winner = catResults[0];
            const runnerUps = catResults.slice(1);
            const totalVotesInCategory = catResults.reduce((acc, curr) => acc + curr.votes, 0);

            // Helper to calculate percentage for bars
            const getPercent = (votes: number) => {
              if (totalVotesInCategory === 0) return 0;
              return Math.round((votes / totalVotesInCategory) * 100);
            };

            return (
                <section key={cat.id} className="scroll-mt-32">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl border border-zinc-700">
                      {cat.title.includes("Академ") ? "🎓" :
                          cat.title.includes("військ") ? "🫡" :
                              cat.title.includes("Соці") ? "🤝" :
                                  cat.title.includes("Культур") ? "🎭" : "👑"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-alt text-zinc-100">{cat.title}</h2>
                      <p className="text-sm text-zinc-500">
                        Всього голосів: {totalVotesInCategory}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">

                    {/* 🥇 WINNER CARD */}
                    <div className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-black p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]">
                      {/* Winner Badge */}
                      <div className="absolute top-0 right-0 bg-amber-500 text-black font-alt text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg">
                        ФАВОРИТ
                      </div>

                      {/* Winner Photo */}
                      <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-full border-4 border-amber-500/30 overflow-hidden shadow-2xl">
                        {winner.candidatePhoto ? (
                            <img src={winner.candidatePhoto} alt={winner.candidateName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-amber-900/50 flex items-center justify-center text-amber-200 text-3xl">🏆</div>
                        )}
                      </div>

                      {/* Winner Info */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl md:text-4xl font-alt text-white mb-2">
                          {winner.candidateName}
                        </h3>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <div className="text-3xl font-bold text-amber-400 font-mono">
                            {winner.votes}
                          </div>
                          <div className="text-sm text-amber-500/70 font-alt uppercase tracking-wider mt-2">
                            Голосів ({getPercent(winner.votes)}%)
                          </div>
                        </div>
                        {/* Winner Bar */}
                        <div className="mt-4 h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <div
                              style={{ width: `${getPercent(winner.votes)}%` }}
                              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 🥈 RUNNER UPS (List View) */}
                    <div className="space-y-3 pl-0 md:pl-4">
                      {runnerUps.map((runner, index) => {
                        const percent = getPercent(runner.votes);
                        return (
                            <div key={runner.candidateId} className="relative group">
                              <div className="flex items-center gap-4 py-2">
                                {/* Rank Number */}
                                <div className="w-6 text-center text-sm font-mono text-zinc-600 font-bold">
                                  {index + 2}
                                </div>

                                {/* Avatar (Small) */}
                                <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                                  {runner.candidatePhoto && (
                                      <img src={runner.candidatePhoto} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition" />
                                  )}
                                </div>

                                {/* Info & Bar */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-end mb-1">
                                            <span className="text-zinc-300 font-medium truncate pr-2">
                                                {runner.candidateName}
                                            </span>
                                    <span className="text-sm text-zinc-500 font-mono">
                                                {runner.votes} <span className="text-xs opacity-50">({percent}%)</span>
                                            </span>
                                  </div>
                                  {/* Progress Bar */}
                                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${percent}%` }}
                                        className="h-full bg-zinc-600 group-hover:bg-zinc-500 transition-colors rounded-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>

                  </div>
                </section>
            );
          })}
        </div>

        <div className="flex justify-center pt-16 pb-10">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition underline">
            Повернутись на головну
          </Link>
        </div>

      </main>
  );
}