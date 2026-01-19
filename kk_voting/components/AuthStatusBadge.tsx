import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AuthStatusBadgeClient from "./AuthStatusBadgeClient";

export default async function AuthStatusBadge() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AuthStatusBadgeClient isLoggedIn={false} />;
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0];

  const avatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  return (
    <AuthStatusBadgeClient
      isLoggedIn
      name={name}
      avatar={avatar}
    />
  );
}
