import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiRetweet } from "../services/_retweetService";
import { supabaseClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { logger } from "../_logger";

export default async function RetweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await checkAuthentication(req, res);

  const { ids, tweetId } = req.query;

  try {
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      Array.isArray(ids) ? ids : [ids],
    );
    const response = await multiRetweet(userTwitterClients, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
