"use client";

import { useState } from "react";
import Link from "next/link";

type CategoryId = "academic" | "military" | "social" | "culture";

type Nominee = {
  id: string;
  name: string;
  description: string;
  tag?: string;
};

type Category = {
  id: CategoryId;
  title: string;
  description: string;
  nominees: Nominee[];
};

const CATEGORIES: Category[] = [
  {
    id: "academic",
    title: "Академічна / Дослідницька",
    description:
      "Ті, хто живе в бібліотеці, виграє олімпіади, пише наукові роботи й ділиться знаннями з іншими.",
    nominees: [
      {
        id: "1",
        name: "Марія Іваночко",
        description: "Top-1 стипендіальна, два наукові проєкти, менторка першокурсників.",
        tag: "ФПН · Data Science",
      },
      {
        id: "2",
        name: "Андрій К.",
        description: "Організатор студентського наукового семінару, автор статті в журналі.",
        tag: "ФІКТ · Комп’ютерні науки",
      },
    ],
  },
  {
    id: "military",
    title: "Благодійність на військо",
    description:
      "Волонтери, збирачі донатів, організатори акцій та івентів на підтримку ЗСУ.",
    nominees: [
      {
        id: "3",
        name: "Софія Г.",
        description: "Координує регулярні збори на дрони та автівки для фронту.",
        tag: "Соціальна робота",
      },
      {
        id: "4",
        name: "Кирило Л.",
        description:
          "Зібрав кілька сотень тисяч гривень через благодійні турніри та івенти.",
        tag: "Богослов’я",
      },
    ],
  },
  {
    id: "social",
    title: "Соціальна (цивільні проєкти)",
    description:
      "Ті, хто запускає соціальні ініціативи, підтримує спільноти й робить кампус і місто кращими.",
    nominees: [
      {
        id: "5",
        name: "Команда «UCU Mental Health»",
        description:
          "Організовують події про психічне здоров’я, підтримку та стійкість спільноти.",
        tag: "Міжфакультетська ініціатива",
      },
      {
        id: "6",
        name: "Остап М.",
        description:
          "Куратор благодійного ярмарку та регулярних подій підтримки для ВПО у Львові.",
        tag: "Публічне управління",
      },
    ],
  },
  {
    id: "culture",
    title: "Культурно-мистецька",
    description:
      "Фестивалі, література, театр, музика, фото, кіно — усе, що додає кампусу душу.",
    nominees: [
      {
        id: "7",
        name: "Театр «На Горищі»",
        description:
          "Створюють вистави, які збирають повні зали та піднімають важливі теми.",
        tag: "Студентський театр",
      },
      {
        id: "8",
        name: "Звуки Кампусу",
        description:
          "Музичний колектив, що грає на вечірках, благодійних подіях та фестивалях УКУ.",
        tag: "Музичне об’єднання",
      },
    ],
  },
];

