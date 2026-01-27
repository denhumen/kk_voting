import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type VoterRow = {
    voter_id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    voted_at: string;
    choices: Record<string, string>;
};

// Update ChartData type
export type ChartData = {
    label: string; // Changed from 'time' to 'label' for clarity
    votes: number;
    originalTime: number;
    fullDate: string;
};

export async function getAdminStats() {
    const supabase = createClient(cookies());

    // 1. Fetch ALL votes with increased range limit
    // Supabase defaults to 1000 rows. We increase it to 10,000 to cover all votes.
    const { data: rawVotes, error } = await supabase
        .from("votes")
        .select(`
            created_at,
            voter_id,
            profiles ( email, full_name ), 
            candidates ( full_name ),
            categories ( title )
        `)
        .range(0, 9999); // <--- THIS FIXES THE 250 VS 273 ISSUE

    if (error) {
        console.error("Admin Stats Error:", error);
        return { totalVoters: 0, chartData: [], tableData: [] };
    }

    if (!rawVotes || rawVotes.length === 0) {
        return { totalVoters: 0, chartData: [], tableData: [] };
    }

    // --------------------------------------------------------------------------
    // PROCESS DATA
    // --------------------------------------------------------------------------

    const votersMap = new Map<string, VoterRow>();
    const votesByHour = new Map<string, Set<string>>();

    // Helper to bucket dates like "22.01 14:00"
    const getHourlyBucket = (isoString: string) => {
        const date = new Date(isoString);

        // Manual formatting to ensure consistent grouping across days
        const day = date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", day: "2-digit" });
        const month = date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", month: "2-digit" });
        const hour = date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", hour: "2-digit", hour12: false });

        // returns "22.01 14:00"
        return `${day}.${month} ${hour}:00`;
    };

    rawVotes.forEach((row: any) => {
        const voterId = row.voter_id;

        // 1. Chart Data
        const timeLabel = getHourlyBucket(row.created_at);

        if (!votesByHour.has(timeLabel)) {
            votesByHour.set(timeLabel, new Set());
        }
        votesByHour.get(timeLabel)?.add(voterId);

        // 2. Table Data
        if (!votersMap.has(voterId)) {
            const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

            votersMap.set(voterId, {
                voter_id: voterId,
                email: profile?.email || "No Email",
                full_name: profile?.full_name || null,
                avatar_url: null,
                voted_at: row.created_at,
                choices: {}
            });
        }

        const voter = votersMap.get(voterId)!;
        const categoryTitle = Array.isArray(row.categories) ? row.categories[0]?.title : row.categories?.title;
        const candidateName = Array.isArray(row.candidates) ? row.candidates[0]?.full_name : row.candidates?.full_name;

        if (categoryTitle && candidateName) {
            voter.choices[categoryTitle] = candidateName;
        }
    });

    const totalVoters = votersMap.size;

    // 3. Process Chart Data
    const chartData = Array.from(votesByHour.entries()).map(([timeLabel, set]) => {
        // timeLabel is "22.01 14:00"

        // Construct a Sortable Date object
        const [dayMonth, timeStr] = timeLabel.split(" ");
        const [day, month] = dayMonth.split(".");
        const currentYear = new Date().getFullYear();

        // ISO string for sorting: "2026-01-22T14:00:00"
        const isoLike = `${currentYear}-${month}-${day}T${timeStr}:00`;

        return {
            label: timeLabel, // Display on X-Axis (e.g., "22.01 14:00")
            votes: set.size,
            fullDate: timeLabel,
            originalTime: new Date(isoLike).getTime()
        };
    }).sort((a, b) => a.originalTime - b.originalTime);

    const tableData = Array.from(votersMap.values()).sort(
        (a, b) => new Date(b.voted_at).getTime() - new Date(a.voted_at).getTime()
    );

    return { totalVoters, chartData, tableData };
}