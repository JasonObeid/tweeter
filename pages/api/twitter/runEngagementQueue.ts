import type { NextApiRequest, NextApiResponse } from "next";
import { runEngagementQueue } from "../services/_engagementQueueService";
import { supabaseClient } from "../services/_getClients";
import { logger } from "../_logger";

export default async function RunEngagementQueue(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const result = await runEngagementQueue(supabaseClient);
    logger.info(result);

    res.status(200).json(result);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
