import type { NextApiRequest, NextApiResponse } from "next";
import { getUserTwitterClients } from "../services/_getUserTwitterClientService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { getTwitterAuths } from "../services/_refreshUserAuthService";

export default async function RefreshUserAuthsEndpoint(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const users = await getTwitterAuths(supabaseClient);
    const userTwitterClients = await getUserTwitterClients(
      supabaseClient,
      twitterClient,
      users.map((user) => user.id),
    );
    const response = await Promise.all(
      userTwitterClients.map(async (client) =>
        client === null ? null : await client.currentUserV2(),
      ),
    );

    res.status(200).json(response);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
