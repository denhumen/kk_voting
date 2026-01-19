import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

function isUcuEmail(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase().endsWith("@ucu.edu.ua");
}

export default async function ResultsPage() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // not logged in
  if (!user) redirect("/login");

  const email = user.email;

  // logged in but not UCU email
  if (!isUcuEmail(email)) {
    return (
      <main className="min-h-screen bg-zinc-900 text-zinc-50 flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur p-8">
          <p
            className="uppercase text-xs text-zinc-400 font-alt"
            style={{ letterSpacing: "0.35em" }}
          >
            Королі та Королеви · УКУ
          </p>

          <h1 className="mt-3 text-3xl font-alt">Доступ обмежено</h1>

          <p className="mt-4 text-zinc-300 font-main leading-relaxed">
            Результати доступні лише для акаунтів{" "}
            <span className="font-semibold">@ucu.edu.ua</span>.
            <br />
            Ти увійшов як: <span className="font-semibold">{email}</span>
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <form action="/auth/logout" method="post">
              <button className="rounded-full bg-zinc-100 text-zinc-900 px-6 py-3 text-sm font-alt font-semibold uppercase hover:bg-white transition">
                Вийти
              </button>
            </form>

            <Link
              href="/"
              className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-alt uppercase hover:border-zinc-300 transition"
            >
              На головну
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ✅ allowed
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-50 px-6 py-12 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className="uppercase text-xs text-zinc-400 font-alt"
              style={{ letterSpacing: "0.35em" }}
            >
              Королі та Королеви · УКУ
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-alt">Результати</h1>
            <p className="mt-3 text-zinc-300 font-main">
              Тут ви зовсім скоро зможете побачити результати голосування!
            </p>
          </div>
        </div>

        {/* PARTNER BANNER */}
        <div className="relative mt-12">
          <div className="
            mx-auto max-w-6xl
            rounded-2xl
            border border-zinc-700/60
            bg-zinc-900/60
            backdrop-blur
            px-6 py-5
            flex flex-col
            items-center justify-center
            gap-2
            shadow-lg
          ">
            <span className="
              text-xs text-center uppercase tracking-[0.35em]
              font-alt text-zinc-400
            ">
              Генеральний партнер події
            </span>

            <a href="https://www.work.ua/">
              <img
                src="/logos/workua_white.png"
                alt="Work.ua"
                className="
                  h-20
                  object-contain
                  opacity-90
                  hover:opacity-100
                  transition
                "
              />
            </a>
          </div>
        </div>

        {/* Placeholder results UI */}
        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-8">
          <h2 className="text-xl font-alt">Скоро</h2>
          <p className="mt-3 text-zinc-300 font-main leading-relaxed">
            Що зробити зараз: переглянь усі анкети кандидатів, щоб визначити власних фаворитів!
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/candidates"
              className="rounded-full bg-zinc-100 text-zinc-900 px-5 py-2 text-sm font-alt font-semibold uppercase hover:bg-white transition"
            >
              Переглянути кандидатів
            </Link>
            <Link
              href="/"
              className="rounded-full border border-zinc-600 px-5 py-2 text-sm font-alt uppercase hover:border-zinc-300 transition"
            >
              На головну
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}