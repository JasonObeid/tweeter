import {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { TOAuth2Scope, TwitterApi } from "twitter-api-v2";
import { TwitterAuth } from "../../src/types";

export interface RefreshedTwitterAuth {
  username: string;
  client: TwitterApi;
  expiresIn: number;
  accessToken: string;
  scope: TOAuth2Scope[];
  refreshToken: string | undefined;
}

export async function getUserAuths(
  supabaseClient: SupabaseClient,
  usernames: string[],
) {
  const { data, error }: PostgrestResponse<TwitterAuth> = await supabaseClient
    .from("twitter_auth")
    .select("access_token,expires_in,refresh_token,username,created_at")
    .in("username", usernames);

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned data was null");
  }
  return data;
}

export async function storeRefreshedUserAuth(
  supabaseClient: SupabaseClient,
  refreshedTwitterAuth: RefreshedTwitterAuth,
) {
  const { data, error }: PostgrestSingleResponse<TwitterAuth> =
    await supabaseClient
      .from("twitter_auth")
      .update({
        access_token: refreshedTwitterAuth.accessToken,
        refresh_token: refreshedTwitterAuth.refreshToken,
        expires_in: refreshedTwitterAuth.expiresIn,
      })
      .eq("username", refreshedTwitterAuth.username)
      .single();

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned data was null");
  }

  console.log(`stored refreshed auth for ${refreshedTwitterAuth.username} ...`);
  return data;
}

export function isExpired(userAuth: TwitterAuth) {
  const expiresAt = new Date(userAuth.created_at);
  expiresAt.setSeconds(expiresAt.getSeconds() + userAuth.expires_in);
  return expiresAt < new Date();
}

export async function getRefreshedClients(
  twitterClient: TwitterApi,
  staleUserAuths: TwitterAuth[],
) {
  const refreshedUserAuths: RefreshedTwitterAuth[] = [];
  const userAuths = await Promise.all(
    staleUserAuths.map(async (userAuth) => {
      if (isExpired(userAuth)) {
        console.log(`refreshing auth for ${userAuth.username} ...`);
        const refreshedUserAuth = await twitterClient.refreshOAuth2Token(
          userAuth.refresh_token,
        );
        console.log(`refreshed auth for ${userAuth.username} ...`);

        refreshedUserAuths.push({
          ...refreshedUserAuth,
          username: userAuth.username,
        });
        return refreshedUserAuth.client;
      }

      return new TwitterApi(userAuth.access_token);
    }),
  );

  return { userAuths: userAuths, refreshedUserAuths: refreshedUserAuths };
}

export async function getUserTwitterClients(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
  usernames: string[],
) {
  const staleUserAuths = await getUserAuths(supabaseClient, usernames);
  const { userAuths, refreshedUserAuths } = await getRefreshedClients(
    twitterClient,
    staleUserAuths,
  );

  if (refreshedUserAuths.length > 0) {
    await Promise.all(
      refreshedUserAuths.map((refreshedUserAuth) =>
        storeRefreshedUserAuth(supabaseClient, refreshedUserAuth),
      ),
    );
  }
  return userAuths;
}
export async function getUserTwitterClient(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
  username: string,
) {
  const clients = await getUserTwitterClients(supabaseClient, twitterClient, [
    username,
  ]);
  return clients[0];
}
