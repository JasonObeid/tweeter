import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { generateAuthLink } from "../services/_generateAuthLinkService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { logger } from "../_logger";

export default async function GenerateAuthLinkEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await checkAuthentication(req, res);

    const generatedAuthLinkResponse = await generateAuthLink(
      supabaseClient,
      twitterClient,
    );
    res.status(200).json(generatedAuthLinkResponse);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
