"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
    const supabase = createClient(cookies());

    // 1. Auth & Role Check (Same as before)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        throw new Error("Forbidden");
    }

    // 2. Prepare Data
    const voting_start = formData.get("voting_start") as string;
    const voting_end = formData.get("voting_end") as string;
    const results_date = formData.get("results_date") as string; // [NEW]

    const updates = {
        voting_open: formData.get("voting_open") === "on",
        results_public: formData.get("results_public") === "on",
        voting_start: voting_start ? new Date(voting_start).toISOString() : null,
        voting_end: voting_end ? new Date(voting_end).toISOString() : null,
        results_date: results_date ? new Date(results_date).toISOString() : null, // [NEW]
    };

    // 3. Update Database
    const { error } = await supabase
        .from("settings")
        .update(updates)
        .eq("id", 1);

    if (error) throw new Error("Failed to update settings");

    revalidatePath("/");
    revalidatePath("/vote");
    revalidatePath("/results");
    revalidatePath("/admin");

    return { success: true };
}