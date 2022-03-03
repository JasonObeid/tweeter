import { TwitterApi } from "twitter-api-v2";

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
    throw new Error(errors.map((error) => JSON.stringify(error)).join("\n"));
  }

  console.log(data);
  return true;
}

export async function multiReplyTweet(
  userTwitterClients: TwitterApi[],
  tweetId: string,
  replyText: string,
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient) => {
      try {
        return await replyTweet(userTwitterClient, tweetId, replyText);
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  );
}
