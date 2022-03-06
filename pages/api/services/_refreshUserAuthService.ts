import {
  SupabaseClient,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { TOAuth2Scope, TwitterApi } from "twitter-api-v2";
import { TwitterAuth } from "../../../src/config/types";

export interface RefreshedTwitterAuth {
  id: string;
  username: string;
  client: TwitterApi;
  expiresIn: number;
  accessToken: string;
  scope: TOAuth2Scope[];
  refreshToken: string | undefined;
}

export async function getAllUserAuths(supabaseClient: SupabaseClient) {
  const { data, error }: PostgrestResponse<TwitterAuth> = await supabaseClient
    .from("twitter_auth")
    .select("access_token,expires_in,refresh_token,id,username,created_at");

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

export function shouldRefresh(userAuth: TwitterAuth) {
  const now = new Date();

  const expiresAt = new Date(userAuth.created_at);
  expiresAt.setSeconds(expiresAt.getSeconds() + userAuth.expires_in);
  if (now > expiresAt) {
    console.error(`Auth for ${userAuth.username} is already expired`);
    return false;
  }

  const refreshAfter = new Date(userAuth.created_at);
  refreshAfter.setSeconds(refreshAfter.getSeconds() + userAuth.expires_in / 3);
  if (now > refreshAfter) {
    console.log(`Should refresh auth for ${userAuth.username}`);
    return true;
  }

  console.log(`Not refreshing auth for ${userAuth.username}`);
  return false;
}

export async function refreshUserAuths(
  twitterClient: TwitterApi,
  supabaseClient: SupabaseClient,
) {
  const staleUserAuths = await getAllUserAuths(supabaseClient);
  const refreshedUserAuths: RefreshedTwitterAuth[] = [];
  await Promise.all(
    staleUserAuths.map(async (userAuth) => {
      try {
        if (shouldRefresh(userAuth)) {
          console.log(`refreshing auth for ${userAuth.username} ...`);
          console.log(`refreshing auth for ${JSON.stringify(userAuth)} ...`);
          const refreshedUserAuth = await twitterClient.refreshOAuth2Token(
            userAuth.refresh_token,
          );
          const isAuthenticated =
            await refreshedUserAuth.client.currentUserV2();
          if (isAuthenticated) {
            console.log(`refreshed auth for ${userAuth.username} ...`);
            refreshedUserAuths.push({
              ...refreshedUserAuth,
              username: userAuth.username,
              id: userAuth.id,
            });
          } else {
            console.error(
              `failed to refresh auth for ${userAuth.username} ...`,
            );
          }
        }
      } catch (error) {
        console.error(`failed to refresh auth for ${userAuth.username} ...`);
        console.error(error);
      }
    }),
  );

  return refreshedUserAuths;
}
