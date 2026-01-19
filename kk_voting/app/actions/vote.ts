"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function castVote(categoryId: string, candidateId: string) {
    const supabase = createClient(cookies());

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email?.endsWith("@ucu.edu.ua")) {
        throw new Error("Unauthorized");
    }

    // 2. Settings Check
    const { data: settings } = await supabase.from("settings").select("voting_open").single();
    if (!settings?.voting_open) {
        throw new Error("Voting is currently closed");
    }

    // 3. Cast Vote (Upsert)
    // This relies on the UNIQUE INDEX (voter_id, category_id) we created earlier
    const { error } = await supabase
        .from("votes")
        .upsert(
            {
                voter_id: user.id,
                category_id: categoryId,
                candidate_id: candidateId,
                // created_at will be auto-handled if you set default: now() in DB,
                // otherwise pass new Date().toISOString()
            },
            { onConflict: "voter_id, category_id" }
        );

    if (error) {
        console.error("Vote failed:", error);
        throw new Error("Failed to save vote");
    }

    // 4. Update UI
    revalidatePath("/vote");
    return { success: true };
}