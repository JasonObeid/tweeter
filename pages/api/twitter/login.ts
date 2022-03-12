import type { NextApiRequest, NextApiResponse } from "next";
import { login } from "../services/_loginService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { logger } from "../_logger";

export default async function TwitterLoginEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { state, code, sessionId } = req.query;

  try {
    await checkAuthentication(req, res);

    const generatedAuthLinkResponse = await login(
      supabaseClient,
      twitterClient,
      state as string,
      code as string,
      sessionId as string,
      process.env.REDIRECT_URI as string,
    );
    res.status(200).json(generatedAuthLinkResponse);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
