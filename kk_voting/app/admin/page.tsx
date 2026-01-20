import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getSettings } from "@/app/lib/db/settings";
import { getAdminStats } from "@/app/lib/db/admin-stats";
import { getResults } from "@/app/lib/db/results";       // [NEW] Import
import { getCategories } from "@/app/lib/db/candidates"; // [NEW] Import
import AdminDashboard from "@/components/admin/AdminDashboard";
import VotesChart from "@/components/admin/VotesChart";
import VotersTable from "@/components/admin/VotersTable";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminPage() {
    const supabase = createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) notFound();

    // Admin Check
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        notFound();
    }

    // Parallel Fetching: Settings, Stats, Results, Categories
    const [settings, stats, results, categories] = await Promise.all([
        getSettings(),
        getAdminStats(),
        getResults(),       // [NEW]
        getCategories(),    // [NEW]
    ]);

    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
            {/* Header */}
            <header className="pt-20 pb-10 px-6 md:px-10 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-alt mb-2">
                            K&K Admin
                        </p>
                        <h1 className="text-3xl md:text-4xl font-alt text-white">
                            Панель керування
                        </h1>
                    </div>
                    <Link href="/" className="px-4 py-2 rounded-full border border-zinc-700 text-xs uppercase hover:bg-zinc-800 transition">
                        На сайт →
                    </Link>
                </div>
            </header>

            <div className="px-6 mt-12 mx-auto max-w-7xl space-y-12">

                {/* 1. Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Votes Card */}
                    <div className="bg-zinc-800/50 p-6 rounded-3xl border border-zinc-700/50">
                        <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">
                            Проголосувало людей
                        </p>
                        <p className="text-5xl font-alt text-white">
                            {stats.totalVoters}
                        </p>
                        <div className="mt-4 text-xs text-zinc-500">
                            *1 голос = участь у всіх категоріях
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="md:col-span-2 bg-zinc-800/50 p-6 rounded-3xl border border-zinc-700/50">
                        <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">
                            Активність голосування (по годинах)
                        </p>
                        <VotesChart data={stats.chartData} />
                    </div>
                </div>

                {/* [NEW] 1.5 Live Results Section */}
                <section>
                    <h2 className="text-2xl font-alt text-white mb-6">Поточні результати (Live)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map((cat) => {
                            // Filter candidates for this category and Sort by Votes DESC
                            const catResults = results
                                .filter((r) => r.categoryId === cat.id)
                                .sort((a, b) => b.votes - a.votes);

                            const totalCategoryVotes = catResults.reduce((acc, curr) => acc + curr.votes, 0);

                            return (
                                <div key={cat.id} className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-5">
                                    {/* Category Title */}
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-700/50">
                                        <h3 className="font-alt text-lg text-zinc-200">{cat.title}</h3>
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider">
                                            {totalCategoryVotes} голосів
                                        </span>
                                    </div>

                                    {/* Compact Candidate List */}
                                    <div className="space-y-3">
                                        {catResults.map((candidate, index) => {
                                            const percent = totalCategoryVotes > 0
                                                ? Math.round((candidate.votes / totalCategoryVotes) * 100)
                                                : 0;

                                            // Highlight winner
                                            const isLeader = index === 0 && candidate.votes > 0;

                                            return (
                                                <div key={candidate.candidateId} className="flex items-center gap-3">
                                                    {/* Rank */}
                                                    <div className={`w-5 text-center text-xs font-mono font-bold ${isLeader ? 'text-amber-500' : 'text-zinc-600'}`}>
                                                        {index + 1}
                                                    </div>

                                                    {/* Name & Bar */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className={`truncate pr-2 ${isLeader ? 'text-white font-medium' : 'text-zinc-400'}`}>
                                                                {candidate.candidateName}
                                                            </span>
                                                            <span className="text-zinc-500 font-mono">
                                                                {candidate.votes} ({percent}%)
                                                            </span>
                                                        </div>
                                                        {/* Simple Bar */}
                                                        <div className="h-1.5 w-full bg-zinc-700/30 rounded-full overflow-hidden">
                                                            <div
                                                                style={{ width: `${percent}%` }}
                                                                className={`h-full rounded-full transition-all ${isLeader ? 'bg-amber-500' : 'bg-zinc-600'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {catResults.length === 0 && (
                                            <p className="text-sm text-zinc-500 italic">Немає кандидатів</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Settings Form */}
                <section>
                    <h2 className="text-2xl font-alt text-white mb-6">Налаштування</h2>
                    <AdminDashboard settings={settings} />
                </section>

                {/* 3. Voters Table */}
                <section>
                    <h2 className="text-2xl font-alt text-white mb-6">Журнал голосувань</h2>
                    <VotersTable voters={stats.tableData} />
                </section>
            </div>
        </main>
    );
}