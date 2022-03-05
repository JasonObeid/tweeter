import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiLike } from "../services/_likeService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";

export default async function LikeTweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await checkAuthentication(req, res);

  const { ids, tweetId } = req.query;

  try {
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      twitterClient,
      Array.isArray(ids) ? ids : [ids],
    );

    const response = await multiLike(userTwitterClients, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
