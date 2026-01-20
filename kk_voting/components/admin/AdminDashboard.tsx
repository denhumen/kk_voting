"use client";

import { useTransition } from "react";
import { updateSettings } from "@/app/actions/admin";
import { toast } from "sonner";

type Settings = {
    voting_open: boolean;
    results_public: boolean;
    voting_start: string | null;
    voting_end: string | null;
    results_date: string | null; // [NEW]
};

// Helper to format ISO date to "YYYY-MM-DDTHH:MM"
function toLocalInputValue(isoString: string | null) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localISOTime = new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
    return localISOTime;
}

export default function AdminDashboard({ settings }: { settings: Settings }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            try {
                await updateSettings(formData);
                toast.success("Налаштування збережено!");
            } catch (e) {
                toast.error("Помилка збереження.");
            }
        });
    };

    return (
        <form action={handleSubmit} className="space-y-8 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">

            {/* Toggles (Unchanged) */}
            <div className="space-y-4">
                <h2 className="text-xl font-alt text-white">Основні перемикачі</h2>
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div>
                        <label htmlFor="voting_open" className="font-semibold text-zinc-200 block">
                            Відкрити голосування
                        </label>
                        <p className="text-xs text-zinc-500">Global kill-switch.</p>
                    </div>
                    <input id="voting_open" name="voting_open" type="checkbox" defaultChecked={settings.voting_open} className="h-6 w-6 accent-amber-500 cursor-pointer"/>
                </div>
            </div>

            <hr className="border-zinc-800" />

            {/* Dates Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-alt text-white">Таймери (Timers)</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Початок голосування</label>
                        <input
                            type="datetime-local"
                            name="voting_start"
                            defaultValue={toLocalInputValue(settings.voting_start)}
                            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Кінець голосування</label>
                        <input
                            type="datetime-local"
                            name="voting_end"
                            defaultValue={toLocalInputValue(settings.voting_end)}
                            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* [NEW] Results Date Input */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-amber-500">Дата відкриття результатів</label>
                        <p className="text-xs text-zinc-500 mb-2">Сторінка результатів буде заблокована таймером до цього моменту.</p>
                        <input
                            type="datetime-local"
                            name="results_date"
                            defaultValue={toLocalInputValue(settings.results_date)}
                            className="w-full bg-black border border-amber-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button disabled={isPending} className="w-full rounded-full py-4 bg-amber-500 text-black font-alt font-bold uppercase hover:bg-amber-400">
                    {isPending ? "Збереження..." : "Зберегти налаштування"}
                </button>
            </div>
        </form>
    );
}