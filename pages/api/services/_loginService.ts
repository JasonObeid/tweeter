import { TwitterApi } from "twitter-api-v2";
import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { TwitterAuthSession, TwitterAuth } from "../../../src/config/types";
import { logger } from "../_logger";

export async function getSessionStateAndCodeVerifier(
  supabaseClient: SupabaseClient,
  sessionId: string,
) {
  const { data, error }: PostgrestSingleResponse<TwitterAuthSession> =
    await supabaseClient
      .from<TwitterAuthSession>("twitter_auth_session")
      .select(`session_state,code_verifier`)
      .eq("session_id", sessionId as string)
      .single();
  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned data was null");
  }
  return data;
}

export async function getUserAuth(
  twitterClient: TwitterApi,
  code: string,
  code_verifier: string,
  redirectUri: string,
) {
  const access = await twitterClient.loginWithOAuth2({
    code: code,
    codeVerifier: code_verifier,
    redirectUri: redirectUri,
  });
  return access;
}

export async function storeAuthLogin(
  supabaseClient: SupabaseClient,
  username: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  sessionId: string,
) {
  const { data, error }: PostgrestSingleResponse<TwitterAuth> =
    await supabaseClient
      .from<TwitterAuth>("twitter_auth")
      .insert({
        username: username,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
        session_id: sessionId,
      })
      .single();

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned data was null");
  }
  return data;
}

export async function login(
  supabaseClient: SupabaseClient,
  twitterClient: TwitterApi,
  state: string,
  code: string,
  sessionId: string,
  redirectUri: string,
) {
  const authSession = await getSessionStateAndCodeVerifier(
    supabaseClient,
    sessionId,
  );
  logger.info(authSession);

  if (
    !code ||
    !state ||
    !authSession.code_verifier ||
    !authSession.session_state
  ) {
    throw new Error(`You denied the app or your session expired!`);
  }
  if (state !== authSession.session_state) {
    throw new Error("Stored tokens didnt match!");
  }

  const { client, accessToken, refreshToken, expiresIn } = await getUserAuth(
    twitterClient,
    code,
    authSession.code_verifier,
    redirectUri,
  );

  const { data: userObject, errors: userObjectErrors } = await client.v2.me();
  if (userObjectErrors) {
    throw new Error(JSON.stringify(userObjectErrors));
  }

  const storedAuthData = await storeAuthLogin(
    supabaseClient,
    userObject.username,
    accessToken,
    refreshToken as string, // this should not be undefined as long as "offline.access" scope is used for auth
    expiresIn,
    sessionId,
  );
  logger.info(storedAuthData);
  return storedAuthData;
}
