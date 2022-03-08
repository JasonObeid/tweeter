import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { generateAuthLink } from "../services/_generateAuthLinkService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function GenerateAuthLinkEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await checkAuthentication(req, res);

  try {
    const generatedAuthLinkResponse = await generateAuthLink(
      supabaseClient,
      twitterClient,
    );
    res.status(200).json(generatedAuthLinkResponse);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json((error as Error).toString());
  }
}
