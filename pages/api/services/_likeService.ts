import { TwitterApi } from "twitter-api-v2";
import { logger } from "../_logger";

export async function like(userTwitterClient: TwitterApi, tweetId: string) {
  const { data: userObject, errors: userObjectErrors } =
    await userTwitterClient.v2.me();
  if (userObjectErrors) {
    throw new Error(JSON.stringify(userObjectErrors));
  }

  const { data, errors } = await userTwitterClient.v2.like(
    userObject.id,
    tweetId,
  );
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  logger.info({
    user: userObject.username,
    tweetId: tweetId,
    outcome: data.liked,
  });
  return data.liked;
}

export async function multiLike(
  userTwitterClients: (TwitterApi | null)[],
  tweetId: string,
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient) => {
      try {
        if (userTwitterClient === null) {
          return false;
        }
        return await like(userTwitterClient, tweetId);
      } catch (error) {
        logger.error(error);
        return false;
      }
    }),
  );
}
