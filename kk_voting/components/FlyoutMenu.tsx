import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import FlyoutMenuClient from "./FlyoutMenuClient";

export default async function FlyoutMenu() {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();

  const user = data.user;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    (user?.email as string | undefined) ??
    null;

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;

  return (
    <FlyoutMenuClient
      isLoggedIn={!!user}
      displayName={displayName}
      avatarUrl={avatarUrl}
    />
  );
}