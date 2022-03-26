import type { NextApiRequest, NextApiResponse } from "next";
import { runFollowQueue } from "../services/_followQueueService";
import { supabaseClient } from "../services/_getClients";
import { logger } from "../_logger";

export default async function followUserFollowingEndpoint(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const result = await runFollowQueue(supabaseClient);
    logger.info(result);

    res.status(200).json(result);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
