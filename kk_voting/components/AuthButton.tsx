import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-zinc-100 text-zinc-900 px-4 py-2 text-xs font-alt uppercase hover:bg-white transition"
      >
        Увійти
      </Link>
    );
  }

  return (
    <form action="/auth/logout" method="post">
      <button className="rounded-full border border-zinc-600 px-4 py-2 text-xs font-alt uppercase hover:border-zinc-300 transition">
        Вийти
      </button>
    </form>
  );
}