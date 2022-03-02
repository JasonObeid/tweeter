import { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiLike } from "../services/_likeService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function LikeTweetEndpoint(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { usernames, tweetId } = req.query;

  try {
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      twitterClient,
      Array.isArray(usernames) ? usernames : [usernames],
    );

    const response = await multiLike(userTwitterClients, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
