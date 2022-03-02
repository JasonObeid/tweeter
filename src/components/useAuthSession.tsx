import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { client } from "../api/supabaseClient";
import { Location } from "history";

export interface FromLocation extends Location {
  state: {
    from?: string;
  };
}

export function useAuthSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location as FromLocation).state?.from || "/";
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(client.auth.session());
    client.auth.onAuthStateChange((_event, session) => {
      navigate(`/login?${from === "/login" ? "" : `from=${from}`}`);
      setSession(session);
    });
    if (
      session !== null &&
      session.user !== null &&
      location.pathname === "/login"
    ) {
      navigate(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (
      session !== null &&
      session.user !== null &&
      location.pathname === "/login"
    ) {
      navigate(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return { session };
}
