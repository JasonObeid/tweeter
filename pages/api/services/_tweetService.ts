import { TwitterApi } from "twitter-api-v2";

export async function tweet(userTwitterClient: TwitterApi, tweetText: string) {
  const { data, errors } = await userTwitterClient.v2.tweet(tweetText);

  if (errors) {
    throw new Error(errors.map((error) => JSON.stringify(error)).join("\n"));
  }

  console.log(data);
  return true;
}

export async function multiTweet(
  userTwitterClients: TwitterApi[],
  tweetText: string,
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient) => {
      try {
        return await tweet(userTwitterClient, tweetText);
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  );
}
