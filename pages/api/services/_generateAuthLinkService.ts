import { SupabaseClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";
import {
  GenerateAuthLinkResponse,
  TwitterAuthSession,
} from "../../../src/config/types";

export async function storeAuthSession(
  supabaseClient: SupabaseClient,
  state: string,
  codeVerifier: string,
) {
  const { data, error } = await supabaseClient
    .from<TwitterAuthSession>("twitter_auth_session")
    .insert({
      session_state: state,
      code_verifier: codeVerifier,
    })
    .single();

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned data was null");
  }
  return data;
}

export async function generateAuthLink(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
) {
  const { url, state, codeVerifier } = twitterClient.generateOAuth2AuthLink(
    process.env.REDIRECT_URI as string,
    {
      scope: [
        "tweet.read",
        "tweet.write",
        "tweet.moderate.write",
        "users.read",
        "follows.read",
        "follows.write",
        "offline.access",
        "space.read",
        "mute.read",
        "mute.write",
        "like.read",
        "like.write",
        "list.read",
        "list.write",
        "block.read",
        "block.write",
      ],
    },
  );

  const storedAuthSession = await storeAuthSession(
    supabaseClient,
    state,
    codeVerifier,
  );
  const response: GenerateAuthLinkResponse = {
    url: url,
    session_id: storedAuthSession.session_id,
  };

  return response;
}
