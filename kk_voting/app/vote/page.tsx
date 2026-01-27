import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getCategories, getCandidates } from "@/app/lib/db/candidates";
import { getSettings } from "@/app/lib/db/settings";
import { getUserVotes } from "@/app/lib/db/votes";
import VotingFlow from "@/components/VotingFlow";
import CountdownTimer from "@/components/CountdownTimer";
import type {Metadata} from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "K&K — Голосування",
    description: "Голосування студентів в межах ініціативи Королі та Королеви.",
};

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

    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
        await supabase.from("profiles").upsert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            // If you added avatar_url column to DB, uncomment next line:
            // avatar_url: user.user_metadata?.avatar_url
        });
    }

    const [settings, categories, candidates, userVotes] = await Promise.all([
        getSettings(),
        getCategories(),
        getCandidates(),
        getUserVotes(user.id),
    ]);

    const hasVoted = Object.keys(userVotes).length > 0;

    // Parse Dates
    const now = new Date();
    const startDate = settings.voting_start ? new Date(settings.voting_start) : null;
    const endDate = settings.voting_end ? new Date(settings.voting_end) : null;

    // Check if voting has officially ended based on time
    const isVotingEnded = endDate ? now > endDate : false;

    // --------------------------------------------------------------------------
    // STATE 1: ALREADY VOTED (Show Receipt / Summary)
    // --------------------------------------------------------------------------
    if (hasVoted) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
                <header className="pt-16 pb-10 px-6 md:px-10 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <div className="mt-10 mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-6 ring-1 ring-green-500/50 shadow-[0_0_30px_-10px_rgba(74,222,128,0.3)]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-alt text-white mb-3">
                            Ваш голос зараховано
                        </h1>
                        <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
                            Дякуємо за участь! Ваш вибір збережено в базі даних.
                        </p>
                    </div>
                </header>

                <div className="px-6 mt-8 mx-auto max-w-4xl space-y-10">

                    {/* [NEW] Partner Banner for "Voted" State (Highlighted) */}
                    <div className="w-full flex justify-center">
                        <a href="https://www.work.ua/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-5 bg-zinc-800 border border-zinc-700 rounded-2xl px-8 py-4 shadow-lg hover:border-zinc-500 transition-colors">
                                <span className="text-xs uppercase tracking-widest text-zinc-400 font-alt">
                                    Головний партнер
                                </span>
                                {/* Divider only on Desktop */}
                                <div className="hidden sm:block h-8 w-px bg-zinc-700" />

                                <img
                                    src="/logos/workua_white.png"
                                    alt="Work.ua"
                                    className="h-8 w-auto object-contain"
                                />
                            </div>
                        </a>
                    </div>

                    {/* User Profile Card */}
                    <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 flex items-center gap-5 backdrop-blur-sm">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl font-bold text-black shadow-lg flex-shrink-0">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-alt mb-1">Акаунт виборця</p>
                            <p className="text-lg md:text-xl font-semibold text-zinc-100 truncate">{user.email}</p>
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
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10 px-3 py-1 text-xs font-alt uppercase tracking-wide text-zinc-200">
                                                <span>{emoji}</span> {cat.title}
                                            </span>
                                        </div>
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                                            {candidate.photo_url ? (
                                                <Image
                                                    src={candidate.photo_url}
                                                    alt={candidate.full_name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-zinc-600">No Photo</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-end relative -mt-8">
                                            <h4 className="text-xl font-alt text-white leading-tight">{candidate.full_name}</h4>
                                            <p className="text-sm text-zinc-500 mt-1">{candidate.city}</p>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // --------------------------------------------------------------------------
    // STATE 2: IS IT OVER? (And User did NOT vote)
    // --------------------------------------------------------------------------
    if (isVotingEnded) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-xl space-y-8">
                    <div className="relative inline-block">
                        <img src="/chess/king_white.png" alt="" className="h-32 w-auto mx-auto opacity-20" />
                        <div className="absolute -bottom-2 -right-2 bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded">2025</div>
                    </div>

                    <div>
                        <h1 className="text-4xl font-alt mb-3">Голосування завершено</h1>
                        <p className="text-zinc-400 font-main leading-relaxed">
                            Період голосування закінчився. Дякуємо всім, хто взяв участь!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/results" className="rounded-full bg-amber-500 text-black px-8 py-3 text-sm font-alt uppercase font-bold hover:bg-amber-400 transition shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            Переглянути результати
                        </Link>
                        <Link href="/" className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-alt uppercase hover:border-zinc-500 text-zinc-400 hover:text-white transition">
                            На головну
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // --------------------------------------------------------------------------
    // STATE 3: IS IT FUTURE? (Countdown to start)
    // --------------------------------------------------------------------------
    if (startDate && now < startDate) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-3xl w-full space-y-10">
                    <img src="/chess/king_white.png" alt="" className="h-32 w-auto mx-auto opacity-30 animate-pulse" />

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-alt text-white">
                            Голосування скоро розпочнеться
                        </h1>
                        <p className="text-zinc-400 font-main text-lg">
                            Відкриття голосування заплановано на <span className="text-amber-500 font-semibold">{startDate.toLocaleString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                    </div>

                    <div className="py-8 scale-90 sm:scale-100">
                        <CountdownTimer targetDate={settings.voting_start!} />
                    </div>

                    <Link href="/" className="inline-block rounded-full bg-zinc-100 px-8 py-3 text-sm font-alt uppercase text-black hover:bg-white tracking-widest">
                        На головну
                    </Link>
                </div>
            </main>
        );
    }

    // --------------------------------------------------------------------------
    // STATE 4: IS IT MANUALLY CLOSED?
    // --------------------------------------------------------------------------
    if (!settings.voting_open) {
        return (
            <main className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-xl space-y-6">
                    <img src="/chess/king_white.png" alt="" className="h-32 w-auto mx-auto opacity-20" />
                    <h1 className="text-4xl font-alt">Голосування призупинено</h1>
                    <p className="text-zinc-400 font-main">
                        На жаль, на даний момент голосування тимчасово недоступне.
                    </p>
                    <Link href="/" className="inline-block rounded-full bg-zinc-100 px-6 py-3 text-sm font-alt uppercase text-black hover:bg-white">
                        На головну
                    </Link>
                </div>
            </main>
        );
    }

    // --------------------------------------------------------------------------
    // STATE 5: VOTING ACTIVE (Render Flow)
    // --------------------------------------------------------------------------
    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
            <header className="pt-20 pb-10 px-6 md:px-10 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur top-0 z-40">
                <div className="mx-auto max-w-6xl flex flex-wrap items-end justify-between gap-6">
                    <div className="w-full md:w-auto"> {/* Added w-full to ensure container width on mobile */}
                        <p className="text-center sm:text-left text-xs uppercase tracking-[0.3em] text-zinc-500 font-alt mb-2">
                            Королі та Королеви {endDate?.getFullYear()} · УКУ
                        </p>
                        <h1 className="text-center sm:text-left text-3xl md:text-5xl font-alt text-white">
                            Обери найкращих
                        </h1>

                        {/* --- RESPONSIVE HEADER TIMER --- */}
                        {settings.voting_end && (
                            <div className="mt-8 bg-zinc-800/50 rounded-xl border border-zinc-700/50 backdrop-blur-md overflow-hidden">
                                <div className="p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-6">

                                    {/* Label */}
                                    <div className="flex items-center gap-2 text-amber-500 flex-shrink-0">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                        <p className="text-xs font-mono uppercase tracking-widest font-bold whitespace-nowrap">
                                            До кінця:
                                        </p>
                                    </div>

                                    {/* Timer Wrapper
                                        Mobile: Centered + Scaled 0.6 + Origin Center
                                        Desktop: Left aligned + Scaled 0.75/0.9 + Origin Left
                                    */}
                                    <div className="w-full flex justify-center sm:justify-start -my-3 sm:my-0">
                                        <div className="origin-center sm:origin-left scale-[0.6] sm:scale-75 md:scale-90 transform-gpu">
                                            <CountdownTimer targetDate={settings.voting_end} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                        {/* ------------------------------- */}

                    </div>
                </div>
            </header>

            <VotingFlow
                categories={categories}
                candidates={candidates}
                initialUserVotes={userVotes}
            />

            {/* [NEW] Footer for "Active" State (Highlighted) */}
            <footer className="my-15 pb-16 flex justify-center px-6">
                <a href="https://www.work.ua/" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="
                                    flex flex-col md:flex-row items-center gap-4 md:gap-6 px-10 py-5
                                    rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl
                                    hover:border-zinc-600 transition-colors
                                ">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-alt">
                                Генеральний партнер
                            </span>
                        </div>

                        {/* Vertical Divider (Desktop) */}
                        <div className="hidden md:block h-6 w-px bg-zinc-700" />

                        <img
                            src="/logos/workua_white.png"
                            alt="Work.ua"
                            className="h-8 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </a>
            </footer>
        </main>
    );
}