import { TwitterApi } from "twitter-api-v2";

export async function retweet(userTwitterClient: TwitterApi, tweetId: string) {
  const { data: userObject, errors: userObjectErrors } =
    await userTwitterClient.v2.me();

  if (userObjectErrors) {
    throw new Error(
      userObjectErrors.map((error) => JSON.stringify(error)).join("\n"),
    );
  }

  const { data, errors } = await userTwitterClient.v2.retweet(
    userObject.id,
    tweetId,
  );

  if (errors) {
    throw new Error(errors.map((error) => JSON.stringify(error)).join("\n"));
  }
  return data.retweeted;
}

export async function multiRetweet(
  userTwitterClients: TwitterApi[],
  tweetId: string,
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient) => {
      try {
        return await retweet(userTwitterClient, tweetId);
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  );
}
