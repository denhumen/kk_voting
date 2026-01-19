import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getCandidates } from "./candidates";

export type ResultItem = {
    candidateId: string;
    candidateName: string;
    candidatePhoto: string | null;
    categoryId: string;
    votes: number;
};

export async function getResults() {
    const supabase = createClient(cookies());

    // 1. Fetch Candidates and Counts in parallel
    const [candidates, votesResponse] = await Promise.all([
        getCandidates(),
        supabase.from("vote_counts").select("*"),
    ]);

    const voteCounts = votesResponse.data || [];

    // 2. Map counts to candidates
    const results: ResultItem[] = candidates.map((c) => {
        const countRecord = voteCounts.find(
            (v) => v.category_id === c.category_id && v.candidate_id === c.id
        );
        return {
            candidateId: c.id,
            candidateName: c.full_name,
            candidatePhoto: c.photo_url,
            categoryId: c.category_id,
            votes: countRecord?.total_votes || 0,
        };
    });

    return results;
}