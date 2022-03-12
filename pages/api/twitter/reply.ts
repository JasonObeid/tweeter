import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiReplyTweet } from "../services/_replyTweetService";
import { supabaseClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { TwitterAuthUser } from "../../../src/hooks/useTwitterAccounts";
import { logger } from "../_logger";

export default async function ReplyTweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tweetId } = req.query;

  if (tweetId === undefined) {
    res.status(400).json("Invalid parameter: tweetId");
  }

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  try {
    await checkAuthentication(req, res);

    const users = JSON.parse(req.body) as unknown as TwitterAuthUser[];
    const ids = users.map((user) => user.id);
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      Array.isArray(ids) ? ids : [ids],
    );
    const response = await multiReplyTweet(
      userTwitterClients,
      tweetId as string,
      users.map((user) => user.reply_text),
    );
    res.status(200).json(response);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
