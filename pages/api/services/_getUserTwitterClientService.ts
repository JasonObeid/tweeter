import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";
import { TwitterAuth } from "../../../src/config/types";

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

export async function getUserTwitterClients(
  supabaseClient: SupabaseClient,
  ids: string[],
) {
  const userAuths = await getUserAuths(supabaseClient, ids);
  const twitterUserClients = userAuths.map(
    (userAuth) => new TwitterApi(userAuth.access_token),
  );
  return twitterUserClients;
}
