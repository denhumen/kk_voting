import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "K&K — Деталі",
  description:
    "Деталі події Королі та Королеви: мотивація, етапи подачі, голосування та нагородження.",
};

type TimelineItem = {
  title: string;
  date: string;
  description: string;
  visible: boolean;
};

const timeline: TimelineItem[] = [
  {
    title: "Початок подачі заявок",
    date: "24 листопада 2025",
    description:
      "Відкриваємо форму, де ти можеш подати себе, друга, подругу, викладача чи будь-кого з УКУ, хто надихає.",
    visible: true,
  },
  {
    title: "Кінець подачі заявок",
    date: "30 грудня 2025",
    description:
      "Завершуємо збір заявок, команда починає опрацьовувати номінантів по кожній категорії.",
    visible: true,
  },
  {
    title: "Оголошення списку номінантів",
    date: "19 січня 2026",
    description:
      "Побачиш імена тих, хто потрапив у шортлист — та зможеш підтримати їх голосом.",
    visible: true,
  },
  {
    title: "Голосування студентів",
    date: "20–22 січня 2026",
    description:
      "Онлайн-голосування серед студентів УКУ. Один студент — один голос у кожній номінації.",
    visible: true,
  },
  {
    title: "Вечірка Королі та Королеви",
    date: "3 лютого 2026",
    description:
      "Фінальний івент в стилі “opposites attract”: оголошення переможців, музика, атмосфера й багато несподіванок.",
    visible: false,
  },
];

export default function DetailsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10 md:px-10 lg:py-16">
        {/* Хедер */}
        <header className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs md:text-sm text-zinc-400 hover:text-zinc-200 transition"
          >
            ← На головну
          </Link>

          <p
            className="uppercase text-xs md:text-sm text-zinc-500 font-alt"
            style={{ letterSpacing: "0.35em" }}
          >
            Королі та Королеви · Деталі
          </p>

          <h1 className="font-alt text-3xl md:text-4xl lg:text-5xl leading-tight">
            Навіщо ми робимо
            <span className="block text-zinc-200">«Королі та Королеви»?</span>
          </h1>

          <p className="max-w-3xl text-sm md:text-base text-zinc-300 font-main">
            Ми хочемо помічати тих, хто вже зараз робить УКУ сильнішим: в
            аудиторіях, в науці, у волонтерстві на військо, у соціальних
            проєктах та культурі. Ця подія — спосіб сказати
            <span className="font-semibold"> «дякую»</span> і
            <span className="font-semibold"> «ми бачимо те, що ти робиш»</span>.
          </p>
        </header>

        {/* Блок мотивації */}
        <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-start">
          <div className="space-y-4">
            <h2 className="font-alt text-xl md:text-2xl">
              Про що ця ініціатива
            </h2>
            <p className="text-sm md:text-base text-zinc-300 font-main">
              В університеті завжди є люди, які тягнуть спільноту вперед:
              організовують події, піднімають складні теми, роблять науку не
              лише «для галочки», волонтерять на фронт чи формують культурне
              середовище кампусу.
            </p>
            <p className="text-sm md:text-base text-zinc-300 font-main">
              «Королі та Королеви» — це не про корони чи формальні титули. Це
              про те, щоб раз на рік зупинитися, подивитися довкола і вголос
              відзначити людей, які надихають. А ще — про секретну подію, про котру ви скоро почуєте.
            </p>
          </div>

          {/* Карточка з коротким summary етапів */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 md:px-6 md:py-5 shadow-lg shadow-black/40">
            <p className="font-alt text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">
              Як все відбуватиметься
            </p>
            <ul className="space-y-2 text-sm text-zinc-300 font-main">
              <li>1. Студенти подають кандидатів через форму.</li>
              <li>2. Команда формує список номінантів.</li>
              <li>3. Журі передивляється анкети та визначає головних кандидатів на загальне голосування.</li>
              <li>4. Відбувається загальне онлайн-голосування.</li>
              <li>5. На спеціальній події оголошуємо переможців.</li>
            </ul>
          </div>
        </section>

        {/* Таймлайн */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-alt text-xl md:text-2xl">
              Таймлайн «Королі та Королеви»
            </h2>
            <p className="text-[11px] md:text-xs text-zinc-400 font-main">
              Деякі етапи ми лишаємо як інтригу — побачиш деталі трохи пізніше 😉
            </p>
          </div>

          <ol className="space-y-3 md:space-y-4">
            {timeline.map((item, idx) => (
              <li
                key={item.title + item.date}
                className={clsx(
                  "relative rounded-2xl border px-4 py-3 md:px-5 md:py-4 transition-shadow",
                  item.visible
                    ? "border-zinc-600/70 bg-zinc-900/80 shadow-md shadow-black/40"
                    : "border-zinc-700/60 bg-zinc-900/40"
                )}
              >
                {/* Лінія/точка зліва (опційно, для візуального таймлайну) */}
                <div className="absolute left-0 top-4 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-400 md:top-5" />

                <div className="ml-3 md:ml-4 space-y-1">
                  {/* Дата завжди чітка */}
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs md:text-sm text-zinc-300 font-main">
                      {item.date}
                    </p>
                    {!item.visible && (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-alt">
                        скоро
                      </span>
                    )}
                  </div>

                  {/* Назва + опис: або видно, або заблюрено */}
                  <div className="relative overflow-hidden">
                    <p
                      className={clsx(
                        "font-alt text-sm md:text-base",
                        item.visible
                          ? "text-zinc-50"
                          : "text-zinc-200 blur-[4px] select-none"
                      )}
                    >
                      {item.title}
                    </p>
                    <p
                      className={clsx(
                        "mt-1 text-xs md:text-sm font-main",
                        item.visible
                          ? "text-zinc-300"
                          : "text-zinc-300/80 blur-[5px] select-none"
                      )}
                    >
                      {item.description}
                    </p>

                    {/* Легка плашка поверх прихованих етапів, щоб ще важче було прочитати */}
                    {!item.visible && (
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-900/40 via-zinc-900/70 to-zinc-900/80" />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}