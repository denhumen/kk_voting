"use client";

import Link from "next/link";
import Image from "next/image";

function getCategoryStyle(title: string) {
    if (title.includes("Академ")) return { emoji: "🎓", badge: "bg-blue-500/10 border-blue-400/30 text-blue-200" };
    if (title.includes("військ")) return { emoji: "🫡", badge: "bg-amber-500/10 border-amber-400/30 text-amber-200" };
    if (title.includes("Соці")) return { emoji: "🤝", badge: "bg-emerald-500/10 border-emerald-400/30 text-emerald-200" };
    if (title.includes("Культур")) return { emoji: "🎭", badge: "bg-fuchsia-500/10 border-fuchsia-400/30 text-fuchsia-200" };
    return { emoji: "👑", badge: "bg-zinc-500/10 border-zinc-400/30 text-zinc-200" };
}

function getOptimizedUrl(url: string | null, width: number) {
    if (!url) return null;
    if (url.includes("supabase.co")) {
        return `${url}?width=${width}&resize=contain&quality=75`;
    }
    return url;
}

export default function CandidateCard({
                                          id,
                                          name,
                                          city,
                                          shortDescription,
                                          photoUrl,
                                          featured = false,
                                          categoryTitle,
                                      }: {
    id: string;
    name: string;
    city: string;
    shortDescription: string;
    photoUrl: string | null;
    featured?: boolean;
    categoryTitle: string;
}) {
    const cat = getCategoryStyle(categoryTitle);

    return (
        <article
            className={[
                "group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 shadow-lg w-full flex flex-col",
                "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
            ].join(" ")}
        >
            <div className={featured ? "flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr]" : "flex flex-col"}>
                {/* PHOTO */}
                <div
                    className={[
                        "relative overflow-hidden bg-zinc-800",
                        featured
                            ? "aspect-[4/3] md:aspect-auto md:min-h-[360px]"
                            : "aspect-[3/4]"
                    ].join(" ")}
                >
                    {photoUrl && (
                        <>
                            {featured && (
                                <Image
                                    src={photoUrl}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    aria-hidden
                                    className="object-cover scale-110 blur-2xl opacity-40 z-[0]"
                                />
                            )}
                            <Image
                                src={photoUrl}
                                alt={name}
                                fill // Replaces width/height/relative
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className={[
                                    "transition-transform duration-300 z-10", // z-10 ensures it sits above the blur
                                    featured
                                        ? "object-contain group-hover:scale-[1.05]"
                                        : "object-cover group-hover:scale-[1.05]",
                                ].join(" ")}
                            />
                        </>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badge (Mobile) */}
                    <div className="sm:hidden absolute left-4 top-4 z-10">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-alt uppercase tracking-wide text-white shadow-lg">
                          <span className="text-base leading-none">{cat.emoji}</span>
                            {categoryTitle}
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                        <p className="text-xs uppercase tracking-wide text-white/70">
                            {city}
                        </p>
                        <h3
                            className={[
                                "font-alt font-semibold text-white",
                                featured ? "text-2xl md:text-3xl" : "text-xl",
                            ].join(" ")}
                        >
                            {name}
                        </h3>
                    </div>
                </div>

                {/* TEXT */}
                <div className={["p-6 flex flex-col", featured ? "md:p-8 justify-between" : ""].join(" ")}>
                    <div>
                        <p className="text-xs font-alt uppercase tracking-[0.35em] text-zinc-400">
                            Номінант
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-zinc-300 font-main">
                            {shortDescription}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4">
                        <span className="text-xs text-zinc-500"></span>
                        <Link
                            href={`/candidates/${id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 px-4 py-2 text-xs font-alt uppercase tracking-wide hover:bg-white transition"
                        >
                            Детальніше
                            <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}