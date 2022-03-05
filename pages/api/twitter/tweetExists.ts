import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { tweetExists } from "../services/_tweetExistsService";

export default async function TweetExistsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await checkAuthentication(req, res);

  const { tweetId } = req.query;

  const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN as string);

  try {
    const response = await tweetExists(twitterClient, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
