import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type Settings = {
    voting_open: boolean;
    submission_open: boolean;
    results_public: boolean;
    voting_start: string | null; // ISO Date String
    voting_end: string | null;   // ISO Date String
    results_date: string | null; // [NEW] ISO Date String
};

export async function getSettings() {
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from("settings").select("*").single();

    if (error || !data) {
        return {
            voting_open: false,
            submission_open: false,
            results_public: false,
            voting_start: null,
            voting_end: null,
            results_date: null // [NEW] Default
        } as Settings;
    }
    return data as Settings;
}