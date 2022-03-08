import { TwitterApi } from "twitter-api-v2";

export async function tweetExists(twitterClient: TwitterApi, tweetId: string) {
  const { data, errors } = await twitterClient.v2.singleTweet(tweetId);

  if (errors) {
    console.log(JSON.stringify(errors));
    throw new Error(JSON.stringify(errors));
  }

  return data;
}
