"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VotesChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="h-64 flex items-center justify-center text-zinc-500">Немає даних для графіку</div>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

                    <XAxis
                        dataKey="time" // Shows "14:00"
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#27272a', opacity: 0.4 }} // Highlight the column on hover
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
                                        <p className="text-zinc-400 text-xs mb-1">{payload[0].payload.fullDate}</p>
                                        <p className="text-amber-500 font-bold text-lg">
                                            {payload[0].value} <span className="text-xs font-normal text-zinc-500">голосів</span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar
                        dataKey="votes"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}