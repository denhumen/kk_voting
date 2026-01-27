import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getCategories } from "@/app/lib/db/candidates";
import { getSettings } from "@/app/lib/db/settings";
import { getResults } from "@/app/lib/db/results";
import CountdownTimer from "@/components/CountdownTimer"; // Import Timer
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "K&K — Результати",
  description: "Результати голосування студентів в межах ініціативи Королі та Королеви.",
};

export const revalidate = 0;

function isUcuEmail(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase().endsWith("@ucu.edu.ua");
}

function getOptimizedUrl(url: string | null, width: number) {
  if (!url) return null;
  if (url.includes("supabase.co")) {
    return `${url}?width=${width}&resize=contain&quality=75`;
  }
  return url;
}

export default async function ResultsPage() {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Auth Check
  if (!isUcuEmail(user.email)) {
    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center space-y-4">
            <h1 className="text-3xl font-alt text-zinc-200">Доступ обмежено</h1>
            <p className="text-zinc-400">Результати лише для @ucu.edu.ua</p>
            <form action="/auth/logout" method="post">
              <button className="text-sm underline text-zinc-500 hover:text-zinc-300">Вийти</button>
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

  // 3. Check Visibility Logic (NEW)
  const now = new Date();

  // We use results_date to determine visibility.
  // If it's null, we assume results are hidden.
  const resultsDate = settings.results_date ? new Date(settings.results_date) : null;
  const areResultsLive = resultsDate ? now >= resultsDate : false;

  // --------------------------------------------------------------------------
  // STATE A: RESULTS HIDDEN (Locked + Timer)
  // --------------------------------------------------------------------------
  if (!areResultsLive) {
    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 px-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="max-w-xl space-y-8 w-full">

            {/* Lock Icon */}
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-4xl animate-pulse">
              🔒
            </div>

            {/* Text */}
            <div>
              <h1 className="text-4xl font-alt text-white mb-3">Результати ще закриті</h1>
              <p className="text-zinc-400 font-main leading-relaxed">
                Офіційне оголошення результатів відбудеться: <br/>
                <span className="text-amber-500 font-semibold">
                    {resultsDate
                        ? resultsDate.toLocaleString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
                        : "Дата ще не визначена"}
                  </span>
              </p>
            </div>

            {/* Timer (Only if date is set) */}
            {resultsDate && (
                <div className="py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4 font-bold">До відкриття залишилось:</p>
                  <div className="scale-90 sm:scale-100">
                    <CountdownTimer targetDate={settings.results_date!} />
                  </div>
                </div>
            )}

            {/* 🟢 REDESIGNED BOTTOM FOOTER */}
            <div className="mt-8 pt-10 border-t border-zinc-800 w-full flex flex-col items-center gap-10">

              {/* General Partner */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-alt">Генеральний партнер</p>
                <a href="https://www.work.ua/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                      src="/logos/workua_white.png"
                      alt="Work.ua"
                      width={140}
                      height={50}
                      className="h-10 w-auto object-contain"
                  />
                </a>
              </div>

              {/* Gift Partners */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-alt">GIFT-партнери</p>

                <div className="flex items-center gap-8">
                  {/* Partner 1 */}
                  <a href="https://komubook.com.ua/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                    <Image
                        src="/logos/komubook.svg"
                        alt="Komubook"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                  </a>

                  {/* Dot Separator */}
                  <div className="h-1 w-1 bg-zinc-800 rounded-full" />

                  {/* Partner 2 */}
                  <a href="https://www.instagram.com/ucu_fitness/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                    <Image
                        src="/logos/ucu_fitness.svg"
                        alt="UCU Fitness"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
    );
  }

  // --------------------------------------------------------------------------
  // STATE B: RESULTS VISIBLE
  // --------------------------------------------------------------------------
  return (
      <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">

        {/* UNIFIED HEADER */}
        <section className="relative bg-zinc-900 border-b border-zinc-800">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-zinc-800/20 blur-[100px] rounded-full mix-blend-screen" />
          </div>

          <div className="relative mx-auto max-w-5xl px-6 md:px-10 pt-24">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-alt mb-2">
                  Королі та Королеви {new Date().getFullYear()} · УКУ
                </p>
                <h1 className="text-3xl md:text-5xl font-alt text-white">
                  Результати
                </h1>
              </div>
            </div>

            {/* PARTNER BANNER (Expanded) */}
            <div className="w-full rounded-t-3xl rounded-b-none border-t border-x border-zinc-700/50 border-b-0 bg-zinc-800/30 backdrop-blur-sm px-6 py-6 md:px-8 flex flex-col gap-8">

              {/* Row 1: General Partner (Work.ua) */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-4">
                  <div className="hidden md:block h-8 w-1 bg-amber-500/50 rounded-full" />
                  <div className="text-center md:text-left">
                        <span className="text-xs uppercase tracking-[0.2em] font-alt text-zinc-400 block mb-1">
                            Генеральний партнер
                        </span>
                    <span className="text-sm text-zinc-300 font-main">
                            Підтримуємо талановиту молодь разом
                        </span>
                  </div>
                </div>
                <a href="https://www.work.ua/" target="_blank" rel="noopener noreferrer" className="group">
                  <img
                      src="/logos/workua_white.png"
                      alt="Work.ua"
                      className="h-12 md:h-20 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                  />
                </a>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-zinc-700/30" />

              {/* Row 2: Two Additional Partners */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 sm:gap-12 opacity-80">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-alt hidden sm:block">
                      GIFT-партнери:
                  </span>

                <div className="flex items-center gap-8">
                  {/* Partner 1 */}
                  <a href="https://komubook.com.ua/" className="group">
                    {/* Replace with your <Image ... /> */}
                    <img className="h-12 w-auto object-contain" src="/logos/komubook.svg" alt="Komubook" />
                  </a>

                  {/* Partner 2 */}
                  <a href="https://www.instagram.com/ucu_fitness/" className="group">
                    {/* Replace with your <Image ... /> */}
                    <img className="h-12 w-auto object-contain" src="/logos/ucu_fitness.svg" alt="UCU Fitness" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="px-6 md:px-10 mt-12 mx-auto max-w-5xl space-y-24">
          {categories.map((cat) => {
            const catResults = results
                .filter((r) => r.categoryId === cat.id)
                .sort((a, b) => b.votes - a.votes);

            if (catResults.length === 0) return null;

            const winner = catResults[0];
            const runnerUps = catResults.slice(1);
            const totalVotesInCategory = catResults.reduce((acc, curr) => acc + curr.votes, 0);

            const getPercent = (votes: number) => {
              if (totalVotesInCategory === 0) return 0;
              return Math.round((votes / totalVotesInCategory) * 100);
            };

            return (
                <section key={cat.id} className="scroll-mt-32">
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
                    {/* Winner */}
                    <div className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-black p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]">
                      <div className="absolute top-0 right-0 bg-amber-500 text-black font-alt text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg">ФАВОРИТ</div>
                      <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-full border-4 border-amber-500/30 overflow-hidden shadow-2xl">
                        {winner.candidatePhoto ? (
                            <Image
                                src={getOptimizedUrl(winner.candidatePhoto, 600) || ""}
                                alt={winner.candidateName}
                                fill
                                sizes="(max-width: 768px) 96px, 128px"
                                className="object-cover"
                                unoptimized={true}
                            />
                        ) : (
                            <div className="h-full w-full bg-amber-900/50 flex items-center justify-center text-amber-200 text-3xl">🏆</div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl md:text-4xl font-alt text-white mb-2">{winner.candidateName}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <div className="text-3xl font-bold text-amber-400 font-mono">{winner.votes}</div>
                          <div className="text-sm text-amber-500/70 font-alt uppercase tracking-wider mt-2">Голосів ({getPercent(winner.votes)}%)</div>
                        </div>
                        <div className="mt-4 h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <div style={{ width: `${getPercent(winner.votes)}%` }} className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        </div>
                      </div>
                    </div>

                    {/* Runners Up */}
                    <div className="space-y-3 pl-0 md:pl-4">
                      {runnerUps.map((runner, index) => {
                        const percent = getPercent(runner.votes);
                        return (
                            <div key={runner.candidateId} className="relative group">
                              <div className="flex items-center gap-4 py-2">
                                <div className="w-6 text-center text-sm font-mono text-zinc-600 font-bold">{index + 2}</div>
                                <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                                  {runner.candidatePhoto &&
                                      <Image
                                          // Request a small 100px version
                                          src={getOptimizedUrl(runner.candidatePhoto, 100) || ""}
                                          alt=""
                                          width={40}
                                          height={40}
                                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition"
                                          unoptimized={true}
                                      />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-end mb-1">
                                    <span className="text-zinc-300 font-medium truncate pr-2">{runner.candidateName}</span>
                                    <span className="text-sm text-zinc-500 font-mono">{runner.votes} <span className="text-xs opacity-50">({percent}%)</span></span>
                                  </div>
                                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div style={{ width: `${percent}%` }} className="h-full bg-zinc-600 group-hover:bg-zinc-500 transition-colors rounded-full" />
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
      </main>
  );
}