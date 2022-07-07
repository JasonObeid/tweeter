import type { NextApiRequest, NextApiResponse } from "next";
import { login } from "../services/_loginService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { logger } from "../_logger";
import { addToFollowQueue } from "../services/_requestFollowService";

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

    try {
      const { data, error } = await supabaseClient
        .from<{ username: string }>("follow_usernames")
        .select("username")
        .single();
      if (error) {
        throw Error(JSON.stringify(error));
      }
      if (data) {
        const result = await addToFollowQueue(
          supabaseClient,
          [generatedAuthLinkResponse.id],
          data.username,
        );
        logger.info(result);
      } else {
        throw Error("follow_usernames was empty");
      }
    } catch (error) {
      logger.error(error);
    }
    res.status(200).json(generatedAuthLinkResponse);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
