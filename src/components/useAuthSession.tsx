import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { client } from "../config/supabaseClient";
import { useRouter } from "next/router";

export function useAuthSession() {
  console.log(client);
  const router = useRouter();

  const from =
    router.query["from"] !== undefined &&
    !(router.query["from"] as string).includes("_next/data")
      ? (router.query["from"] as string)
      : "/";

  const [session, setSession] = useState<Session | null>(null);
  console.log(session);
  useEffect(() => {
    setSession(client.auth.session());
    client.auth.onAuthStateChange((_event, session) => {
      router.push(`/login?${from === "/login" ? "" : `from=${from}`}`);
      setSession(session);
    });
    if (
      session !== null &&
      session.user !== null &&
      router.pathname === "/login"
    ) {
      router.push(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (
      session !== null &&
      session.user !== null &&
      location.pathname === "/login"
    ) {
      router.push(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return { session };
}
