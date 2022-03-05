import { TwitterApi } from "twitter-api-v2";
import { TwitterAuthUser } from "../../../src/hooks/useTwitterAccounts";

export async function replyTweet(
  userTwitterClient: TwitterApi,
  tweetId: string,
  user: TwitterAuthUser,
) {
  const { data, errors } = await userTwitterClient.v2.tweet({
    reply: {
      in_reply_to_tweet_id: tweetId,
    },
    text: user.reply_text,
  });

  if (errors) {
    throw new Error(errors.map((error) => JSON.stringify(error)).join("\n"));
  }

  console.log(data);
  return true;
}

export async function multiReplyTweet(
  userTwitterClients: (TwitterApi | null)[],
  tweetId: string,
  users: TwitterAuthUser[],
) {
  return await Promise.all(
    userTwitterClients.map(async (userTwitterClient, index) => {
      try {
        if (userTwitterClient === null) {
          return false;
        }
        return await replyTweet(userTwitterClient, tweetId, users[index]);
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  );
}
