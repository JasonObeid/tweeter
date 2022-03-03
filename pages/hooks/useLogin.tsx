import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
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
    const { error } = await client.auth.signIn({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error(error.message);
    }
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
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [errorText, setErrorText] = useState<null | string>(null);
  const [successText, setSuccessText] = useState<null | string>(null);

  const router = useRouter();

  const from = (router.query["from"] as string) || "/";

  const loginMutation = useMutation(login, {
    mutationKey: "login",
    onSuccess: () => {
      router.push(from);
      setErrorText(null);
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
  };
}
