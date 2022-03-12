import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiLike } from "../services/_likeService";
import { supabaseClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { logger } from "../_logger";

export default async function LikeTweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids, tweetId } = req.query;

  if (ids === undefined) {
    res.status(400).json("Invalid parameter: ids");
  }
  if (tweetId === undefined) {
    res.status(400).json("Invalid parameter: tweetId");
  }

  try {
    await checkAuthentication(req, res);

    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      Array.isArray(ids) ? ids : [ids],
    );

    const response = await multiLike(userTwitterClients, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
