import {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { TOAuth2Scope, TwitterApi } from "twitter-api-v2";
import { TwitterAuth } from "../../config/types";

export interface RefreshedTwitterAuth {
  id: string;
  username: string;
  client: TwitterApi;
  expiresIn: number;
  accessToken: string;
  scope: TOAuth2Scope[];
  refreshToken: string | undefined;
}

export async function getUserAuths(
  supabaseClient: SupabaseClient,
  ids: string[],
) {
  const { data, error }: PostgrestResponse<TwitterAuth> = await supabaseClient
    .from("twitter_auth")
    .select("access_token,expires_in,refresh_token,id,username,created_at")
    .in("id", ids);

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
      .eq("id", refreshedTwitterAuth.id)
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
  const twitterUserClients = await Promise.all(
    staleUserAuths.map(async (userAuth) => {
      // if (isExpired(userAuth)) {
      //   console.log(`refreshing auth for ${userAuth.username} ...`);
      //   const refreshedUserAuth = await twitterClient.refreshOAuth2Token(
      //     userAuth.refresh_token,
      //   );
      //   console.log(`refreshed auth for ${userAuth.username} ...`);

      //   refreshedUserAuths.push({
      //     ...refreshedUserAuth,
      //     username: userAuth.username,
      //   });
      //   return refreshedUserAuth.client;
      // }

      return new TwitterApi(userAuth.access_token);
    }),
  );

  return {
    twitterUserClients: twitterUserClients,
    refreshedUserAuths: refreshedUserAuths,
  };
}

export async function getUserTwitterClients(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
  ids: string[],
) {
  const staleUserAuths = await getUserAuths(supabaseClient, ids);
  const { twitterUserClients, refreshedUserAuths } = await getRefreshedClients(
    twitterClient,
    staleUserAuths,
  );

  // if (refreshedUserAuths.length > 0) {
  //   await Promise.all(
  //     refreshedUserAuths.map((refreshedUserAuth) =>
  //       storeRefreshedUserAuth(supabaseClient, refreshedUserAuth),
  //     ),
  //   );
  // }
  return twitterUserClients;
}

export async function getUserTwitterClient(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
  id: string,
) {
  const clients = await getUserTwitterClients(supabaseClient, twitterClient, [
    id,
  ]);
  return clients[0];
}
