"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();

            if (difference <= 0) return null;

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        // Calculate immediately
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            const left = calculateTimeLeft();
            if (!left) {
                clearInterval(timer);
                window.location.reload(); // Reload page when timer hits 0 to show voting UI
            }
            setTimeLeft(left);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex gap-4 justify-center text-zinc-100 font-mono">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-bold bg-zinc-800 rounded-lg p-3 min-w-[70px] md:min-w-[90px]">
            {String(value).padStart(2, "0")}
          </span>
                    <span className="text-xs uppercase text-zinc-500 mt-2 tracking-widest">
            {unit === "days" ? "Днів" :
                unit === "hours" ? "Год" :
                    unit === "minutes" ? "Хв" : "Сек"}
          </span>
                </div>
            ))}
        </div>
    );
}