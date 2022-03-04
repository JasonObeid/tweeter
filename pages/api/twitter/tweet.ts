import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiTweet } from "../services/_tweetService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function createTweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids, text } = req.query;

  try {
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      twitterClient,
      Array.isArray(ids) ? ids : [ids],
    );
    const response = await multiTweet(userTwitterClients, text as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
