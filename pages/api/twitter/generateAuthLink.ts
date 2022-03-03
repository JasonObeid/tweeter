import type { NextApiRequest, NextApiResponse } from "next";
import { generateAuthLink } from "../services/_generateAuthLinkService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function GenerateAuthLinkEndpoint(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const generatedAuthLinkResponse = await generateAuthLink(
      supabaseClient,
      twitterClient,
    );
    res.status(200).json(generatedAuthLinkResponse);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
