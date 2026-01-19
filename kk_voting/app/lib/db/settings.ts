import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getSettings() {
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from("settings").select("*").single();

    if (error || !data) {
        return {
            voting_open: false,
            submission_open: false,
            results_public: false
        };
    }
    return data;
}