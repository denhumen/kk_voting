import Link from "next/link";
import { notFound } from "next/navigation";
import { getCandidateById, getCategories } from "@/app/lib/db/candidates";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { useEffect } from "react";
import CandidateLinksToast from "@/components/CandidateLinksToast";

export const revalidate = 60;

function formatCategoryEmoji(title: string) {
  if (title.includes("Академ")) return "🎓";
  if (title.includes("військ")) return "🫡";
  if (title.includes("Соці")) return "🤝";
  if (title.includes("Культур")) return "🎭";
  return "👑";
}

function hasUrl(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  return urlRegex.test(text);
}

function CandidatePhotoCard({
  photoUrl,
  alt,
  city,
  isWide,
}: {
  photoUrl: string | null;
  alt: string;
  city: string;
  isWide: boolean;
}) {
  if (!photoUrl) return null;

  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/30 shadow-xl">
      <div
        className={[
          "relative overflow-hidden",
          isWide ? "aspect-video sm:aspect-[16/8]" : "aspect-[3/4]",
        ].join(" ")}
      >
        {/* blurred background fill */}
        <img
          src={photoUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-50"
        />

        {/* main image (no cropping) */}
        <img
          src={photoUrl}
          alt={alt}
          className="relative z-10 h-full w-full object-contain"
        />

        {/* readable overlay for text */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 z-30">
          <p className="text-xs uppercase tracking-wide text-white/80">Місто</p>
          <p className="text-xl font-alt text-white">{city}</p>
        </div>
      </div>
    </div>
  );
}

export default async function CandidateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const candidate = await getCandidateById(id);
  if (!candidate) return notFound();

  const categories = await getCategories();
  const categoryTitle =
    categories.find((x) => x.id === candidate.category_id)?.title ?? "Номінація";

  const emoji = formatCategoryEmoji(categoryTitle);
  const containsLinks = hasUrl(candidate.long_description);
  const isWide = !!candidate.is_wide;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* HERO */}
      <CandidateLinksToast show={containsLinks} toastId={id}/>
      <section className="relative overflow-hidden px-6 pt-10 pb-12 md:px-10">
        {/* glow */}
        <div className="pointer-events-none absolute -inset-24 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_60%)]" />
        {/* watermark chess */}
        <div className="pointer-events-none absolute -right-10 -top-6 hidden md:block opacity-[0.08] blur-[0.3px]">
          <img src="/chess/quene_black.png" alt="" className="h-[420px] w-auto" />
        </div>

        <div className="mt-10 relative mx-auto max-w-6xl">
          {/* breadcrumb row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/candidates"
              className="rounded-full border border-zinc-700 bg-zinc-900/40 px-5 py-2 text-sm font-alt uppercase hover:border-zinc-400 transition"
            >
              ← До кандидатів
            </Link>

            <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-300 font-alt uppercase tracking-[0.35em]">
              <span className="text-base">{emoji}</span>
              <span className="opacity-80">{categoryTitle}</span>
            </div>
          </div>

          <h1 className="mt-8 text-4xl md:text-6xl font-alt leading-tight">
            {candidate.full_name}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-200/90 text-base md:text-lg leading-relaxed font-main">
            {candidate.short_description}
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="px-6 pb-16 md:px-10 mt-5">
      <div
        className={[
          "mx-auto max-w-6xl gap-10",
          isWide
            ? "flex flex-col"
            : "grid grid-cols-1 lg:grid-cols-[380px_1fr]",
        ].join(" ")}
      >
          {/* LEFT: PHOTO CARD */}
          {isWide && (
            <div>
              <CandidatePhotoCard
                photoUrl={candidate.photo_url}
                alt={candidate.full_name}
                city={candidate.city}
                isWide={true}
              />
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 font-main">
                  {emoji} {categoryTitle}
                </span>
                <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 font-main">
                  Профіль кандидата
                </span>
              </div>
            </div>
          )}

          {!isWide && (
            <aside className="relative">
              <CandidatePhotoCard
                photoUrl={candidate.photo_url}
                alt={candidate.full_name}
                city={candidate.city}
                isWide={false}
              />

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 font-main">
                  {emoji} {categoryTitle}
                </span>
                <span className="rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 font-main">
                  Профіль кандидата
                </span>
              </div>
            </aside>
          )}

          {/* RIGHT: DETAILS */}
          <div>
            {/* Full info block */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 md:p-8 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg md:text-xl font-alt">Історія кандидата</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}
                               components={{
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline hover:text-blue-300 transition"
                                  />
                                ),
                              }}>
                  {candidate.long_description}
                </ReactMarkdown>
              </div>

            </div>

            {/* Voting callout */}
            <div className="mt-8 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 p-6 md:p-8">
              <h3 className="text-lg font-alt">Голосування скоро</h3>
              <p className="mt-2 text-sm md:text-base text-zinc-200/80 font-main leading-relaxed">
                Щоб проголосувати, потрібен вхід через Google. Доступ буде лише для
                акаунтів <span className="font-semibold">@ucu.edu.ua</span>.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-zinc-200/80 font-main">
                <li className="flex gap-2">
                  <span className="text-zinc-300">•</span> Один студент — один голос у кожній номінації
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-300">•</span> Результати зʼявляться на окремій сторінці
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-300">•</span> Старт оголосимо в соцмережах та розсилці
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  disabled
                  className="rounded-full bg-zinc-100 text-zinc-900 px-5 py-2 text-sm font-alt font-semibold uppercase opacity-60 cursor-not-allowed"
                >
                  Проголосувати (скоро)
                </button>

                <button
                  disabled
                  className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-alt uppercase text-zinc-100 opacity-60 cursor-not-allowed"
                >
                  Результати (скоро)
                </button>

                <Link
                  href="/details"
                  className="rounded-full border border-zinc-700 bg-zinc-900/30 px-5 py-2 text-sm font-alt uppercase hover:border-zinc-400 transition"
                >
                  Подивитись таймлайн
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
