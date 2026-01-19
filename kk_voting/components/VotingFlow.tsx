"use client";

import { useState, useTransition } from "react";
import VotingCard from "./VotingCard";
import { submitVotes } from "@/app/actions/submit-votes";

type VotingFlowProps = {
    categories: any[];
    candidates: any[];
    initialUserVotes: Record<string, string>;
};

export default function VotingFlow({ categories, candidates, initialUserVotes }: VotingFlowProps) {
    const [selections, setSelections] = useState<Record<string, string>>(initialUserVotes);
    const [isPending, startTransition] = useTransition();

    const hasAlreadySubmitted = Object.keys(initialUserVotes).length > 0;

    // Select Logic
    const handleSelect = (categoryId: string, candidateId: string) => {
        if (hasAlreadySubmitted) return;
        setSelections((prev) => ({
            ...prev,
            [categoryId]: candidateId,
        }));
    };

    // Retract Logic (New)
    const handleRetract = (categoryId: string) => {
        if (hasAlreadySubmitted) return;
        setSelections((prev) => {
            const next = { ...prev };
            delete next[categoryId];
            return next;
        });
    };

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const result = await submitVotes(selections);
                if (!result.success) {
                    alert(result.message);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (e) {
                alert("Помилка при відправці голосів. Спробуйте ще раз.");
            }
        });
    };

    const selectedCount = Object.keys(selections).length;
    const totalCategories = categories.length;
    const isReadyToSubmit = selectedCount === totalCategories;

    return (
        <>
            <div className="px-6 md:px-10 mt-12 mx-auto max-w-6xl space-y-24">
                {categories.map((cat) => {
                    const catCandidates = candidates.filter((c) => c.category_id === cat.id);
                    const currentSelection = selections[cat.id];

                    return (
                        <section key={cat.id} className="scroll-mt-32" id={cat.id}>
                            {/* Header with Retract Button */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl border transition-colors
                        ${currentSelection
                                        ? "bg-amber-500/20 border-amber-500/50 text-amber-200"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                                    }
                    `}>
                                        {cat.title.includes("Академ") ? "🎓" : cat.title.includes("військ") ? "🫡" : cat.title.includes("Соці") ? "🤝" : cat.title.includes("Культур") ? "🎭" : "👑"}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-alt text-zinc-100">{cat.title}</h2>
                                        <p className="text-sm text-zinc-500">
                                            {currentSelection
                                                ? "Кандидата обрано"
                                                : "Оберіть одного кандидата"}
                                        </p>
                                    </div>
                                </div>

                                {/* Retract Button (Only visible if selected & not submitted) */}
                                {currentSelection && !hasAlreadySubmitted && (
                                    <button
                                        onClick={() => handleRetract(cat.id)}
                                        className="text-xs text-red-400 hover:text-red-300 underline font-main transition-colors"
                                    >
                                        Скасувати вибір
                                    </button>
                                )}
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {catCandidates.map((candidate) => (
                                    <VotingCard
                                        key={candidate.id}
                                        candidate={candidate}
                                        isSelected={currentSelection === candidate.id}
                                        onSelect={() => handleSelect(cat.id, candidate.id)}
                                        disabled={hasAlreadySubmitted || isPending}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Floating Action Bar (Responsive) */}
            <div className="fixed bottom-6 right-6 left-6 z-50 flex flex-col md:flex-row items-end md:items-center justify-end gap-3 pointer-events-none">

                {/* Container for buttons (Pointer events auto to allow clicking) */}
                <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto pointer-events-auto">
                    {/* Counter Badge (Separated on Mobile) */}
                    <div className="
                flex items-center justify-center gap-2 px-6 py-3 md:py-4
                bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-700 shadow-xl
                w-full md:w-auto
            ">
                        <span className="text-zinc-400 text-xs font-alt uppercase tracking-wider">Обрано:</span>
                        <span className={`font-mono font-bold text-lg ${isReadyToSubmit ? "text-green-400" : "text-white"}`}>
                    {selectedCount}<span className="text-zinc-600 mx-0.5">/</span>{totalCategories}
                </span>
                    </div>

                    {/* Submit Button (Separated on Mobile) */}
                    {!hasAlreadySubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isReadyToSubmit || isPending}
                            className={`
                        w-full md:w-auto
                        px-8 py-3 md:py-4 rounded-full font-alt uppercase text-sm tracking-widest font-bold transition-all duration-300
                        flex items-center justify-center
                        ${isReadyToSubmit
                                ? "bg-amber-500 text-black hover:scale-105 hover:bg-amber-400 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] cursor-pointer"
                                : "bg-zinc-800 text-zinc-600 cursor-not-allowed grayscale"
                            }
                    `}
                        >
                            {isPending ? "Відправка..." : "Проголосувати"}
                        </button>
                    ) : (
                        <div className="w-full md:w-auto px-6 py-3 md:py-4 bg-green-500 text-black rounded-full font-alt uppercase text-sm font-bold tracking-widest flex items-center justify-center gap-2 shadow-xl">
                            <span>Голос зараховано</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}