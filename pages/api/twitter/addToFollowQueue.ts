import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { addToFollowQueue } from "../services/_requestFollowService";
import { logger } from "../_logger";

export default async function followUserFollowingEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids, followUsername } = req.query;

  if (ids === undefined) {
    res.status(400).json("Invalid parameter: ids");
  }
  if (followUsername === undefined) {
    res.status(400).json("Invalid parameter: followUsername");
  }

  try {
    const userAuthIds = Array.isArray(ids) ? ids : [ids];

    const result = await addToFollowQueue(
      supabaseClient,
      userAuthIds,
      followUsername as string,
    );
    logger.info(result);

    res.status(200).json(result);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
