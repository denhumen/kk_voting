"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitVotes(votes: Record<string, string>) {
    const supabase = createClient(cookies());

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email?.endsWith("@ucu.edu.ua")) {
        throw new Error("Unauthorized");
    }

    // 2. Settings Check
    const { data: settings } = await supabase.from("settings").select("voting_open").single();
    if (!settings?.voting_open) {
        throw new Error("Voting is closed");
    }

    // 3. FIX: Ensure Profile Exists
    // We upsert the profile to satisfy the Foreign Key constraint on 'votes.voter_id'
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
            {
                id: user.id,
                email: user.email,
                role: "student", // Default role
                // updated_at: new Date().toISOString() // optional if you have this column
            },
            { onConflict: "id", ignoreDuplicates: true } // Don't overwrite if exists
        );

    if (profileError) {
        console.error("Profile creation failed:", profileError);
        // We continue anyway; sometimes triggers handle this, but explicit upsert is safer.
    }

    // 4. Prepare Data
    const voteRows = Object.entries(votes).map(([categoryId, candidateId]) => ({
        voter_id: user.id,
        category_id: categoryId,
        candidate_id: candidateId,
        created_at: new Date().toISOString(),
    }));

    if (voteRows.length === 0) return { success: false, message: "No votes selected" };

    // 5. Bulk Insert
    const { error } = await supabase.from("votes").insert(voteRows);

    if (error) {
        if (error.code === '23505') {
            return { success: false, message: "Ви вже голосували!" };
        }
        console.error("Bulk vote failed:", error);
        throw new Error("Failed to save votes");
    }

    revalidatePath("/vote");
    return { success: true };
}