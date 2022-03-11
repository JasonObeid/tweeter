import { TwitterApi } from "twitter-api-v2";
import { logger } from "../_logger";

export async function tweetExists(twitterClient: TwitterApi, tweetId: string) {
  const { data, errors } = await twitterClient.v2.singleTweet(tweetId);

  if (errors) {
    logger.info(JSON.stringify(errors));
    throw new Error(JSON.stringify(errors));
  }

  return data;
}
