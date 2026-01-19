import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getCategories, getCandidates } from "@/app/lib/db/candidates";
import { getSettings } from "@/app/lib/db/settings";
import { getUserVotes } from "@/app/lib/db/votes";
import VotingFlow from "@/components/VotingFlow";

export const revalidate = 0;

function isUcuEmail(email?: string | null) {
    if (!email) return false;
    return email.toLowerCase().endsWith("@ucu.edu.ua");
}

function getCategoryEmoji(title: string) {
    if (title.includes("Академ")) return "🎓";
    if (title.includes("військ")) return "🫡";
    if (title.includes("Соці")) return "🤝";
    if (title.includes("Культур")) return "🎭";
    return "👑";
}

export default async function VotePage() {
    const supabase = createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    if (!isUcuEmail(user.email)) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md text-center space-y-4">
                    <h1 className="text-3xl font-alt text-zinc-200">Доступ обмежено</h1>
                    <p className="text-zinc-400">Голосування лише для @ucu.edu.ua</p>
                    <form action="/auth/logout" method="post">
                        <button className="text-sm underline text-zinc-500 hover:text-zinc-300">Вийти</button>
                    </form>
                </div>
            </main>
        );
    }

    const [settings, categories, candidates, userVotes] = await Promise.all([
        getSettings(),
        getCategories(),
        getCandidates(),
        getUserVotes(user.id),
    ]);

    const hasVoted = Object.keys(userVotes).length > 0;

    // --------------------------------------------------------------------------
    // STATE 1: ALREADY VOTED (Show Receipt / Summary)
    // --------------------------------------------------------------------------
    if (hasVoted) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
                <header className="pt-16 pb-10 px-6 md:px-10 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-6 ring-1 ring-green-500/50 shadow-[0_0_30px_-10px_rgba(74,222,128,0.3)]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-alt text-white mb-3">
                            Ваш голос зараховано
                        </h1>
                        <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
                            Дякуємо за участь! Ваш вибір збережено в базі даних. Результати будуть оголошені згодом.
                        </p>
                    </div>
                </header>

                <div className="px-6 mt-12 mx-auto max-w-4xl space-y-12">

                    {/* User Profile Card */}
                    <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 flex items-center gap-5 backdrop-blur-sm">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl font-bold text-black shadow-lg">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-alt mb-1">Акаунт виборця</p>
                            <p className="text-lg md:text-xl font-semibold text-zinc-100">{user.email}</p>
                        </div>
                    </div>

                    {/* Selected Candidates Grid */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-alt text-zinc-300 border-l-4 border-amber-500 pl-4">
                            Ваш вибір
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {categories.map((cat) => {
                                const candidateId = userVotes[cat.id];
                                const candidate = candidates.find(c => c.id === candidateId);
                                const emoji = getCategoryEmoji(cat.title);

                                if (!candidate) return null;

                                return (
                                    <div key={cat.id} className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all flex flex-col">
                                        {/* Category Label */}
                                        <div className="absolute top-3 left-3 z-10">
                       <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10 px-3 py-1 text-xs font-alt uppercase tracking-wide text-zinc-200">
                         <span>{emoji}</span> {cat.title}
                       </span>
                                        </div>

                                        {/* Image Area */}
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                                            {candidate.photo_url ? (
                                                <img
                                                    src={candidate.photo_url}
                                                    alt={candidate.full_name}
                                                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-zinc-600">No Photo</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex-1 flex flex-col justify-end relative -mt-8">
                                            <h4 className="text-xl font-alt text-white leading-tight">
                                                {candidate.full_name}
                                            </h4>
                                            <p className="text-sm text-zinc-500 mt-1">{candidate.city}</p>
                                            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">Обрано вами</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-center pt-10">
                        <Link href="/" className="px-8 py-3 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition uppercase text-xs font-bold tracking-widest">
                            Повернутись на головну
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // --------------------------------------------------------------------------
    // STATE 2: VOTING CLOSED (And user hasn't voted)
    // --------------------------------------------------------------------------
    if (!settings.voting_open) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-xl space-y-6">
                    <img src="/chess/king_white.png" alt="" className="h-32 w-auto mx-auto opacity-20" />
                    <h1 className="text-4xl font-alt">Голосування закрите</h1>
                    <p className="text-zinc-400 font-main">
                        На жаль, період голосування завершився.
                    </p>
                    <Link href="/" className="inline-block rounded-full bg-zinc-100 px-6 py-3 text-sm font-alt uppercase text-black hover:bg-white">
                        На головну
                    </Link>
                </div>
            </main>
        );
    }

    // --------------------------------------------------------------------------
    // STATE 3: VOTING OPEN (Render Flow)
    // --------------------------------------------------------------------------
    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
            <header className="pt-20 pb-10 px-6 md:px-10 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
                <div className="mx-auto max-w-6xl flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-alt mb-2">
                            K&K Voting 2025
                        </p>
                        <h1 className="text-3xl md:text-5xl font-alt text-white">
                            Обери найкращих
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-zinc-500 mb-1">Ти голосуєш як:</p>
                        <p className="text-sm font-semibold text-amber-500">{user.email}</p>
                    </div>
                </div>
            </header>

            <VotingFlow
                categories={categories}
                candidates={candidates}
                initialUserVotes={userVotes}
            />
        </main>
    );
}