import { TwitterApi } from "twitter-api-v2";

export async function tweetExists(twitterClient: TwitterApi, tweetId: string) {
  const { errors } = await twitterClient.v2.singleTweet(tweetId);

  if (errors) {
    throw new Error(errors.map((error) => JSON.stringify(error)).join("\n"));
  }
  return true;
}
