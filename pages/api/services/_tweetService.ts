import { TwitterApi } from "twitter-api-v2";
import { logger } from "../_logger";

export async function tweet(userTwitterClient: TwitterApi, tweetText: string) {
  const { data, errors } = await userTwitterClient.v2.tweet(tweetText);

  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  logger.info(data);
  return true;
}

export async function multiTweet(
  userTwitterClients: (TwitterApi | null)[],
  tweetText: string,
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient) => {
      try {
        if (userTwitterClient === null) {
          return false;
        }
        return await tweet(userTwitterClient, tweetText);
      } catch (error) {
        logger.error(error);
        return false;
      }
    }),
  );
}
