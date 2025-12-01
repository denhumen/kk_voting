import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Королі та Королеви — Голосування студентів",
  description:
    "Королі та Королеви — відзначаємо студентів УКУ за академічні, соціальні, культурні та благодійні досягнення.",
};

const categories = [
  {
    title: "Академічна / Дослідницька",
    description:
      "За видатні успіхи у навчанні, наукових проєктах, дослідженнях та олімпіадах.",
  },
  {
    title: "Благодійність на військо",
    description:
      "Для тих, хто системно підтримує ЗСУ: збори, волонтерство, організація ініціатив.",
  },
  {
    title: "Соціальна (цивільні проєкти)",
    description:
      "Соціальні ініціативи для спільнот, кампусу та міста: підтримка людей, освіта, інклюзія.",
  },
  {
    title: "Культурно-мистецька",
    description:
      "Фестивалі, література, театр, музика, збереження культурної спадщини та інші мистецькі проєкти.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-50">
      {/* Загальний split-layout на всю ширину */}
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        {/* Вертикальна лінія по центру на всю висоту */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-zinc-500/40" />

        {/* Ліва частина */}
        <section className="relative flex-1 flex items-center justify-center bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 px-6 py-10 md:px-10 lg:px-14">
          <div className="max-w-xl space-y-6">
            <p
              className="uppercase text-xs md:text-sm text-zinc-400 font-alt"
              style={{ letterSpacing: "0.35em" }}
            >
              Королі та Королеви · УКУ
            </p>

            <h1 className="font-alt text-4xl md:text-5xl lg:text-6xl leading-tight">
              <span className="block text-zinc-100">КОГО ТИ</span>
              <span className="block text-zinc-300">ПІДНІМЕШ</span>
              <span className="block text-zinc-50">НА ТРОН?</span>
            </h1>

            <p className="text-sm md:text-base text-zinc-300 font-main">
              Уряд студентів УКУ та СО &quot;Кавалєрка&quot; запрошують тебе на{" "}
              <span className="font-alt font-semibold">Королі та Королеви</span> — 
              вечірку в стилі <span className="italic">“opposites attract”</span>,
              натхненну американським homecoming. Проголосуй за тих, хто вже робить
              наш університет сильнішим — в аудиторіях, культурі, суспільстві й
              у підтримці війська.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {/* <button className="px-5 py-2.5 rounded-full border border-zinc-100 bg-zinc-100 text-zinc-950 text-sm md:text-base font-alt font-semibold uppercase tracking-wide hover:bg-transparent hover:text-zinc-100 transition">
                Проголосувати
              </button> */}
              <Link href="/vote">
                <button className="px-5 py-2.5 rounded-full border border-zinc-100 bg-zinc-100 text-zinc-950 text-sm md:text-base font-alt font-semibold uppercase tracking-wide hover:bg-transparent hover:text-zinc-100 transition">
                  Проголосувати
                </button>
              </Link>
              <button className="px-5 py-2.5 rounded-full border border-zinc-500/60 text-zinc-100 text-sm md:text-base font-alt tracking-wide hover:border-zinc-200 hover:bg-zinc-900/40 transition">
                Дізнатися більше
              </button>
            </div>

            <p className="text-xs md:text-sm text-zinc-400 pt-2 font-main">
              Голосування доступне лише для студентів УКУ. Один студент — один
              голос у кожній номінації.
            </p>
          </div>
        </section>

        {/* Права частина */}
        <section className="relative flex-1 flex items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-200 text-zinc-900 px-6 py-10 md:px-10 lg:px-14">
          {/* Текстура поверх всієї правої половини */}
          <div className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40 bg-[radial-gradient(circle_at_top,_#d4d4d8_0,_transparent_60%),radial-gradient(circle_at_bottom,_#a1a1aa_0,_transparent_55%)]" />

          <div className="relative max-w-xl">
            <p className="font-alt text-xs md:text-sm uppercase tracking-[0.35em] text-zinc-500 mb-4">
              Номінації
            </p>

            <h2 className="font-alt text-xl md:text-2xl mb-4">
              Трон чекає на своїх королів та королев
            </h2>

            <p className="text-sm md:text-base text-zinc-700 mb-6 font-main">
              Обирай студентів, які для тебе є втіленням сили, сміливості та
              відповідальності. Чотири напрямки — чотири способи змінювати світ
              довкола.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-2xl border border-zinc-300/70 bg-zinc-50/80 backdrop-blur-sm px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-alt text-sm md:text-base font-semibold mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-700 font-main">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[11px] md:text-xs text-zinc-500 mt-5 font-main">
              Деталі про вечірку, дресс-код у стилі “opposites attract” та місце
              проведення — зовсім скоро. Слідкуй за соцмережами Студентського
              уряду.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
