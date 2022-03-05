import { SupabaseClient, PostgrestResponse } from "@supabase/supabase-js";
import { TwitterAuthUser } from "../../hooks/useTwitterAccounts";

export async function getTwitterAuths(supabaseClient: SupabaseClient) {
  const { data, error, status }: PostgrestResponse<TwitterAuthUser> =
    await supabaseClient.from("twitter_auth").select(`username,id`);

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("retrieved twitter_auth was null");
  }
  return data;
}
