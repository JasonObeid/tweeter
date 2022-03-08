import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { refreshUserAuths } from "../services/_refreshUserAuthService";

export default async function RefreshUserAuthsEndpoint(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const users = await refreshUserAuths(twitterClient, supabaseClient);

    res.status(200).json(users);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json((error as Error).toString());
  }
}
