import { useMutation, useQuery, useQueryClient } from "react-query";
import { PostgrestResponse } from "@supabase/supabase-js";

import { client } from "./supabaseClient";
import { TwitterAuth } from "../types";
import { get } from "../fetch";

export interface TwitterAuthUser
  extends Omit<
    TwitterAuth,
    | "created_at"
    | "access_token"
    | "refresh_token"
    | "expires_in"
    | "session_id"
  > {
  is_selected: boolean;
}

export async function removeUser(username: string) {
  await get<void>(`/api/twitter/deleteUser?username=${username}`);
}

export async function getTwitterAuths() {
  const { data, error, status }: PostgrestResponse<TwitterAuthUser> =
    await client.from("twitter_auth").select(`username,id`);

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("retrieved twitter_auth was null");
  }
  return data;
}

export function useTwitterAccounts() {
  const queryClient = useQueryClient();

  const twitterAccountsQuery = useQuery("twitterAccounts", getTwitterAuths, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => console.log(data),
  });

  const removeTwitterUserMutation = useMutation(removeUser, {
    mutationKey: "removeTwitterUser",
    onSuccess: (a) => {
      console.log(a);
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: () => {
      queryClient.invalidateQueries("twitterAccounts");
    },
  });

  return {
    twitterAccountsQuery,
    removeTwitterUserMutation,
  };
}
