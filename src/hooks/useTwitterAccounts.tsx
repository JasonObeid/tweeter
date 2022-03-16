import { useMutation, useQuery, useQueryClient } from "react-query";
import { PostgrestResponse } from "@supabase/supabase-js";

import { client } from "../config/supabaseClient";
import { TwitterAuth } from "../config/types";
import { get } from "../config/fetch";
import { useAuthContext } from "../context/AuthContext";

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
  reply_text: string;
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
  const { session } = useAuthContext();

  const queryClient = useQueryClient();

  const twitterAccountsQuery = useQuery("twitterAccounts", getTwitterAuths, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => console.log(data),
  });

  function removeDeletedAccount(deletedAccount: TwitterAuth) {
    const newAccounts = [...(twitterAccountsQuery.data ?? [])];
    return newAccounts.filter((account) => account.id !== deletedAccount.id);
  }

  async function removeUser(id: string) {
    const deletedUser = await get<TwitterAuth>(
      `/api/twitter/deleteUser?id=${id}`,
      {
        token: session?.access_token,
      },
    );

    if (deletedUser === null) {
      throw new Error("Deleted user was null");
    }

    return deletedUser;
  }

  const removeTwitterUserMutation = useMutation(removeUser, {
    mutationKey: "removeTwitterUser",
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData("twitterAccounts", () =>
        removeDeletedAccount(data),
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    twitterAccountsQuery,
    removeTwitterUserMutation,
  };
}
