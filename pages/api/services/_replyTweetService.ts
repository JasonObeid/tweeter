import { TwitterApi } from "twitter-api-v2";
import { logger } from "../_logger";

export async function replyTweet(
  userTwitterClient: TwitterApi,
  tweetId: string,
  replyText: string,
) {
  const { data, errors } = await userTwitterClient.v2.tweet({
    reply: {
      in_reply_to_tweet_id: tweetId,
    },
    text: replyText,
  });

  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  logger.info(data);
  return true;
}

export async function multiReplyTweet(
  userTwitterClients: (TwitterApi | null)[],
  tweetId: string,
  replyTexts: string[],
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient, index) => {
      try {
        if (userTwitterClient === null) {
          return false;
        }
        return await replyTweet(userTwitterClient, tweetId, replyTexts[index]);
      } catch (error) {
        logger.error(error);
        return false;
      }
    }),
  );
}
