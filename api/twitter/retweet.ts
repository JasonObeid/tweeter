import { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiRetweet } from "../services/_retweetService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function RetweetEndpoint(
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
    const response = await multiRetweet(userTwitterClients, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
