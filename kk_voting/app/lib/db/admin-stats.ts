import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type VoterRow = {
    voter_id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null; // We keep this in the type, but will always be null
    voted_at: string;
    choices: Record<string, string>;
};

export type ChartData = {
    time: string;
    votes: number;
    originalTime: number;
};

export async function getAdminStats() {
    const supabase = createClient(cookies());

    // 1. Fetch ALL votes (REMOVED 'avatar_url' from the query)
    const { data: rawVotes, error } = await supabase
        .from("votes")
        .select(`
      created_at,
      voter_id,
      profiles ( email, full_name ), 
      candidates ( full_name ),
      categories ( title )
    `);

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

    const getHourlyBucket = (isoString: string) => {
        const date = new Date(isoString);
        // Format to "22.01 14:00" explicitly
        const uaDate = date.toLocaleString("uk-UA", {
            timeZone: "Europe/Kyiv",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            hour12: false
        });
        // uaDate might look like "22.01, 14", so we append ":00" manually
        // or cleaner: just take the hour part.
        // Let's use a robust standard format "DD.MM HH:00"

        const day = date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", day: "2-digit" });
        const month = date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", month: "2-digit" });
        const hour = date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv", hour: "2-digit", hour12: false });

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
                avatar_url: null, // Hardcoded to null to prevent crash
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

    // 3. Output
    const totalVoters = votersMap.size;

    const chartData = Array.from(votesByHour.entries()).map(([time, set]) => {
        const [dayMonth, timeStr] = time.split(" ");
        const [day, month] = dayMonth.split(".");
        const currentYear = new Date().getFullYear();
        const isoLike = `${currentYear}-${month}-${day}T${timeStr}:00`;

        return {
            time: timeStr,
            fullDate: time,
            votes: set.size,
            originalTime: new Date(isoLike).getTime()
        };
    }).sort((a, b) => a.originalTime - b.originalTime);

    const tableData = Array.from(votersMap.values()).sort(
        (a, b) => new Date(b.voted_at).getTime() - new Date(a.voted_at).getTime()
    );

    return { totalVoters, chartData, tableData };
}