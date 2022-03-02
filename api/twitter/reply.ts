import { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiReplyTweet } from "../services/_replyTweetService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function ReplyTweetEndpoint(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { usernames, tweetId, replyText } = req.query;

  try {
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      twitterClient,
      Array.isArray(usernames) ? usernames : [usernames],
    );
    const response = await multiReplyTweet(
      userTwitterClients,
      tweetId as string,
      replyText as string,
    );
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
