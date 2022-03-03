import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "./services/_getClients";

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers.token;

  if (token !== undefined) {
    const { data: user, error } = await supabaseClient.auth.api.getUser(
      token as string,
    );
    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(user);
  } else {
    return res.status(400).json({ error: "token header is missing" });
  }
}
