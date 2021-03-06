import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiTweet } from "../services/_tweetService";
import { supabaseClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { logger } from "../_logger";

export default async function createTweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids, text } = req.query;

  if (ids === undefined) {
    res.status(400).json("Invalid parameter: ids");
  }
  if (text === undefined) {
    res.status(400).json("Invalid parameter: text");
  }

  try {
    await checkAuthentication(req, res);

    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      Array.isArray(ids) ? ids : [ids],
    );
    const response = await multiTweet(userTwitterClients, text as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
