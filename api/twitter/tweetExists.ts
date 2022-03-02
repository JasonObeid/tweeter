import { VercelRequest, VercelResponse } from "@vercel/node";
import { TwitterApi } from "twitter-api-v2";
import { tweetExists } from "../services/_tweetExistsService";

export default async function TweetExistsEndpoint(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { tweetId } = req.query;

  const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN);

  try {
    const response = await tweetExists(twitterClient, tweetId as string);
    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
