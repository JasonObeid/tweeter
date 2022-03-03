import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";
import { TwitterAuth } from "../../config/types";

export async function deleteTwitterAuth(
  supabaseClient: SupabaseClient,
  username: string,
) {
  const { data, error }: PostgrestSingleResponse<TwitterAuth> =
    await supabaseClient
      .from("twitter_auth")
      .delete()
      .eq("username", username)
      .single();

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned data was null");
  }
  return data;
}

export async function deleteUser(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
  username: string,
) {
  const deletedAuth = await deleteTwitterAuth(supabaseClient, username);
  await twitterClient.revokeOAuth2Token(deletedAuth.access_token);
  // await client.revokeOAuth2Token(data.refresh_token, "refresh_token");

  return deletedAuth;
}