export default function VotePage() {
  const [votes, setVotes] = useState<Record<CategoryId, string | null>>({
    academic: null,
    military: null,
    social: null,
    culture: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleVoteChange = (categoryId: CategoryId, nomineeId: string) => {
    setVotes((prev) => ({ ...prev, [categoryId]: nomineeId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // тут пізніше буде запит на бекенд / API
    console.log("Submitted votes:", votes);
    setSubmitted(true);
  };

  const allVoted = CATEGORIES.every((cat) => votes[cat.id] !== null);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 md:px-8 lg:px-10">
        {/* Верхній бар / хедер */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p
              className="font-alt text-[11px] uppercase text-zinc-400"
              style={{ letterSpacing: "0.25em" }}
            >
              Королі та Королеви · Голосування
            </p>
            <h1 className="font-alt text-2xl md:text-3xl mt-1">
              Обери своїх королів та королев
            </h1>
          </div>

          <Link
            href="/"
            className="text-xs md:text-sm text-zinc-400 hover:text-zinc-100 font-main underline-offset-4 hover:underline"
          >
            ← На головну
          </Link>
        </header>

        {/* Основний контент */}
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Форма голосування */}
          <section className="space-y-6">
            <p className="text-sm md:text-base text-zinc-300 font-main">
              Обери по одному фавориту в кожній номінації. Пізніше ми прив’яжемо
              це голосування до твого акаунта студента УКУ, щоб гарантувати
              принцип: <span className="font-alt font-semibold">“один студент — один голос”.</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <h2 className="font-alt text-lg md:text-xl">
                        {category.title}
                      </h2>
                      <p className="text-xs md:text-sm text-zinc-400 font-main mt-1">
                        {category.description}
                      </p>
                    </div>
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-alt">
                      Обов’язкова
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {category.nominees.map((nominee) => {
                      const checked = votes[category.id] === nominee.id;
                      return (
                        <label
                          key={nominee.id}
                          className={[
                            "group relative flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-left transition",
                            checked
                              ? "border-emerald-400/80 bg-emerald-400/10"
                              : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-alt text-sm md:text-base">
                                {nominee.name}
                              </p>
                              {nominee.tag && (
                                <p className="text-[11px] text-zinc-400 mt-0.5 font-main">
                                  {nominee.tag}
                                </p>
                              )}
                            </div>

                            <div
                              className={[
                                "mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                                checked
                                  ? "border-emerald-400 bg-emerald-400 text-zinc-950"
                                  : "border-zinc-600 text-zinc-500 group-hover:border-zinc-400",
                              ].join(" ")}
                            >
                              {checked ? "✓" : ""}
                            </div>
                          </div>

                          <p className="mt-2 text-xs md:text-sm text-zinc-300 font-main">
                            {nominee.description}
                          </p>

                          <input
                            type="radio"
                            name={category.id}
                            value={nominee.id}
                            checked={checked}
                            onChange={() =>
                              handleVoteChange(category.id, nominee.id)
                            }
                            className="hidden"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4 mt-4">
                {!submitted ? (
                  <>
                    <button
                      type="submit"
                      disabled={!allVoted}
                      className={[
                        "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm md:text-base font-alt uppercase tracking-[0.18em] transition",
                        allVoted
                          ? "bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
                          : "bg-zinc-700 text-zinc-400 cursor-not-allowed",
                      ].join(" ")}
                    >
                      Підтвердити вибір
                    </button>
                    <p className="text-xs text-zinc-400 font-main">
                      Після додавання авторизації голос буде прив’язаний до твого
                      ucu.edu.ua-акаунта. Зараз це демонстраційна версія.
                    </p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
                    <p className="font-alt text-sm md:text-base text-emerald-300">
                      Дякуємо! Твій голос збережено (поки локально 😉).
                    </p>
                    <p className="mt-1 text-xs text-emerald-200/90 font-main">
                      На продакшені ці дані будуть надсилатися на сервер, де ми
                      перевірятимемо, що кожен студент голосує лише один раз.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Права колонка: резюме вибору / стильний блок */}
          <aside className="space-y-4 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 md:p-5">
            <p
              className="font-alt text-[11px] uppercase text-zinc-400"
              style={{ letterSpacing: "0.25em" }}
            >
              Підсумок
            </p>

            <h2 className="font-alt text-lg md:text-xl">
              Твої королі та королеви
            </h2>

            <div className="space-y-3 text-sm font-main">
              {CATEGORIES.map((cat) => {
                const nomineeId = votes[cat.id];
                const nominee = cat.nominees.find((n) => n.id === nomineeId);

                return (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2.5"
                  >
                    <p className="text-[11px] uppercase text-zinc-500 font-alt tracking-[0.18em]">
                      {cat.title}
                    </p>
                    {nominee ? (
                      <>
                        <p className="mt-1 text-sm text-zinc-50 font-alt">
                          {nominee.name}
                        </p>
                        {nominee.tag && (
                          <p className="text-[11px] text-zinc-400">{nominee.tag}</p>
                        )}
                      </>
                    ) : (
                      <p className="mt-1 text-xs text-zinc-500">
                        Ще не обрано. Обери кандидата в цій номінації.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-500 font-main mt-2">
              На вечірці “Kings & Queens” ми оголосимо результати, вручимо нагороди
              й зробимо так, щоб корон вистачило на всіх, хто того заслуговує.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}