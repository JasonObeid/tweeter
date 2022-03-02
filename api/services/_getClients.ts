import { createClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";

if (process.env.SUPABASE_URL === undefined) {
  throw new Error("SUPABASE_URL undefined");
}
if (process.env.SUPABASE_KEY === undefined) {
  throw new Error("SUPABASE_KEY undefined");
}
if (process.env.TWITTER_CLIENT_ID === undefined) {
  throw new Error("TWITTER_CLIENT_ID undefined");
}
if (process.env.TWITTER_CLIENT_SECRET === undefined) {
  throw new Error("TWITTER_CLIENT_SECRET undefined");
}

export const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});
