"use client";

type VotingCardProps = {
    candidate: {
        id: string;
        full_name: string;
        photo_url: string | null;
        short_description: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    disabled: boolean; // True only if voting is completely finished
};

export default function VotingCard({
                                       candidate,
                                       isSelected,
                                       onSelect,
                                       disabled,
                                   }: VotingCardProps) {

    return (
        <div
            onClick={() => !disabled && onSelect()}
            className={`
        relative group cursor-pointer 
        overflow-hidden rounded-2xl border transition-all duration-300
        ${isSelected
                ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] ring-1 ring-amber-500/50 scale-[1.02]"
                : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-800/60"
            }
        ${disabled ? "opacity-50 pointer-events-none grayscale" : ""}
      `}
        >
            {/* Selection Checkmark */}
            {isSelected && (
                <div className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg animate-in zoom-in duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
            )}

            {/* Image */}
            <div className="aspect-[4/5] w-full relative overflow-hidden">
                {candidate.photo_url ? (
                    <img
                        src={candidate.photo_url}
                        alt={candidate.full_name}
                        className={`
              h-full w-full object-cover transition-transform duration-500
              ${isSelected ? "scale-105 sepia-[.2]" : "group-hover:scale-105 grayscale"}
            `}
                    />
                ) : (
                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                        No Photo
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className={`font-alt text-lg leading-tight transition-colors ${isSelected ? "text-amber-100" : "text-zinc-100"}`}>
                        {candidate.full_name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                        {candidate.short_description}
                    </p>
                </div>
            </div>

            {/* Mobile-friendly Button Area */}
            <div className="p-4 border-t border-white/5">
                <button className={`
            w-full rounded-full py-2 text-xs font-alt uppercase tracking-widest transition-colors
            ${isSelected ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-zinc-400"}
         `}>
                    {isSelected ? "Обрано" : "Обрати"}
                </button>
            </div>
        </div>
    );
}