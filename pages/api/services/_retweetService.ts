import { TwitterApi } from "twitter-api-v2";
import { logger } from "../_logger";

export async function retweet(userTwitterClient: TwitterApi, tweetId: string) {
  const { data: userObject, errors: userObjectErrors } =
    await userTwitterClient.v2.me();

  if (userObjectErrors) {
    throw new Error(JSON.stringify(userObjectErrors));
  }

  const { data, errors } = await userTwitterClient.v2.retweet(
    userObject.id,
    tweetId,
  );

  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  logger.info({
    user: userObject.username,
    tweetId: tweetId,
    outcome: data.retweeted,
  });
  return data.retweeted;
}

export async function multiRetweet(
  userTwitterClients: (TwitterApi | null)[],
  tweetId: string,
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient) => {
      try {
        if (userTwitterClient === null) {
          return false;
        }
        logger.info(await userTwitterClient.currentUserV2());
        return await retweet(userTwitterClient, tweetId);
      } catch (error) {
        logger.error(error);
        return false;
      }
    }),
  );
}
