import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { multiReplyTweet } from "../services/_replyTweetService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { TwitterAuthUser } from "../../../src/hooks/useTwitterAccounts";

export default async function ReplyTweetEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await checkAuthentication(req, res);

  const { tweetId } = req.query;

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  try {
    const users = JSON.parse(req.body) as unknown as TwitterAuthUser[];
    const ids = users.map((user) => user.id);
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      Array.isArray(ids) ? ids : [ids],
    );
    const response = await multiReplyTweet(
      userTwitterClients,
      tweetId as string,
      users,
    );
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
