import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { tweetExists } from "../services/_tweetExistsService";
import { logger } from "../_logger";

export default async function TweetExistsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tweetId } = req.query;

  if (tweetId === undefined) {
    res.status(400).json("Invalid parameter: tweetId");
  }

  const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN as string);

  try {
    await checkAuthentication(req, res);

    const response = await tweetExists(twitterClient, tweetId as string);
    res
      .status(200)
      .json({ id: response.id, text: response.text, isValid: true });
  } catch (error) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
