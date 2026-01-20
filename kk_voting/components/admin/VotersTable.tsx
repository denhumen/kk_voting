"use client";

import { useState } from "react";
import type { VoterRow } from "@/app/lib/db/admin-stats";

export default function VotersTable({ voters }: { voters: VoterRow[] }) {
    const [search, setSearch] = useState("");

    const filtered = voters.filter((v) => {
        const term = search.toLowerCase();
        const name = v.full_name?.toLowerCase() || "";
        const email = v.email.toLowerCase();
        return name.includes(term) || email.includes(term);
    });

    // Extract all unique categories to build table headers dynamically
    const allCategories = Array.from(
        new Set(voters.flatMap((v) => Object.keys(v.choices)))
    );

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Пошук за поштою або іменем..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                />
                <div className="absolute right-4 top-3.5 text-zinc-500">🔍</div>
            </div>

            <div className="rounded-xl border border-zinc-700/50 overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-800 text-zinc-200 uppercase font-alt text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Студент</th>
                        <th className="px-6 py-4">Час</th>
                        {allCategories.map((cat) => (
                            <th key={cat} className="px-6 py-4 min-w-[150px]">{cat}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {filtered.map((voter) => (
                        <tr key={voter.voter_id} className="hover:bg-zinc-800/30 transition">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                                        {voter.full_name ? voter.full_name[0] : voter.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-zinc-100 font-medium">
                                            {voter.full_name || "Невідомий"}
                                        </div>
                                        <div className="text-xs text-zinc-500">{voter.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">
                                {new Date(voter.voted_at).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}
                            </td>

                            {/* Dynamic Choice Columns */}
                            {allCategories.map((cat) => (
                                <td key={cat} className="px-6 py-4">
                                    {voter.choices[cat] ? (
                                        <span className="text-zinc-200 bg-zinc-800 px-2 py-1 rounded text-xs border border-zinc-700">
                            {voter.choices[cat]}
                        </span>
                                    ) : (
                                        <span className="text-zinc-600">-</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={allCategories.length + 2} className="px-6 py-8 text-center text-zinc-500">
                                Нікого не знайдено
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="text-right text-xs text-zinc-600">
                Показано {filtered.length} з {voters.length} виборців
            </div>
        </div>
    );
}