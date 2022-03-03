import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClient } from "../services/_getUserTwitterClientService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function GetUserDetailsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username } = req.query;

  try {
    const userTwitterClient = await getUserTwitterClient(
      supabaseClient,
      twitterClient,
      username as string,
    );
    const { data: userObject } = await userTwitterClient.v2.me();
    res.status(200).json(userObject);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
