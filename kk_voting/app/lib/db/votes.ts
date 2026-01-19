import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getUserVotes(userId: string) {
    const supabase = createClient(cookies());

    const { data } = await supabase
        .from("votes")
        .select("category_id, candidate_id")
        .eq("voter_id", userId);

    const votesMap: Record<string, string> = {};

    if (data) {
        data.forEach((vote) => {
            votesMap[vote.category_id] = vote.candidate_id;
        });
    }

    return votesMap;
}