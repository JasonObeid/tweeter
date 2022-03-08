import { PostgrestError, Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { client } from "../config/supabaseClient";

export interface LoginProps {
  email: string | null;
  password: string | null;
}
export async function login({ email, password }: LoginProps) {
  if (
    email !== null &&
    email.length > 0 &&
    password !== null &&
    password.length > 0
  ) {
    const { user, error } = await client.auth.signIn({
      email: email,
      password: password,
    });
    if (!user || error) {
      throw new Error(error?.message ?? "Error logging in to supabase");
    }

    return user;
  } else {
    throw new Error("Please enter a username or password");
  }
}

export async function resetPassword(email: string | null) {
  if (email !== null && email.length > 0) {
    const { error } = await client.auth.api.resetPasswordForEmail(email, {
      redirectTo: window.location.href,
    });
    if (error) {
      throw new Error(error.message);
    }
  }
}

export function useLogin() {
  const [session, setSession] = useState<Session | null>(client.auth.session());
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [errorText, setErrorText] = useState<null | string>(null);
  const [successText, setSuccessText] = useState<null | string>(null);

  const router = useRouter();
  const from =
    router.query["from"] !== undefined &&
    !(router.query["from"] as string).includes("_next/data")
      ? (router.query["from"] as string)
      : "/";

  useEffect(() => {
    const { data: authListener } = client.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Send session to /api/auth route to set the auth cookie.
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      },
    );

    return () => {
      authListener?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginMutation = useMutation(login, {
    mutationKey: "login",
    onSuccess: (user) => {
      setUser(user);
      setErrorText(null);
      router.push(from);
    },
    onError: (error) => {
      setErrorText((error as PostgrestError).message);
    },
  });

  const resetPasswordMutation = useMutation(resetPassword, {
    mutationKey: "resetPassword",
    onSuccess: () => {
      setSuccessText(`Reset email sent to ${email}`);
    },
    onError: (error) => {
      setErrorText((error as PostgrestError).message);
    },
  });

  return {
    loginMutation,
    resetPasswordMutation,
    email,
    setEmail,
    password,
    setPassword,
    errorText,
    successText,
    user,
    setUser,
    session,
    setSession,
  };
}
